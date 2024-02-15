import { For, createSignal, type Component, Show, createEffect } from 'solid-js';
import { Floor, Room } from './game';

const App: Component = () => {
  const [floor, setFloor] = createSignal(new Floor(), { equals: false });

  const getRoomStyle = (room: Room) => {
    let result = '';
    switch (room.getType()) {
      case "empty":
        if (room.isOrigin()) {
          return 'bg-stone-300'
        }
        if (room.isDeadEnd()) {
          return 'bg-stone-700';
        }
        return "bg-stone-500";
      case "boss":
        return 'bg-red-500';
      case "unknown":
      case "secret":
      case "super-secret":
        if (!room.isVisible()) {
          return 'cursor-pointer opacity-0 border-2 border-white transition-opacity transition-colors bg-[#fff2] shadow-[#fff6] hover:opacity-100';
        }
        return room.getType() == 'unknown' ? 'border-black bg-stone-900' : 'bg-blue-500 animate-pulse';
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
    ev.preventDefault();
  });

  const [depend, rerun] = createSignal(undefined, { equals: false });
  /** Called when a room is clicked */
  const onClickRoom = (room: Room) => {
    if (room.getType() == 'unknown') {
      // Wrong room
    } else if (room.getType() == 'secret') {

    }
    if (!room.isVisible()) {
      room.setVisible(true);
    }
    console.log(room);
    setFloor((floor) => {
      return floor;
    })
    rerun();
  }

  createEffect(() => console.log("testing"))
  return (
    <div class='relative w-fit min-w-full overflow-auto'>
      <div class='w-full min-h-screen h-fit flex flex-col items-center'>
        <div class='p-8 flex justify-between w-full'>
          <h1 class='text-3xl px-8 py-6 font-bold tracking-tighter text-blue-100 shadow shadow-[#03070CaF] bg-gray-900'>Secret Room Game</h1>
          <div class='p-6 text-4xl font-bold text-blue-100 shadow shadow-[#03070CaF] bg-gray-900'>
            <svg fill="#eff6ff" height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1792 1792" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>fiction</title> <path d="M1673.9,1363.2L1673.9,1363.2c0,52.3-42.4,94.3-94.3,94.3H212.7c-52.3,0-94.3-42.4-94.3-94.3l0,0 c0-52.3,42.4-94.3,94.3-94.3h1366.8C1631.5,1268.5,1673.9,1310.9,1673.9,1363.2z"></path> <path d="M1673.9,895.6L1673.9,895.6c0,52.3-42.4,94.3-94.3,94.3H213c-52.3,0-94.3-42.4-94.3-94.3l0,0c0-52.3,42.4-94.3,94.3-94.3 h1366.6C1631.5,800.8,1673.9,843.2,1673.9,895.6z"></path> <path d="M1673.9,427.9L1673.9,427.9c0,52.3-42.4,94.3-94.3,94.3H212.7c-52.3,0-94.3-42.4-94.3-94.3l0,0c0-52.3,42.4-94.3,94.3-94.3 h1366.8C1631.5,333.2,1673.9,375.6,1673.9,427.9z"></path> </g></svg>
          </div>
        </div>
        <div class='flex flex-col w-fit min-w-full p-4 justify-center items-center self-stretch flex-grow text-white'>
          <For each={floor().getRooms()}>{(row) =>
            <div class='flex flex-row gap-1 mt-1'>
              <For each={row}>{(room) => {
                // console.log(row.length)
                return room &&
                  // Rooms are 8:7
                  <div class='relative overflow-visible'>
                    {!depend() && room.isVisible() &&
                      <div class='w-full h-full absolute outline outline-[16px] outline-stone-900 bg-neutral-900'></div>}
                    <div class={`w-16 h-14 rounded-md shadow-inner shadow-[#000a] text-center ${!depend() && getRoomStyle(room)} z-10 relative`} onclick={() => onClickRoom(room)}>
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
      <div class='h-24 p-4 flex flex-col justify-end bg-gray-900'>
        <div class="text-blue-50">Made with SolidJS and TailwindCSS.</div>
      </div>
    </div>
  );
};

export default App;
