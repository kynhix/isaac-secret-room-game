export type RoomType = "empty" | "boss" | "treasure" | "cursed" | "shop" | "secret" | "super-secret" | "sacrafice" | "miniboss" | "unknown";

type Neighbors = {
  up?: Room;
  down?: Room;
  left?: Room;
  right?: Room;
  length: number;
};

export class Room {
  private neighbors: Neighbors;

  private type: RoomType;
  /** The number of rooms you have to go through to get to the center of the map. */
  private distToCenter: number;
  private position: { row: number, column: number };
  private deadEnd: boolean;

  constructor(row: number, column: number, dist: number, deadEnd: boolean, type: RoomType = "empty") {
    this.neighbors = { length: 0 };
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

  getNeighborCount() {
    return Object.keys(this.neighbors).length;
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

  getNeighbors() {
    return { ...this.neighbors };
  }

  setNeighbor(position: "up" | "down" | "left" | "right", node: Room) {
    this.neighbors[position] = node;
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

export class Floor {
  private rooms: Array<Array<Room>>;
  private offset: { row: number, column: number } = { row: 0, column: 0 }

  constructor(rooms = 20) {
    this.rooms = [[]];
    this.generateFloor(rooms);
  }

  private generateFloor(totalRooms: number) {
    const rooms = [new Room(0, 0, 0, false)];
    this.rooms = [[rooms[0]]];
    // running total of rooms
    let roomsLeft = totalRooms;

    const createDeadEnd = (maxLength: number) => {
      let locations: { row: number, column: number }[] = rooms.reduce((arr, room) => {
        const neighbors = room.getNeighbors();
        if (!neighbors.up && this.getNeighbors(room.row - 1, room.column).length == 0) {
          arr.push({ row: room.row - 1, column: room.column });
        }
        if (!neighbors.down && this.getNeighbors(room.row + 1, room.column).length == 0) {
          arr.push({ row: room.row + 1, column: room.column });
        }
        if (!neighbors.left && this.getNeighbors(room.row, room.column - 1).length == 0) {
          arr.push({ row: room.row, column: room.column - 1 });
        }
        if (!neighbors.right && this.getNeighbors(room.row, room.column + 1).length == 0) {
          arr.push({ row: room.row, column: room.column + 1 });
        }
        return arr;
      }, new Array());
      console.log(locations)
      while (maxLength) {
        --maxLength;
      }
    }
    createDeadEnd(Math.round(roomsLeft / 3));
    this.rooms[0].push(new Room(1, 0, 0, false, "empty"));
  }

  getNeighbors(row: number, column: number, outOfBoundsCheck = true) {
    row -= this.offset.row;
    column -= this.offset.column;
    const neighbors: Neighbors = {
      length: 0,
    };
    if (outOfBoundsCheck && (row < 0 || row >= this.rooms.length || column < 0 || column >= this.rooms[0].length)) {
      return neighbors;
    }

    if (this.rooms[row - 1] && this.rooms[row - 1][column]) {
      ++neighbors.length;
      neighbors.up = this.rooms[row - 1][column];
    }
    if (this.rooms[row + 1] && this.rooms[row + 1][column]) {
      ++neighbors.length;
      neighbors.down = this.rooms[row + 1][column];
    }
    if (this.rooms[row] && this.rooms[row][column - 1]) {
      ++neighbors.length;
      neighbors.left = this.rooms[row][column - 1];
    }
    if (this.rooms[row] && this.rooms[row][column + 1]) {
      ++neighbors.length;
      neighbors.right = this.rooms[row][column + 1];
    }
    return neighbors;
  }

  get getRooms() {
    return this.rooms;
  }
}
