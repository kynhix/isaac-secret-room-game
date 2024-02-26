## [Live Demo](https://secret-room-game.kynhix.dev/)
You can check out the live demo on my website with the link above.

# Overview
This is a game based on finding the secret room in The Binding of Isaac. The game had to be simplified since it is just a metagame within Isaac. Because of this simpliciation, this game is not a carbon copy of how Isaac generates secret rooms. If you would like to learn more about how Isaac does secret room generation, you can read about it [here](https://bindingofisaacrebirth.fandom.com/wiki/Secret_Room). This game has some similar rules to how the secret room will spawn:
1. Secret rooms will always spawn in a square adjacent to as many rooms as possible.
2. There can be many candidates for where the secret room _can_ spawn.
3. The secret room _cannot_ spawn adjacent to a **red** room.
4. You will always have enough lives to try every possible candidate.

## Future Goals
I would like to add a super secret room. An idea is any extra lives you have left over you can risk to find the super secret room. I also would like to add some different variations to the dead ends (the darker gray squares with only 1 neighboring square). Variations on the normal empty rooms is another possibilty to spice up the game. This is a side project of mine, so it is not the main focus of my attention. Updates might not happen regularly and be infrequent.

## Dependencies
This project uses [Solid](https://www.solidjs.com/) and [TailwindCSS](https://tailwindcss.com/).

## Installation

```bash
$ npm install
```

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
