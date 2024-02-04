import { For, type Component } from 'solid-js';
import { GameMap } from './game';

const App: Component = () => {
  const game = new GameMap();
  return (
    <div class='relative flex flex-col h-screen bg-neutral-900 text-white justify-center items-center'>
      <h1 class='absolute top-20 text-2xl font-bold'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
      <For each={game.getRooms}>{(row) =>
        <For each={row}>{(room) =>
          <div class='w-24 h-24 bg-white'></div>
        }</For>
      }</For>
    </div>
  );
};

export default App;
