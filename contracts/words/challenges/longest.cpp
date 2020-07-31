
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