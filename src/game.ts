type RoomType = "empty" | "boss" | "treasure" | "cursed" | "shop" | "secret";

class Room {
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

  constructor(row: number, column: number, dist: number, deadEnd: boolean) {
    this.neighbors = {};
    this.type = "empty";
    this.position = { row: row, column: column };
    this.distToCenter = dist;
    this.deadEnd = deadEnd;
  }

  getNeighborCount() {
    return Object.keys(this.neighbors).length;
  }

  get getType() {
    return this.type;
  }

  set setType(type: RoomType) {
    this.type = type;
  }

  get getPosition() {
    return { ...this.position };
  }

  get getNeighbors() {
    return { ...this.neighbors };
  }

  setNeighbor(position: "up" | "down" | "left" | "right", node: Room) {
    this.neighbors[position] = node;
  }

  get getDistanceToCenter() {
    return this.distToCenter;
  }

  get isDeadEnd() {
    return this.deadEnd;
  }

  set setDistanceToCenter(dist: number) {
    this.distToCenter = dist;
  }
};


class GameMap {
  rooms = {};
}
