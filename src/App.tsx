import { For, createSignal, type Component, Show } from 'solid-js';
import { Floor, Room } from './game';

const App: Component = () => {
  const [floor, setFloor] = createSignal(new Floor());

  const getRoomStyle = (room: Room) => {
    let result = '';
    if (room.isDeadEnd()) {
      return 'bg-red-500';
    }
    switch (room.getType()) {
      case "empty":
        return room.isOrigin() ? "bg-neutral-400" : "bg-neutral-500";
      case "boss":
        return 'bg-red-500';
      case "unknown":
      case "secret":
      case "super-secret":
        return (floor().isUnknownDeadEnd(room) ? ' ' : 'bg-transparent ') + 'cursor-pointer transition-colors hover:bg-neutral-800';
      case "treasure":
        return 'bg-yellow-500';
      default:
        return 'bg-white';
    }
  }

  document.addEventListener("keypress", (ev) => {
    if (ev.key == 'r') {
      setFloor(new Floor());
    }
  })

  /** Called when a room is clicked */
  const onClickRoom = (room: Room) => {
    console.log(room);
  }

  return (
    <div class='bg-neutral-950'>
      <div class='relative flex flex-col min-h-screen h-fit justify-center items-center'>
        <h1 class='absolute top-20 text-4xl font-bold text-white tracking-tighter'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
        <div class='text-white'>
          <For each={floor().getRooms}>{(row) =>
            <div class='flex flex-row'>
              <For each={row}>{(room) => {
                return room &&
                  // Rooms are 8:7
                  <div class='relative overflow-visible'>
                    {room.getType() != 'unknown' &&
                      <div class='w-full h-full absolute outline outline-[16px] outline-neutral-900 bg-neutral-900'></div>}
                    <div class={`w-16 h-14 rounded-md text-center ${getRoomStyle(room)} z-10 relative`} onclick={() => onClickRoom(room)}>
                      {/* <div>{room.getDistanceToCenter()}</div> */}
                    </div>
                  </div>
                  // Needed for spacing
                  || <div class='w-16 h-14 text-center'></div>
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
