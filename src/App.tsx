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
    <div class='bg-neutral-950'>
      <div class='flex flex-col min-h-screen h-fit items-center'>
        <div class='px-8 flex justify-center items-center flex-wrap gap-4 pt-10 w-full'>
          <h1 class='text-center h-fit text-4xl font-bold text-white tracking-tighter'>The Binding of Isaac: <span class='text-blue-400'>Secret Room Game</span></h1>
          <svg width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(4.32,4.32), scale(0.64)"><rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="14.4" fill="#0000" stroke-width="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8H12.01M12 11V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div class='flex flex-col justify-center items-center self-stretch flex-grow text-white'>
          <For each={floor().getRooms}>{(row) =>
            <div class='flex flex-row gap-1 mt-1'>
              <For each={row}>{(room) => {
                // console.log(row.length)
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
