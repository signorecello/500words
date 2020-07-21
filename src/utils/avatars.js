
const murmur = require("murmurhash-js");

const avatars = ["jenny", "daniel", "ade", "chris", "christian", "elliot", "helen"]

export function getAvatar(accname) {
    const hash = murmur.murmur3(accname, "500words!");
    const in_min = 0, in_max = 4294967295, out_min = 0, out_max = avatars.length - 1;
    const map = (hash - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    return avatars[Math.floor(map)];
}