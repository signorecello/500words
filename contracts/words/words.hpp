#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/crypto.hpp>
#include <string>
#include <vector>
#include <set>
#include <eosio/print.hpp>

#define SUBMISSION_INTERVAL_SECS 300
#define MIN_SUBMISSION_INTERVAL_SECS 20

#define WRITER "writer"
#define WRITE_TYPE "text"

#define ARTIST "artist"
#define DRAW_TYPE "draw"

#define PHOTOGRAPHER "photographer"
#define PHOTO_TYPE "photo"

// // ACHIEVEMENT CONSTANTS for DEV
// #define LONGEST "longest"
// #define LONGEST_ACHIEVEMENT_VALUE 3

// #define NOBREATH "nobreath"
// #define MAX_PAUSE_LIMIT_SECS 10
// #define NO_BREATH_STREAK 3

// #define SPEEDY "speedy"
// #define SPEEDY_MAX_TIME 600
// #define SPEEDY_STREAK 3

// #define THINKER "thinker"
// #define THINKER_STREAK 3
// #define THINKER_MIN_TIME 2


// ACHIEVEMENT CONSTANTS for PROD
#define LONGEST "longest"
#define LONGEST_ACHIEVEMENT_VALUE 30

#define NOBREATH "nobreath"
#define MAX_PAUSE_LIMIT_SECS 10
#define NO_BREATH_STREAK 7

#define SPEEDY "speedy"
#define SPEEDY_MAX_TIME 600
#define SPEEDY_STREAK 7

#define THINKER "thinker"
#define THINKER_STREAK 7
#define THINKER_MIN_TIME 1800


using namespace eosio;

CONTRACT words : public contract
{
  using contract::contract;

  public:
    ACTION close(name user);
    ACTION open(name user, const std::string timezone, uint64_t deadline);
    ACTION change(name user, const std::string timezone, uint64_t past_deadline);
    ACTION posttext(name user, const std::string hash, uint64_t wordcount, short max_pause, uint64_t total_time, const std::string type);
    ACTION postdrawing(name user, const std::string hash, const std::string type);
    ACTION postphoto(name user, const std::string hash, const std::string type);
    ACTION newach(const std::string achievement, name user);
    ACTION remach(const std::string achievement, name user);
    bool valsub(name user);

    void longest(name user, bool valid);
    void nobreath(name user, short max_pause);
    void speedy(name user, uint64_t total_time_secs);
    void thinker(name user, uint64_t total_time_secs);
    void writer(name user, const std::string type);
    void artist(name user, const std::string type);
    void photographer(name user, const std::string type);

  private:

    // Each player has his table (single table) for his points and last post
    // We will present the leaderboard by iterating through all the rows and ranking them
    TABLE profile_table
    {
        uint64_t points;
        uint32_t next_post_until;
        uint32_t last_post;
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

    typedef eosio::multi_index<"profile"_n, profile_table> profile;
    typedef eosio::multi_index<"challenges"_n, challenges_table> challenges;
};

EOSIO_DISPATCH(words, (close)(open)(change)(posttext)(postphoto)(postdrawing)(newach)(remach))