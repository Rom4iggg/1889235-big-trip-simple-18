import { generateWaypoint } from '../mock/waypoint.js';

export default class WaypointsModel {
  #waypoints = Array.from({ length: 5 }, (_value, index) => generateWaypoint(index + 1));

  get waypoints() {
    return this.#waypoints;
  }
}
