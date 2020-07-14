# 500words

Try the working website at https://fivehundredw.herokuapp.com/ !

## What?

500words is a decentralized application running on your browser that challenges you to write at least 500 words a day. Writing, drawing, improvising (music) keeps your brain clean and exercises your creativity!

You also can earn some little achievements for being extra fast every day, or for writing for a number of days in a row. This worthless achievements can be fun just to show off!

## Why?

First of all, because I was a teacher and now that I'm a web developer, I found that creativity is key for this job. The more you develop it, the more you see the broader picture and find smart and uncommon solutions for your problems.

Second, because one of the best things of blockchain is the amount of stuff you can do directly ON the blockchain. You can think of the blockchain as a very secure (yet slow and expensive) database. With the right interactions, you can almost treat a smart contract as a backend.

And third, because I wanted to try the new Facebook's state manager: [Recoil](https://recoiljs.org/). I like [Redux](https://redux.js.org/) but I also want to learn something new everytime. Recoil is amazing!

This project is basically an exercise on how much can you do without a backend. It's just a webpage interacting with your wallet and with the blockchain.

## How?

I did this using a EOSIO-based blockchain, called [Telos](https://www.telosfoundation.io/). For interacting with it, I implemented the [Scatter](https://get-scatter.com/) protocol. 

For the frontend, I used [React.js](https://reactjs.org) and [Recoil.js](https://recoiljs.org/). I also decided to experiment [semantic-ui](https://semantic-ui.com/) for the design assets. I liked them!

As I say, this app has no backend! But eventually I'll want to interact with [QUDO](https://qudo.io), the rewarding mechanism I created for [BlockBastards](https://blockbastards.io). For that I'll need some kind of simple backend.

## I want to clone this!

I'm happy this little project pleased you! Go ahead and clone it! Some things you may want to know:

- The contract is in the "contracts" folder. Just open the .hpp file and change the top defines to whatever constants you want. Some of them you'll also have to replicate on the .env file.
- Rename the .env.example file to .env and change the variables inside to your liking
- Run npm i to install dependencies
- Run npm start to start your dapp!
- You'll need to install Scatter (or other scatter-based wallets such as Wombat) and add the telos testnet network

## I want to help too!

Much appreciated. Just clone, make the changes, and PR :)