class Room {
  private neighbors: {
    up?: Room,
    down?: Room,
    left?: Room,
    right?: Room,
  };

  constructor() {
    this.neighbors = {};
  }

  getNeighborCount() {
    return Object.keys(this.neighbors).length;
  }
};
