import { generateDestination } from '../mock/const.js';

export default class DestinationsModel {
  destinations = Array.from({ length: 5 }, generateDestination);

  getDestinations = () => this.destinations;
}
