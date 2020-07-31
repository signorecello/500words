/* 
    This challenge tracks how small is the user's pause. 
    He wears it AS LONG as he keeps the max_pause below 4 for 7 submissions in a row
*/
void words::thinker(name user, uint64_t total_time_secs)
{
    challenges user_challenges(_self, user.value);
    auto thinker = user_challenges.find(name(THINKER).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (thinker != user_challenges.end()) {
        user_challenges.modify(thinker, get_self(), [&](auto &p) {
            if (total_time_secs <= THINKER_MIN_TIME) { // 10 minutes
                p.record_value++;
            } else {
                p.record_value = 0;
            }
        });


        if (thinker->record_value == THINKER_STREAK && profile->achievements.find(THINKER) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(THINKER), user))
                .send();
        }
        // if he drops below 7 submissions with max-pause 4 secs, he loses the achievement (oops!)
        else if (thinker->record_value < THINKER_STREAK && profile->achievements.find(THINKER) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "remach"_n,
                std::make_tuple(std::string(NOBREATH), user))
                .send();
        }
    } else {
        user_challenges.emplace(get_self(), [&](auto &p) {
            p.challenge = name(THINKER);
            if (total_time_secs <= THINKER_MIN_TIME) { // 10 minutes
                p.record_value = 1;
            } else {
                p.record_value = 0;
            }
        });
    }

}
