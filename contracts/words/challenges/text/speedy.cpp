
/*
    This challenge tracks the total time to write a post. 
    If the user took less than 10 minutes, increment record_value.
*/
void words::speedy(name user, uint64_t total_time_secs)
{
    challenges user_challenges(_self, user.value);
    auto speedy = user_challenges.find(name(SPEEDY).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (speedy != user_challenges.end()) {
        user_challenges.modify(speedy, get_self(), [&](auto &p) {
            if (total_time_secs <= SPEEDY_MAX_TIME) { // 10 minutes
                p.record_value++;
            } else {
                p.record_value = 0;
            }
        });


        if (speedy->record_value == SPEEDY_STREAK && profile->achievements.find(SPEEDY) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(SPEEDY), user))
                .send();
        }
        // if he drops below 7 submissions with max-pause 4 secs, he loses the achievement (oops!)
        else if (speedy->record_value < SPEEDY_STREAK && profile->achievements.find(SPEEDY) != profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "remach"_n,
                std::make_tuple(std::string(SPEEDY), user))
                .send();
        }
    } else {
        user_challenges.emplace(get_self(), [&](auto &p) {
            p.challenge = name(SPEEDY);
            if (total_time_secs <= SPEEDY_MAX_TIME) { // 10 minutes
                p.record_value = 1;
            } else {
                p.record_value = 0;
            }
        });
    }

}
