import { generateWaypoint } from '../mock/waypoint.js';
import { generateOffer } from '../mock/offer.js';
import { generateDestination } from '../mock/destination.js';
import { getDestination, getOffersByType } from '../utils/common.js';

const WAYPOINT_COUNT = 5;

export default class WaypointsModel {
  #waypoints = Array.from({ length: WAYPOINT_COUNT }, (_value, index) => generateWaypoint(index + 1));
  #allDestinations = generateDestination();
  #allOffers = generateOffer();

  get waypoints() {
    return this.#waypoints;
  }

  get allDestinations() {
    return this.#allDestinations;
  }

  get allOffers() {
    return this.#allOffers;
  }

  getWaypointDestinations = (waypoint) => getDestination(waypoint.destination, this.#allDestinations);
  getWaypointOffers = (waypoint) => getOffersByType(waypoint.type, this.#allOffers).filter((offer) => waypoint.offers.includes(offer.id));
}
