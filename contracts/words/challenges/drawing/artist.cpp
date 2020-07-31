
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

