import { For, createSignal, type Component } from 'solid-js';
import { Floor, Room } from './game';

const App: Component = () => {
  const [floor, setFloor] = createSignal(new Floor());

  const getRoomStyle = (room: Room) => {
    switch (room.getType()) {
      case "boss":
        return 'bg-red-500';
      case "unknown":
      case "secret":
      case "super-secret":
        return 'bg-black cursor-pointer';
      case "treasure":
        return 'bg-yellow-500';
      default:
        return 'bg-white';
    }
  }

  const onClickRoom = (room: Room) => {
    console.log(room);
  }

  return (
    <div class='relative flex flex-col h-screen bg-neutral-900 justify-center items-center'>
      <h1 class='absolute top-20 text-2xl font-bold text-white'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
      <div class='text-black'>
        <For each={floor().getRooms}>{(row) =>
          <div class='flex flex-row'>
            <For each={row}>{(room) =>
              <div class={`w-16 text-center aspect-square ${getRoomStyle(room)} ${room.isOrigin() && ' bg-neutral-300 after:content-["Spawn"]'}`} onclick={() => onClickRoom(room)}></div>
            }</For>
          </div>
        }</For>
      </div>
    </div>
  );
};

export default App;
