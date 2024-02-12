import { For, createSignal, type Component, Show } from 'solid-js';
import { Floor, Room } from './game';

const App: Component = () => {
  const [floor, setFloor] = createSignal(new Floor());

  const getRoomStyle = (room: Room) => {
    switch (room.getType()) {
      case "empty":
        return room.isOrigin() ? "bg-neutral-300" : "bg-white";
      case "boss":
        return 'bg-red-500';
      case "unknown":
      case "secret":
      case "super-secret":
        return 'bg-black cursor-pointer transition-colors hover:bg-neutral-800';
      case "treasure":
        return 'bg-yellow-500';
      default:
        return 'bg-white';
    }
  }

  /** Called when a room is clicked */
  const onClickRoom = (room: Room) => {
    console.log(room);
  }

  return (
    <div class='bg-neutral-900'>
      <div class='relative flex flex-col min-h-screen h-fit justify-center items-center'>
        <h1 class='absolute top-20 text-4xl font-bold text-white'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
        <div class='text-black'>
          <For each={floor().getRooms}>{(row) =>
            <div class='flex flex-row'>
              <For each={row}>{(room) => {
                return room &&
                  <div class={`w-16 text-center aspect-square ${getRoomStyle(room)} ${room.isOrigin() && ' after:content-["Spawn"]'}`} onclick={() => onClickRoom(room)}>
                    {/* <div>{room.getDistanceToCenter()}</div> */}
                    <div>{floor().getUndefinedNeighbors(room.row, room.column)}</div>
                  </div>
                  // Needed for spacing 
                  || <div class='w-16 text-center aspect-square'></div>
              }
              }</For>
            </div>
          }</For>
        </div>
      </div>
      <div class='h-24 p-4 flex flex-col justify-end'>
        <div class="text-white">Made with SolidJS and TailwindCSS.</div>
      </div>
    </div>
  );
};

export default App;
