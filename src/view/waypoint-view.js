import { createElement } from '../render.js';
import { formatStringToTime } from '../mock/utils.js';

const createWaypointTemplate = (waypoint) => {
  const { name, type, dateFrom, dateTo, price, basePrice, title } = waypoint;
  const dateStart = formatStringToTime(dateFrom);
  const dateEnd = formatStringToTime(dateTo);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">MAR 18</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dateStart}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dateEnd}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
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

export default class WaypointView {
  #element = null;
  #waypoint = null;

  constructor(waypoint) {
    this.#waypoint = waypoint;
  }

  get template() {
    return createWaypointTemplate(this.#waypoint);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
