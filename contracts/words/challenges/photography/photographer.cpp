
void words::photographer(name user, const std::string type)
{
    challenges user_challenges(_self, user.value);
    auto longest_streak = user_challenges.find(name(PHOTOGRAPHER).value);

    profile user_profile(_self, user.value);
    auto profile = user_profile.find(0);

    if (type == PHOTO_TYPE && profile->achievements.find(PHOTOGRAPHER) == profile->achievements.end()) {
        action(
            permission_level{get_self(), "active"_n},
            get_self(),
            "newach"_n,
            std::make_tuple(std::string(PHOTOGRAPHER), user))
            .send();
    }
}