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

  setDeadEnd(deadend: boolean) {
    this.deadEnd = deadend;
  }

  isOrigin() {
    return this.position.row == 0 && this.position.column == 0;
  }

  set setDistanceToCenter(dist: number) {
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
    this.roomsMatrix[row][column] = room;
  }

  constructor(rooms = 20) {
    this.generateFloor(rooms);
  }

  private generateFloor(totalRooms: number) {
    // initialize spawn room
    this.roomsArray = [new Room(0, 0, 0, false, "unknown")];
    this.roomsMatrix = [[this.roomsArray[0]]];
    this.addRoom(0, 0, "empty");
    // running total of rooms left to create
    let roomsLeft = totalRooms;

    const createDeadEnd = (maxLength: number) => {
      const rooms = this.roomsArray.filter((room) => this.getUndefinedNeighbors(room.row, room.column) && this.getRoomNeighbors(room.row, room.column) == 1);
      if (!rooms.length) {
        console.error("Could not find a valid branch coordinate.")
        return;
      }
      let room = getRandomElement(rooms);
      console.log(room)
      while (maxLength) {
        this.addRoom(room.row, room.column, "empty");
        const rooms = Object.values(this.getNeighbors(room.row, room.column)).filter((room) => this.getUndefinedNeighbors(room.row, room.column) && this.getRoomNeighbors(room.row, room.column) == 1);
        if (!rooms.length) {
          room.setDeadEnd(true);
          return;
        }
        room = getRandomElement(rooms);
        --maxLength;
      }
    }
    createDeadEnd(Math.round(roomsLeft / 3));
  }

  /** Returns the number of undefined neighbors */
  public getUndefinedNeighbors(row: number, column: number) {
    return 4 - Object.keys(this.getNeighbors(row, column)).length;
  }

  /** Returns the number of non-unknown rooms connected */
  public getRoomNeighbors(row: number, column: number) {
    return Object.values(this.getNeighbors(row, column))
      .reduce((prev, room) => prev + (room.getType() != 'unknown' ? 1 : 0), 0);
  }

  private addRoom(row: number, column: number, type: RoomType) {
    const room = this.getRoomAtCoord(row, column);
    if (!room) {
      console.error("Invalid room coordinate:", row, column);
      return;
    }
    room.setType(type);
    this.placeUnknownsAround(room);
  }

  private placeUnknownsAround(room: Room) {
    if (room.getType() == 'unknown') {
      console.error("Cannot place rooms around room type 'unknown'");
      return;
    }
    const neighbors = this.getNeighbors(room.row, room.column);
    if (!neighbors.up) {
      if (this.getRowIndex(room.row - 1) < 0) {
        this.roomsMatrix.unshift(Array(this.roomsMatrix[0].length))
        // Only update offset when unshifting
        this.offset.row += 1;
      }
      const newRoom = new Room(room.row - 1, room.column, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row - 1, room.column);
      this.roomsArray.push(newRoom);
    }
    if (!neighbors.down) {
      if (this.getRowIndex(room.row + 1) >= this.roomsMatrix.length) {
        this.roomsMatrix.push(Array(this.roomsMatrix[0].length))
      }
      const newRoom = new Room(room.row + 1, room.column, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row + 1, room.column);
      this.roomsArray.push(newRoom);
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
    }
    if (!neighbors.right) {
      if (this.getColIndex(room.column + 1) < 0) {
        this.roomsMatrix.forEach((row) => row.push(undefined));
      }
      const newRoom = new Room(room.row, room.column + 1, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row, room.column + 1);
      this.roomsArray.push(newRoom);
    }
  }

  public getNeighbors(row: number, column: number) {
    row = this.getRowIndex(row);
    column = this.getColIndex(column);
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

  get getRooms() {
    return this.roomsMatrix;
  }
}
