
ACTION words::postphoto(name user, const std::string hash, const std::string type)
{
    require_auth(user);
    require_recipient(user);
    eosio::check(type == PHOTO_TYPE, "Wrong function for that type");

    if (valsub(user)) {
        longest(user, true);
        photographer(user, type);
    } else {
        longest(user, false);
    }

}

ACTION words::postdrawing(name user, const std::string hash, const std::string type)
{
    require_auth(user);
    require_recipient(user);
    eosio::check(type == DRAW_TYPE, "Wrong function for that type");

    if (valsub(user)) {
        longest(user, true);
        artist(user, type);
    } else {
        longest(user, false);
    }
}

// user posts and it sees if any data matches challenges
// if they do, then it will run the respective function
ACTION words::posttext(name user, const std::string hash, uint64_t wordcount, short max_pause, uint64_t total_time, const std::string type)
{
    require_auth(user);
    require_recipient(user);
    eosio::check(type == WRITE_TYPE, "Wrong function for that type");

        
    if (valsub(user)) {
        longest(user, true);
        speedy(user, total_time);
        thinker(user, total_time);
        nobreath(user, max_pause);
        writer(user, type);    
    } else {
        longest(user, false);
    }

}