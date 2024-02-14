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
        return 'cursor-pointer opacity-0 border-2 border-white transition-opacity transition-colors hover:opacity-100';
      case "treasure":
        return 'bg-yellow-600';
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
    <div>
      <div class='flex flex-col min-h-screen h-fit items-center'>
        <div class='px-8 flex justify-center items-center flex-wrap gap-4 pt-10 w-full'>
          <h1 class='text-center h-fit text-4xl font-bold text-white tracking-tighter'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
        </div>
        <div class='flex flex-col justify-center items-center self-stretch flex-grow text-white'>
          <For each={floor().getRooms}>{(row) =>
            <div class='flex flex-row gap-1 mt-1'>
              <For each={row}>{(room) => {
                // console.log(row.length)
                return room &&
                  // Rooms are 8:7
                  <div class='relative overflow-visible'>
                    {room.isVisible() &&
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
