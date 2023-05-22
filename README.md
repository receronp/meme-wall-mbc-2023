# Access Control

A small prototype for showcasing one of the motoko backend canisters created during the Motoko Bootcamp 2023. This project implements access control and HTTP Outcalls in a web application using Motoko and Typescript. The application lets users post memes to a public wall, create and answer surveys, post text messages anonymously, and also get details on the price of PEPE/USDT updated hourly (don't want to burn cycles like crazy) through the backend using Timers and the JSON library to parse GET requests to the [Indodax REST API](https://github.com/btcid/indodax-official-api-docs/blob/master/Public-RestAPI.md).

The voting mechanism to rank messages in this project is set to only allow others to vote for a Message that a user creates, but the creator cannot vote on his/her message. The creator can however prompt others to vote as many times as possible for the message they post.

It has been developed using React and Typescript for the frontend, and as an added bonus I wanted to make use of an additional concept called HTTP Outcalls from the Motoko language. To make use of it, the dApp shows the ticker for PEPE/USDT and it is refreshed hourly (don't want to burn cycles like crazy) on the Motoko backend using Timers and the JSON library to parse GET requests to a Web2 API.


## Demo

You can try out the demo [here](https://7bjjl-oaaaa-aaaap-abb2a-cai.icp0.io).

## How to run locally

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 12.0.0
- [DFINITY Canister SDK](https://internetcomputer.org/docs/current/tutorials/deploy_sample_app)

### Steps

1. Clone this repo and install dependencies:

```bash
git clone https://github.com/receronp/meme-wall-mbc-2023.git
cd meme-wall-mbc-2023
npm install
npm install -g ic-mops
mops install
```

2. Start the local internet computer emulator:

```bash
dfx start --background --clean
```

3. Deploy the canisters:

```bash
npm run deploy:local
```

4. Run the vite dev server:

```bash
npm start
```

4. Reset PEPE/USDT price and start timer:

```bash
dfx canister call wall resetPrice
dfx canister call wall startTimer
```

## Inspiration to write this project was taken from the following projects

- [Access Control Tutorial by Kyle Peacock](https://github.com/krpeacock/access-control-tutorial)
- [HTTP Outcall Example by Kyle Peacock](https://github.com/krpeacock/motoko-outcalls-proxy)
- [Exchange Rate Example by Dfinity](https://github.com/dfinity/examples/tree/master/motoko/exchange_rate)
- [Vite Starter for ICP by MioQuispe](https://github.com/MioQuispe/create-ic-app)


## Base Motoko Canister Specifications

[Motoko Bootcamp 2023 | Day 3 Project](https://github.com/motoko-bootcamp/motoko-starter/tree/main/days/day-3/project)


## Documentation

- [Motoko Language](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [HTTP Outcalls](https://internetcomputer.org/docs/current/developer-docs/integrations/http_requests/http_requests-how-it-works)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Tailwind Docs](https://tailwindcss.com/docs/installation)
- [DaisyUI Components](https://daisyui.com/docs/install)
