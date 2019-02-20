if [[ $# -ne 2 ]]; then
    echo "USAGE: deploy.sh <ACCOUNT NAME> <Contract Name> from within the directory"
    exit 1
fi

ACCOUNT=$1
CONTRACT=$2

eosio-cpp -abigen ${CONTRACT}.cpp -o ${CONTRACT}.wasm -I ./ &&
cleos --url http://testnet.telos.caleos.io set contract ${ACCOUNT} $PWD -p ${ACCOUNT}@active
