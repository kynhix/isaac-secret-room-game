export type RoomType = "empty" | "boss" | "treasure" | "cursed" | "shop" | "secret" | "super-secret" | "sacrafice" | "miniboss" | "unknown";

type Neighbors = {
  up?: Room;
  down?: Room;
  left?: Room;
  right?: Room;
};

export class Room {
  private type: RoomType;
  /** The number of rooms you have to go through to get to the center of the map. */
  private distToCenter: number;
  private position: { row: number, column: number };
  private deadEnd: boolean;
  /** Only relevant to unknown, secret, and super-secret rooms */
  private visible: boolean = false;
  private connections: number;

  constructor(row: number, column: number, dist: number, deadEnd: boolean, type: RoomType = "empty") {
    this.type = type;
    this.position = { row: row, column: column };
    this.distToCenter = dist;
    this.deadEnd = deadEnd;
    this.connections = 0;
  }

  get row() {
    return this.position.row;
  }

  get column() {
    return this.position.column;
  }

  getType() {
    return this.type;
  }

  setType(type: RoomType) {
    this.type = type;
  }

  getPosition() {
    return { ...this.position };
  }

  getDistanceToCenter() {
    return this.distToCenter;
  }

  isDeadEnd() {
    return this.deadEnd;
  }

  isVisible() {
    if (this.type != 'unknown' && this.type != 'secret' && this.type != 'super-secret') {
      return true;
    }
    return this.visible;
  }

  setVisible(visibility: boolean) {
    this.visible = visibility;
  }

  setDeadEnd(deadend: boolean) {
    this.deadEnd = deadend;
  }

  isOrigin() {
    return this.position.row == 0 && this.position.column == 0;
  }

  setDistanceToCenter(dist: number) {
    this.distToCenter = dist;
  }
};

function getRandomElement<Type>(arr: Array<Type>): Type {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Floor {
  private roomsMatrix: Array<Array<Room | undefined>> = [[]];
  private roomsArray: Array<Room> = [];
  private offset: { row: number, column: number } = { row: 0, column: 0 }

  private getRowIndex(row: number) {
    return row + this.offset.row;
  }

  private getColIndex(row: number) {
    return row + this.offset.column;
  }

  private getRoomAtCoord(row: number, column: number) {
    row = this.getRowIndex(row);
    column = this.getColIndex(column);
    return this.roomsMatrix[row] && this.roomsMatrix[row][column];
  }

  private setRoomAtCoord(room: Room, row: number, column: number) {
    row = this.getRowIndex(row);
    column = this.getColIndex(column);
    if (row < 0 || column < 0 || row >= this.roomsMatrix.length || column >= this.roomsMatrix[0].length) {
      console.error("Cannot set room outside of boundaries ", row, column);
      return;
    }
    this.roomsMatrix[row][column] = room;
  }

  constructor(rooms = 20) {
    this.generateFloor(rooms);
  }

  /** Part of initialization. Randomly generates the room. */
  private generateFloor(totalRooms: number) {
    // initialize spawn room
    this.roomsArray = [new Room(0, 0, 0, false, "unknown")];
    this.roomsMatrix = [[this.roomsArray[0]]];
    this.placeRoom(0, 0, "empty");
    // running total of rooms left to create
    let roomsLeft = totalRooms;

    const createDeadEnd = (maxDist: number, type: RoomType = "empty") => {
      const branchFilter = (room: Room) => {
        return room.getDistanceToCenter() <= maxDist
          && this.getUndefinedNeighbors(room)
          && this.getRoomNeighbors(room) == 1
          && !this.isUnknownDeadEnd(room)
      }

      let rooms = this.roomsArray.filter(branchFilter);
      if (!rooms.length) {
        console.error("Could not find a valid branch coordinate.")
        return;
      }

      let room: Room | undefined;
      for (let i = 0; i < maxDist; ++i) {
        room = getRandomElement(rooms);
        this.placeRoom(room.row, room.column, 'empty');
        rooms = Object.values(this.getNeighbors(room)).filter(branchFilter)
        if (!rooms.length) {
          room.setDeadEnd(true);
          room.setType(type)
          return;
        }
      }
      room?.setDeadEnd(true);
      room?.setType(type);
    }
    createDeadEnd(Math.round(roomsLeft / 3), "boss");
    createDeadEnd(Math.round(roomsLeft / 3 - 1));
    createDeadEnd(Math.round(roomsLeft / 3 - 2));
    createDeadEnd(Math.round(roomsLeft / 3 - 3));

    const placeSecretRoom = () => {
      const unknownRooms = this.roomsArray.filter((room) => room.getType() == 'unknown' && !this.isRoomConnectedToBoss(room));
      const maxRoomNeighbors = unknownRooms.reduce((n, room) => Math.max(n, this.getRoomNeighbors(room)), 0);
      const candidates = unknownRooms.filter((room) => this.getRoomNeighbors(room) == maxRoomNeighbors);
      if (candidates.length == 0) {
        console.error("FAILED TO PLACE SECRET ROOM ", maxRoomNeighbors)
        return;
      }
      getRandomElement(candidates).setType("secret");
      // const set = new Set<Room>();
      // console.log(candidates.length);
    }
    placeSecretRoom();
  }

  /** Returns the number of undefined neighbors */
  public getUndefinedNeighbors(room: Room) {
    return 4 - Object.keys(this.getNeighbors(room)).length;
  }

  /** Returns the number of non-unknown rooms connected */
  public getRoomNeighbors(room: Room) {
    return Object.values(this.getNeighbors(room))
      .reduce((prev, room) => prev + (room.getType() != 'unknown' ? 1 : 0), 0);
  }

  public isRoomConnectedToBoss(room: Room) {
    return Object.values(this.getNeighbors(room)).some(room => room.getType() == 'boss');
  }

  /** Returns whether or not an unknown room is connected to a dead end
   * and therefore should not be considered when creating a branch. */
  public isUnknownDeadEnd(room: Room) {
    return Object.values(this.getNeighbors(room)).some((room) => room.isDeadEnd());
  }

  private placeRoom(row: number, column: number, type: RoomType) {
    const room = this.getRoomAtCoord(row, column);
    if (!room) {
      console.error("Invalid room coordinate:", row, column);
      return;
    }
    room.setType(type);
    this.placeUnknownsAround(room);
    this.updateDistToCenter(room);
  }

  private updateDistToCenter(room: Room) {
    if (room.getType() == 'unknown') {
      console.warn('Will not update distance to center of unknown room type.')
      return;
    }
    const neighbors = Object.values(this.getNeighbors(room)).filter((room) => room.getType() != 'unknown');
    if (!neighbors.length) {
      return;
    }
    const dist = neighbors.reduce((prev, cur) => Math.min(prev, cur.getDistanceToCenter()), 1337);
    room.setDistanceToCenter(dist + 1);
  }

  private placeUnknownsAround(room: Room) {
    if (room.getType() == 'unknown') {
      console.error("Cannot place rooms around room type 'unknown'");
      return;
    }
    const neighbors = this.getNeighbors(room);
    const allSameSize = () => {
      if (this.roomsMatrix.some((row) => row.length != this.roomsMatrix[0].length)) {
        console.error("NOT SAME SIZE")
        throw "FUCK"
      }
    }
    if (!neighbors.up) {
      if (this.getRowIndex(room.row - 1) < 0) {
        this.roomsMatrix.unshift(Array(this.roomsMatrix[0].length))
        // Only update offset when unshifting
        this.offset.row += 1;
      }
      const newRoom = new Room(room.row - 1, room.column, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row - 1, room.column);
      this.roomsArray.push(newRoom);
      allSameSize();
    }
    if (!neighbors.down) {
      if (this.getRowIndex(room.row + 1) >= this.roomsMatrix.length) {
        this.roomsMatrix.push(Array(this.roomsMatrix[0].length))
      }
      const newRoom = new Room(room.row + 1, room.column, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row + 1, room.column);
      this.roomsArray.push(newRoom);
      allSameSize();
    }
    if (!neighbors.left) {
      if (this.getColIndex(room.column - 1) < 0) {
        this.roomsMatrix.forEach((row) => row.unshift(undefined));
        // Only update offset when unshifting
        this.offset.column += 1;
      }
      const newRoom = new Room(room.row, room.column - 1, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row, room.column - 1);
      this.roomsArray.push(newRoom);
      allSameSize();
    }
    if (!neighbors.right) {
      if (this.getColIndex(room.column + 1) >= this.roomsMatrix[0].length) {
        this.roomsMatrix.forEach((row) => row.push(undefined));
      }
      const newRoom = new Room(room.row, room.column + 1, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row, room.column + 1);
      this.roomsArray.push(newRoom);
      allSameSize();
    }
  }

  public getNeighbors(room: Room) {
    const row = this.getRowIndex(room.row);
    const column = this.getColIndex(room.column);
    const neighbors: Neighbors = {};
    if (!this.roomsMatrix[row][column]) {
      console.error("Invalid coordinates: ", row, column)
      return neighbors;
    }

    if (this.roomsMatrix[row - 1] && this.roomsMatrix[row - 1][column]) {
      neighbors.up = this.roomsMatrix[row - 1][column];
    }
    if (this.roomsMatrix[row + 1] && this.roomsMatrix[row + 1][column]) {
      neighbors.down = this.roomsMatrix[row + 1][column];
    }
    if (this.roomsMatrix[row] && this.roomsMatrix[row][column - 1]) {
      neighbors.left = this.roomsMatrix[row][column - 1];
    }
    if (this.roomsMatrix[row] && this.roomsMatrix[row][column + 1]) {
      neighbors.right = this.roomsMatrix[row][column + 1];
    }
    return neighbors;
  }

  getRooms() {
    return this.roomsMatrix;
  }
}
