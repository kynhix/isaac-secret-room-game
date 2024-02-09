export type RoomType = "empty" | "boss" | "treasure" | "cursed" | "shop" | "secret" | "super-secret" | "sacrafice" | "miniboss" | "unknown";

type Neighbors = {
  up?: Room;
  down?: Room;
  left?: Room;
  right?: Room;
  length: number;
};

const forEachNeighbor = (neighbors: Neighbors, callback: (room: Room) => void) => {
  if (neighbors.length == 0) {
    return;
  }
  neighbors.up && callback(neighbors.up);
  neighbors.down && callback(neighbors.down);
  neighbors.left && callback(neighbors.left);
  neighbors.right && callback(neighbors.right);
}

export class Room {
  private type: RoomType;
  /** The number of rooms you have to go through to get to the center of the map. */
  private distToCenter: number;
  private position: { row: number, column: number };
  private deadEnd: boolean;

  constructor(row: number, column: number, dist: number, deadEnd: boolean, type: RoomType = "empty") {
    this.type = type;
    this.position = { row: row, column: column };
    this.distToCenter = dist;
    this.deadEnd = deadEnd;
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
    const rooms = [new Room(0, 0, 0, false, "unknown")];
    this.roomsMatrix = [[rooms[0]]];
    this.addRoom(0, 0, "empty");
    // running total of rooms left to create
    let roomsLeft = totalRooms;

    const createDeadEnd = (maxLength: number) => {
      const curRoom = getRandomElement(this.roomsArray);
      while (maxLength) {
        --maxLength;
      }
    }
    createDeadEnd(Math.round(roomsLeft / 3));
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
    }
    if (!neighbors.down) {
      if (this.getRowIndex(room.row + 1) >= this.roomsMatrix.length) {
        this.roomsMatrix.push(Array(this.roomsMatrix[0].length))
      }
      const newRoom = new Room(room.row + 1, room.column, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row + 1, room.column);
    }
    if (!neighbors.left) {
      if (this.getColIndex(room.column - 1) < 0) {
        this.roomsMatrix.forEach((row) => row.unshift(undefined));
        // Only update offset when unshifting
        this.offset.column += 1;
      }
      const newRoom = new Room(room.row, room.column - 1, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row, room.column - 1);
    }
    if (!neighbors.right) {
      if (this.getColIndex(room.column + 1) < 0) {
        this.roomsMatrix.forEach((row) => row.push(undefined));
      }
      const newRoom = new Room(room.row, room.column + 1, room.getDistanceToCenter() + 1, false, "unknown");
      this.setRoomAtCoord(newRoom, room.row, room.column + 1);
    }
  }

  getNeighbors(row: number, column: number, outOfBoundsCheck = true) {
    row -= this.offset.row;
    column -= this.offset.column;
    const neighbors: Neighbors = {
      length: 0,
    };
    if (outOfBoundsCheck && (row < 0 || row >= this.roomsMatrix.length || column < 0 || column >= this.roomsMatrix[0].length)) {
      return neighbors;
    }

    if (this.roomsMatrix[row - 1] && this.roomsMatrix[row - 1][column]) {
      ++neighbors.length;
      neighbors.up = this.roomsMatrix[row - 1][column];
    }
    if (this.roomsMatrix[row + 1] && this.roomsMatrix[row + 1][column]) {
      ++neighbors.length;
      neighbors.down = this.roomsMatrix[row + 1][column];
    }
    if (this.roomsMatrix[row] && this.roomsMatrix[row][column - 1]) {
      ++neighbors.length;
      neighbors.left = this.roomsMatrix[row][column - 1];
    }
    if (this.roomsMatrix[row] && this.roomsMatrix[row][column + 1]) {
      ++neighbors.length;
      neighbors.right = this.roomsMatrix[row][column + 1];
    }
    return neighbors;
  }

  get getRooms() {
    return this.roomsMatrix;
  }
}
