

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
        if (nobreath->record_value == NO_BREATH_STREAK && profile->achievements.find(NOBREATH) == profile->achievements.end()) {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "newach"_n,
                std::make_tuple(std::string(NOBREATH), user))
                .send();
        }
        // if he drops below 7 submissions with max-pause 4 secs, he loses the achievement (oops!)
        else if (nobreath->record_value < NO_BREATH_STREAK && profile->achievements.find(NOBREATH) != profile->achievements.end()) {
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
