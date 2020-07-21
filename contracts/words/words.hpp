#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/crypto.hpp>
#include <string>
#include <vector>
#include <set>
#include <eosio/print.hpp>

#define SUBMISSION_INTERVAL_SECS 86400
#define LONGEST "longest"
#define LONGEST_ACHIEVEMENT_VALUE 30

#define NOBREATH "nobreath"
#define MAX_PAUSE_LIMIT_SECS 5
#define NO_BREATH_ACHIEVEMENT_VALUE 7

#define SPEEDY "speedy"
#define TOTAL_TIME_LIMIT_SECS 10
#define SPEEDY_ACHIEVEMENT_VALUE 20

#define WRITER "writer"
#define WRITE_TYPE "text"

#define ARTIST "artist"
#define DRAW_TYPE "draw"

#define HOUR 3600

using namespace eosio;


    // enum timez : uint64_t {
    //   min1200 = -HOUR * 12, min1100 = -HOUR * 11, min1000 = -HOUR * 10, min0930 = (-HOUR * 9) - (HOUR / 2), 
    //   min0900 = -HOUR * 9, min0800 = -HOUR * 8, min0700 = -HOUR * 7, min0600 = -HOUR * 6, 
    //   min0500 = -HOUR * 5, min0400 = -HOUR * 4, min0330 = (-HOUR * 3) - (HOUR / 2),
    //   min0300 = -HOUR * 3, min0200 = -HOUR * 2, min0100 = -HOUR,
    //   utc = 0,
    //   plus0100 = HOUR, plus0200 = HOUR * 2, plus0300 = HOUR * 3, plus0330 = (HOUR * 3) + (HOUR / 2), 
    //   plus0400 = HOUR * 4, plus0430 = (HOUR * 4) + (HOUR / 2), plus0500 = HOUR * 5, 
    //   plus0530 = (HOUR * 5) + (HOUR / 2), plus0545 = (HOUR * 5) + ((HOUR / 4) * 3), plus0600 = HOUR * 6, 
    //   plus0630 = (HOUR * 6) + (HOUR / 2), plus0700 = (HOUR * 7), plus0800 = (HOUR * 8), 
    //   plus0845 = (HOUR * 8) + ((HOUR / 4) * 3), plus0900 = (HOUR * 9), plus0930 = (HOUR * 9) + (HOUR / 2), 
    //   plus1000 = HOUR * 10, plus1030 = (HOUR * 10) + (HOUR / 2), plus1100 = HOUR * 11, plus1200 = HOUR * 12, 
    //   plus1245 = (HOUR * 12) + ((HOUR / 4) * 3), plus1300 = HOUR * 13, plus1400 = HOUR * 14
      
    // };

CONTRACT words : public contract
{
  using contract::contract;

  public:
    ACTION close(name user);
    ACTION open(name user, const std::string timezone, uint64_t deadline);
    ACTION change(name user, const std::string timezone, uint64_t past_deadline);
    ACTION post(name user, std::string hash, uint64_t wordcount, short max_pause, uint64_t total_time, const std::string type);
    ACTION newach(const std::string achievement, name user);
    ACTION remach(const std::string achievement, name user);
    void longest(name user, bool valid);
    void nobreath(name user, short max_pause);
    void speedy(name user, uint64_t total_time);
    void writer(name user, const std::string type);
    void artist(name user, const std::string type);

  private:

    // Each player has his table (single table) for his points and last post
    // We will present the leaderboard by iterating through all the rows and ranking them
    TABLE profile_table
    {
        uint64_t points;
        uint32_t next_post_until;
        std::string timezone;
        std::set<std::string> achievements;

        uint64_t primary_key() const { return 0; }
    };

    // The same way, he can register for each challenge and each challenge will have a record
    // We will also list a leaderboard by iteration
    // Challenges may have an expiry date which means if they don't meet a specific record by then, they'll "lose"
    TABLE challenges_table
    {
        name challenge;
        uint64_t record_value; // Records will be presented as uint64_t no matter what
        time_point_sec expiry; // This is kinda optional, functions that manage each challenge may or may not use this

        uint64_t primary_key() const { return challenge.value; }
    };


    TABLE state_table
    {
      std::set<std::string> existing_challenges = {"longest", "speedy", "nobreath", "writer", "artist"};

      uint64_t primary_key() const { return 0; }
    };

    typedef eosio::multi_index<"state"_n, state_table> state;
    typedef eosio::multi_index<"profile"_n, profile_table> profile;
    typedef eosio::multi_index<"challenges"_n, challenges_table> challenges;
};

EOSIO_DISPATCH(words, (close)(open)(change)(post)(newach)(remach))