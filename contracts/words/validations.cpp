
bool words::valsub(name user) {
    profile user_profile(_self, user.value);
    const auto &profile = user_profile.get(0, "User not found");

    eosio::check(profile.last_post + MIN_SUBMISSION_INTERVAL_SECS < eosio::current_time_point().sec_since_epoch(), "Whoa there! You're posting too frequently!");

    user_profile.modify(profile, get_self(), [&](auto &p) {
        p.last_post = eosio::current_time_point().sec_since_epoch();
    });

    auto new_next_post_until = profile.next_post_until;
    while (new_next_post_until < eosio::current_time_point().sec_since_epoch()) {
        new_next_post_until += SUBMISSION_INTERVAL_SECS;
    }
    

    if (profile.next_post_until > eosio::current_time_point().sec_since_epoch()) {

        print("1");
        // deadline is further than the current time
        // if it is further than just 1 submission interval secs, increase the deadline

        // so the deadline (which is greater than the current time) minus the current time is smaller
        // than the submission interval
        if ((profile.next_post_until - eosio::current_time_point().sec_since_epoch()) < SUBMISSION_INTERVAL_SECS) {
            // longest(user, true);
            print("2");
            user_profile.modify(profile, get_self(), [&](auto &p) {
                p.points += 10;
                p.next_post_until = new_next_post_until + SUBMISSION_INTERVAL_SECS;
            });
        }
        return true;
    } else {
        print("3");
        // longest(user, false);
        user_profile.modify(profile, get_self(), [&](auto &p) {
            p.next_post_until = new_next_post_until + SUBMISSION_INTERVAL_SECS;
        });
        return false;
    }
    return false;
}