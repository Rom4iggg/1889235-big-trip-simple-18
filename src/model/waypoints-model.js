import { getDestination, getOffersByType } from '../utils/common.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WaypointModel extends Observable {
  #waypointsApiService = null;
  #waypoints = [];
  #allDestinations = [];
  #allOffers = [];

  constructor(waypointsApiService) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get allDestinations() {
    return this.#allDestinations;
  }

  get allOffers() {
    return this.#allOffers;
  }

  init = async () => {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      const allDestinations = await this.#waypointsApiService.allDestinations;
      const allOffers = await this.#waypointsApiService.allOffers;

      this.#waypoints = waypoints.map(this.#adaptToClient);
      this.#allDestinations = allDestinations;
      this.#allOffers = allOffers;

    } catch (err) {
      this.#waypoints = [];
      this.#allDestinations = [];
      this.#allOffers = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateWaypoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch (err) {
      throw new Error('Can\'t update waypoint');
    }
  };

  addWaypoint = async (updateType, update) => {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints = [newWaypoint, ...this.#waypoints];
      this._notify(updateType, newWaypoint);
    } catch (err) {
      throw new Error('Can\'t add waypoint');
    }
  };

  deleteWaypoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#waypointsApiService.deleteWaypoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (waypoint) => {
    const adaptedWaypoint = {
      ...waypoint,
      dateFrom: waypoint['date_from'] !== null ? new Date(waypoint['date_from']) : waypoint['date_from'],
      dateTo: waypoint['date_to'] !== null ? new Date(waypoint['date_to']) : waypoint['date_to'],
      basePrice: waypoint['base_price'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];

    return adaptedWaypoint;
  };

  getWaypointDestinations = (waypoint) => getDestination(waypoint.destination, this.#allDestinations);
  getWaypointOffers = (waypoint) => getOffersByType(waypoint.type, this.#allOffers).filter((offer) => waypoint.offers.includes(offer.id));
}
