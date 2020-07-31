

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