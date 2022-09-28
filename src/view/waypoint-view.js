import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToDateWithTime, formatStringToDate, humanizeDate, humanizeTime } from '../utils/waypoint.js';

const createWaypointTemplate = (waypoint) => {
  const { destination, title, price } = waypoint;
  const dateFrom = waypoint.dateFrom;
  const dateTo = waypoint.dateTo;

  const dateFromReadble = humanizeDate(dateFrom);
  const timeFromReadble = humanizeTime(dateFrom);
  const timeToReadble = humanizeTime(dateTo);

  const formatStringToDateFrom = formatStringToDate(dateFrom);

  const formatStringToDateWithTimeFrom = formatStringToDateWithTime(dateFrom);
  const formatStringToDateWithTimeTo = formatStringToDateWithTime(dateTo);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatStringToDateFrom}">${dateFromReadble}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${waypoint.type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatStringToDateWithTimeFrom}">${timeFromReadble}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatStringToDateWithTimeTo}">${timeToReadble}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${waypoint.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`
  );
};

export default class WaypointView extends AbstractView {
  #waypoint = null;

  constructor(waypoint) {
    super();
    this.#waypoint = waypoint;
  }

  get template() {
    return createWaypointTemplate(this.#waypoint);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (event) => {
    event.preventDefault();
    this._callback.click();
  };
}
