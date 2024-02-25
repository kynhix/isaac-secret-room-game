import { For, createSignal, type Component, Show, createEffect } from 'solid-js';
import { Floor, Room } from './game';

const App: Component = () => {
  const [floor, setFloor] = createSignal(new Floor(), { equals: false });
  const [streak, setStreak] = createSignal(0);
  const [health, setHealth] = createSignal(3);
  const [isWon, setWon] = createSignal(false);
  const [difficulty, setDifficulty] = createSignal(20);

  let generating = true;

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
          return 'cursor-pointer opacity-0 border-2 border-white transition-opacity transition-colors bg-[#fff2] shadow-[#fff6] focus:opacity-100 hover:opacity-100';
        }
        return room.getType() == 'unknown' ? 'border border-stone-400 bg-stone-900' : 'bg-blue-500 animate-pulse';
      case "treasure":
        return 'bg-yellow-600';
      default:
        return 'bg-white';
    }
  }

  const setFocus = (el: HTMLElement) => setTimeout(() => el.focus());
  let resetButton: HTMLButtonElement | undefined = undefined;

  const regenerateFloor = () => {
    const floor = new Floor(difficulty());
    setFloor(floor);
    setHealth(floor.possibleSecretRooms);
    setWon(false);
    resetButton?.focus();
  }

  const resetGame = () => {
    setStreak(0);
    regenerateFloor();
  }

  createEffect(() => {
    generating = false;
  })

  document.addEventListener("keypress", (ev) => {
    if (ev.key == 'r') {
      isWon() ? regenerateFloor() : resetGame();
    }
    if (ev.key == 'Enter' && document.activeElement !== null && (document.activeElement as HTMLButtonElement).click) {
      (document.activeElement as HTMLButtonElement).click();
    }
    ev.preventDefault();
  });

  const [depend, rerenderRooms] = createSignal(undefined, { equals: false });
  /** Called when a room is clicked */
  const onClickRoom = (room: Room) => {
    if (health() <= 0 || isWon()) {
      return;
    }
    if (room.getType() == 'unknown') {
      setHealth(health() - 1);
    } else if (room.getType() == 'secret') {
      setStreak(streak() + 1);
      setWon(true);
    }
    if (!room.isVisible()) {
      room.setVisible(true);
    }
    // console.log(room);
    setFloor((floor) => {
      return floor;
    })
    rerenderRooms();
  }

  return (
    <div class='relative w-full overflow-y-auto'>
      <div class='w-full min-h-screen h-fit flex flex-col'>
        <div class='p-4 sm:p-8 flex flex-wrap gap-2 justify-between w-full'>
          <h1 class='hidden md:block text-2xl lg:text-3xl px-8 py-6 font-bold tracking-tighter text-blue-100 shadow shadow-[#03070CaF] bg-gray-900'>Secret Room Game</h1>
          <div class="flex gap-2">
            <div class='flex gap-2 items-center text-3xl tracking-tight font-bold p-2 pr-4 bg-gray-900 shadow shadow-[#03070CaF] text-rose-100'>
              <svg width="64px" height="64px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              {health()}
            </div>
            <div class='flex gap-2 items-center text-3xl tracking-tight font-bold p-2 pr-4 bg-gray-900 shadow shadow-[#03070CaF] text-orange-100'>
              <svg fill="#fb923c" width="64px" height="64px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" d="M12.185 21.5c4.059 0 7.065-2.84 7.065-6.75 0-2.337-1.093-3.489-2.678-5.158l-.021-.023c-1.44-1.517-3.139-3.351-3.649-6.557a6.14 6.14 0 00-1.911 1.76c-.787 1.144-1.147 2.633-.216 4.495.603 1.205.777 2.74-.277 3.794-.657.657-1.762 1.1-2.956.586-.752-.324-1.353-.955-1.838-1.79-.567.706-.954 1.74-.954 2.893 0 3.847 3.288 6.75 7.435 6.75zm2.08-19.873c-.017-.345-.296-.625-.632-.543-2.337.575-6.605 4.042-4.2 8.854.474.946.392 1.675.004 2.062-.64.64-1.874.684-2.875-1.815-.131-.327-.498-.509-.803-.334-1.547.888-2.509 2.86-2.509 4.899 0 4.829 4.122 8.25 8.935 8.25 4.812 0 8.565-3.438 8.565-8.25 0-2.939-1.466-4.482-3.006-6.102-1.61-1.694-3.479-3.476-3.479-7.021z"></path></g></svg>
              {streak()}
            </div>
          </div>
          <button ref={resetButton} onclick={isWon() ? regenerateFloor : resetGame} class={`p-2 rounded-full text-4xl font-bold text-blue-100 shadow shadow-[#03070CaF] transition-all ${isWon() ? 'bg-emerald-100' : 'bg-gray-900'}`}>
            <Show
              when={isWon()}
              fallback={<svg class="hover:rotate-[181deg] transition-all" width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 3V8M3 8H8M3 8L6 5.29168C7.59227 3.86656 9.69494 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.71683 21 4.13247 18.008 3.22302 14" stroke="#f0f9ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}>
              <svg width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#064e3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </Show>
          </button>
        </div>
        <div class="flex m-auto w-full h-full overflow-auto self-center">
          <div class='flex flex-col m-auto w-fit p-4 items-center flex-grow text-white'>
            <For each={floor().getRooms()}>{(row) =>
              <div class='flex flex-row gap-1 mt-1 m-auto'>
                <For each={row}>{(room) => {
                  // console.log(row.length)
                  return room &&
                    // Rooms are 8:7
                    <div class='relative overflow-visible'>
                      {!depend() && room.isVisible() &&
                        <div style={room.alwaysVisible() && `animation-delay: ${room.getDistanceToCenter() * 50}ms` || ''} class={`w-full h-full ${room.alwaysVisible() && 'animate-fademovein opacity-0'} absolute outline outline-[16px] outline-stone-900 bg-neutral-900`}></div>}
                      <div onKeyPress={(e) => e.key == 'Enter' && onClickRoom(room)} tabindex={!depend() && !room.isVisible() && health() != 0 && !isWon() && "0" || "-1"} style={room.alwaysVisible() && room.isVisible() && `animation-delay: ${room.getDistanceToCenter() * 50}ms` || ''} class={`w-16 h-14 ${room.alwaysVisible() && 'animate-fademovein opacity-0'} rounded-md shadow-inner shadow-[#000a] text-center ${!depend() && getRoomStyle(room)} z-10 relative`} onclick={() => onClickRoom(room)}>
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
      </div>
      <div class='h-fit p-4 flex flex-col justify-end bg-gray-900 text-blue-50'>
        <h2 class="text-blue-50 text-xl font-semibold">How to play:</h2>
        <p>
          Secret rooms are always in adjecent squares to the most connecting rooms.<br />
          With one exception, a secret room will <span>never</span> be adjacent to a red room.
        </p>
        <br />
        <h2 class="text-blue-50 text-xl font-semibold">Difficulty: </h2>
        <h2 class="text-blue-50">Note: Changes will take effect on next floor.</h2>
        <div class="flex gap-4">
          <button onclick={() => setDifficulty(20)} class={`${difficulty() == 20 ? 'bg-gray-200' : 'bg-gray-950'} p-3 w-24 text-lg ${difficulty() == 20 ? 'text-gray-950' : 'text-gray-50'} hover:shadow hover:shadow-black transition-all`}>Easy</button>
          <button onclick={() => setDifficulty(30)} class={`${difficulty() == 30 ? 'bg-gray-200' : 'bg-gray-950'} p-3 w-24 text-lg ${difficulty() == 30 ? 'text-gray-950' : 'text-gray-50'} hover:shadow hover:shadow-black transition-all`}>Medium</button>
          <button onclick={() => setDifficulty(40)} class={`${difficulty() == 40 ? 'bg-gray-200' : 'bg-gray-950'} p-3 w-24 text-lg ${difficulty() == 40 ? 'text-gray-950' : 'text-gray-50'} hover:shadow hover:shadow-black transition-all`}>Hard</button>
        </div>
        <p class="text-blue-50 mt-10">Made with SolidJS and TailwindCSS.</p>
      </div>
      <Show when={isWon()}>
        <div class='flex fixed flex-col gap-7 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 min-w-80 p-8 shadow-lg shadow-stone-950 bg-stone-700'>
          <h1 class='text-4xl font-bold tracking-tighter text-stone-50 w-fit text-center'>You found the <span class='text-blue-300'>Secret Room!</span></h1>
          <button tabindex='0' ref={setFocus} onclick={regenerateFloor} class='m-auto bg-green-200 p-4 text-lg font-semibold text-green-900 hover:shadow hover:shadow-black transition-all'>New Floor</button>
        </div>
      </Show>
      <Show when={health() == 0}>
        <div class='flex fixed flex-col gap-4 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 min-w-80 p-8 shadow-lg shadow-stone-950 bg-stone-700'>
          <h1 class='w-full text-4xl font-bold tracking-tighter text-stone-50 text-center'>You ran out of <span class='text-red-400'>lives!</span></h1>
          <button tabindex='0' ref={setFocus} onclick={resetGame} class='m-auto bg-red-200 p-4 text-lg text-red-950 hover:shadow hover:shadow-black transition-all'>New Game</button>
        </div>
      </Show>
    </div>
  );
};

export default App;
