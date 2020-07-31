
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
            p.last_post = 0;
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