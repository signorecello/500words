#include "words.hpp"

ACTION words::close(name user) {
    profile user_profile(_self, user.value);
    auto it = user_profile.find(0);
    if (it != user_profile.end()) {
        user_profile.erase(it);
    }

    challenges user_challenges(_self, user.value);
    for (auto itr = user_challenges.begin(); itr != user_challenges.end();) {
        itr = user_challenges.erase(itr);
    }
}

// frontend should always first send an "open" action, that will automatically
// register the user for the mandatory challenges
ACTION words::open(name user, const std::string timezone, uint64_t deadline)
{
    profile user_profile(_self, user.value);
    auto it = user_profile.find(0);
    if (it == user_profile.end()) {
        user_profile.emplace(get_self(), [&](auto &p) {
            p.points = 0;
            p.last_post = eosio::current_time_point().sec_since_epoch();
            p.next_post_until = deadline + SUBMISSION_INTERVAL_SECS;
            p.timezone = timezone;
        });
    }
}

ACTION words::change(name user, const std::string timezone, uint64_t past_deadline)
{
    profile user_profile(_self, user.value);
    const auto &profile = user_profile.get(0, "User not found");

    eosio::check(past_deadline < eosio::current_time_point().sec_since_epoch(), "need to send PAST deadline");

    user_profile.modify(profile, get_self(), [&](auto &p) {
        p.next_post_until = past_deadline + SUBMISSION_INTERVAL_SECS;
        p.timezone = timezone;
    });
}

// user posts and it sees if any data matches challenges
// if they do, then it will run the respective function
ACTION words::post(name user, std::string hash, uint64_t wordcount, short max_pause, uint64_t total_time, const std::string type)
{
    require_recipient(user);
    profile user_profile(_self, user.value);
    const auto &profile = user_profile.get(0, "User not found");

    state state_info(_self, _self.value);
    const auto &st = state_info.get(0, "State not found");
    
    speedy(user, total_time);
    nobreath(user, max_pause);
    writer(user, type);
    artist(user, type);
    
    eosio::check(profile.last_post + MIN_SUBMISSION_INTERVAL_SECS < eosio::current_time_point().sec_since_epoch(), "Whoa there! You're posting too frequently!");

    user_profile.modify(profile, get_self(), [&](auto &p) {
        p.last_post = eosio::current_time_point().sec_since_epoch();
    });

    auto new_next_post_until = profile.next_post_until;
    while (new_next_post_until < eosio::current_time_point().sec_since_epoch()) {
        new_next_post_until += SUBMISSION_INTERVAL_SECS;
    }
    
    
    if (profile.next_post_until > eosio::current_time_point().sec_since_epoch()) {

        // deadline is further than the current time
        // if it is further than just 1 submission interval secs, increase the deadline

        // so the deadline (which is greater than the current time) minus the current time is smaller
        // than the submission interval
        if ((profile.next_post_until - eosio::current_time_point().sec_since_epoch()) < SUBMISSION_INTERVAL_SECS) {
            longest(user, true);
            user_profile.modify(profile, get_self(), [&](auto &p) {
                p.points += 10;
                p.next_post_until = new_next_post_until + SUBMISSION_INTERVAL_SECS;
            });
        }
    } else {
        longest(user, false);
        user_profile.modify(profile, get_self(), [&](auto &p) {
            p.next_post_until = new_next_post_until + SUBMISSION_INTERVAL_SECS;
        });
    }

}

void words::writer(name user, const std::string type)
{
    challenges user_challenges(_self, user.value);
    auto longest_streak = user_challenges.find(name(WRITER).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (type == WRITE_TYPE && profile->achievements.find(WRITER) == profile->achievements.end()) {
        action(
            permission_level{get_self(), "active"_n},
            get_self(),
            "newach"_n,
            std::make_tuple(std::string(WRITER), user))
            .send();
    }
}

void words::artist(name user, const std::string type)
{
    challenges user_challenges(_self, user.value);
    auto longest_streak = user_challenges.find(name(ARTIST).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (type == DRAW_TYPE && profile->achievements.find(ARTIST) == profile->achievements.end()) {
        action(
            permission_level{get_self(), "active"_n},
            get_self(),
            "newach"_n,
            std::make_tuple(std::string(ARTIST), user))
            .send();
    }
}

// third section: awarding players
void words::longest(name user, bool valid)
{
    // instantiate tables
    challenges user_challenges(_self, user.value);
    auto longest_streak = user_challenges.find(name(LONGEST).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (longest_streak != user_challenges.end()) {
        // increase counters
        user_challenges.modify(longest_streak, get_self(), [&](auto &c) {
            if (valid) {
                c.record_value += 1;
            } else {
                c.record_value = 0;
            }
        });

        // award/remove
        if (longest_streak->record_value >= LONGEST_ACHIEVEMENT_VALUE && profile->achievements.find(LONGEST) == profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(LONGEST), user))
                .send();
        }
    } else {
        // increase counters
        user_challenges.emplace(get_self(), [&](auto &c) {
            c.challenge = name(LONGEST);
            if (valid) {
                c.record_value = 1;
            } else {
                c.record_value = 0;
            }
        });
    }

}

/* 
    This challenge tracks how small is the user's pause. 
    He wears it AS LONG as he keeps the max_pause below 4 for 7 submissions in a row
*/
void words::nobreath(name user, short max_pause)
{
    challenges user_challenges(_self, user.value);
    auto nobreath = user_challenges.find(name(NOBREATH).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (nobreath != user_challenges.end()) {
        // If the max pause is below 4, increment record, value, else decrement or set it to 0
        user_challenges.modify(nobreath, get_self(), [&](auto &c) {
            if (max_pause < MAX_PAUSE_LIMIT_SECS) {
                c.record_value++;
            } else {
                c.record_value = 0;
            }
        });


        // When user reaches the record_value, he will earn the achievement
        if (nobreath->record_value == NO_BREATH_ACHIEVEMENT_VALUE && profile->achievements.find(NOBREATH) == profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(NOBREATH), user))
                .send();
        }
        // if he drops below 7 submissions with max-pause 4 secs, he loses the achievement (oops!)
        else if (nobreath->record_value < NO_BREATH_ACHIEVEMENT_VALUE && profile->achievements.find(NOBREATH) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "remach"_n,
                std::make_tuple(std::string(NOBREATH), user))
                .send();
        }
    } else {
        // If the max pause is below 4, increment record, value, else decrement or set it to 0
        user_challenges.emplace(get_self(), [&](auto &c) {
            c.challenge = name(NOBREATH);
            if (max_pause < MAX_PAUSE_LIMIT_SECS) {
                c.record_value = 1;
            } else {
                c.record_value = 0;
            }
        });
    }

}

/*
    This challenge tracks the total time to write a post. 
    If the user took less than 10 minutes, increment record_value.
    If the record_value hits 20, he earns the achievement
*/
void words::speedy(name user, uint64_t total_time_secs)
{
    challenges user_challenges(_self, user.value);
    auto speedy = user_challenges.find(name(SPEEDY).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (speedy != user_challenges.end()) {
        user_challenges.modify(speedy, get_self(), [&](auto &p) {
            if (total_time_secs <= TOTAL_TIME_LIMIT_SECS) { // 10 minutes
                p.record_value++;
            } else {
                p.record_value = 0;
            }
        });


        if (speedy->record_value == SPEEDY_ACHIEVEMENT_VALUE && profile->achievements.find(SPEEDY) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(SPEEDY), user))
                .send();
        }
    } else {
        user_challenges.emplace(get_self(), [&](auto &p) {
            p.challenge = name(SPEEDY);
            if (total_time_secs <= TOTAL_TIME_LIMIT_SECS) { // 10 minutes
                p.record_value = 1;
            } else {
                p.record_value = 0;
            }
        });
    }

}



ACTION words::newach(const std::string achievement, name user)
{
    require_recipient(user);
    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);
    user_profile.modify(profile, get_self(), [&](auto &p) {
        p.achievements.insert(achievement);
    });
}

ACTION words::remach(const std::string achievement, name user)
{
    print("Deleted achievement: ", achievement);
    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);
    user_profile.modify(profile, get_self(), [&](auto &p) {
        p.achievements.erase(achievement);
    });
}