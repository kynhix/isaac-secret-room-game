export type RoomType = "empty" | "boss" | "treasure" | "cursed" | "shop" | "secret" | "super-secret" | "sacrafice" | "miniboss" | "unknown";

export class Room {
  private neighbors: {
    up?: Room,
    down?: Room,
    left?: Room,
    right?: Room,
  };

  private type: RoomType;
  /** The number of rooms you have to go through to get to the center of the map. */
  private distToCenter: number;
  private position: { row: number, column: number };
  private deadEnd: boolean;

  constructor(row: number, column: number, dist: number, deadEnd: boolean, type: RoomType = "empty") {
    this.neighbors = {};
    this.type = type;
    this.position = { row: row, column: column };
    this.distToCenter = dist;
    this.deadEnd = deadEnd;
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
    this.rooms = [[new Room(0, 0, 0, false)]]
    // running total of rooms
    let rooms = totalRooms;
    // number of branches from main room
    const branches = 1 + Math.round(Math.random() * 2.1 - 0.5);
    this.rooms[0].push(new Room(1, 0, 0, false, "empty"));
  }

  get getRooms() {
    return this.rooms;
  }
}
