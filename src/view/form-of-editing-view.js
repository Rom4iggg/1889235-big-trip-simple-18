import AbstractView from '../framework/view/abstract-view.js';
import { DEFAULT_WAYPOINT, TYPE } from '../mock/const.js';
import { getDestination, getOffersByType } from '../utils/common.js';
import { humanizeDateTime, toUpperCaseFirstLetter } from '../utils/waypoint.js';

const createFormOfEditingTemplate = (waypoint, allOffers, allDestinations) => {
  const dateFrom = waypoint.dateFrom;
  const dateTo = waypoint.dateTo;

  const destinationById = getDestination(waypoint.destination, allDestinations);
  const offersByType = getOffersByType(waypoint.type, allOffers);

  const dateTimeFromReadble = humanizeDateTime(dateFrom);
  const dateTimeToReadble = humanizeDateTime(dateTo);

  const createEventTypeListTemplate = () => (TYPE.map((wayPointType) => {
    const checked = waypoint.type === wayPointType ? 'checked' : '';
    return `<div class="event__type-item">
      <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
      <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${toUpperCaseFirstLetter(wayPointType)}</label>
    </div>`;
  }
  ).join(''));

  const createOffersByTypeTemplate = () => (offersByType.map((offer, offerIndex) => {
    const checked = waypoint.offers.includes(offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerIndex}" data-index="${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-${offerIndex}">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }
  ).join(''));

  const createDestinationOptionsTemplate = () => (allDestinations.map((destinationItem) => (
    `<option value="${destinationItem.name}"></option>`
  )).join(''));

  const createPhotosTemplate = (pictures) => (pictures.map((picture) => (
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`
  )).join(''));

  const createPhotosContainerTemplate = () => {
    if ('pictures' in destinationById) {
      return `<div class="event__photos-container">
      <div class="event__photos-tape">
       ${createPhotosTemplate(destinationById.pictures)}
      </div>
    </div>`;
    } else {
      return '';
    }
  };

  const createDestinationsContainerTemplate = () => `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationById.description}</p>
      ${createPhotosContainerTemplate()}
    </section>`;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeListTemplate()}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${waypoint.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationOptionsTemplate()}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeFromReadble}">
        —
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeToReadble}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${waypoint.basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersByTypeTemplate()}
        </div>
      </section>
      ${createDestinationsContainerTemplate()}
    </section>
    </form>
    </li>`
  );
};

export default class FormOfEditingView extends AbstractView {
  #allOffers = null;
  #allDestinations = null;
  #waypoint = null;

  constructor(waypoint = DEFAULT_WAYPOINT, allOffers = [], allDestinations = []) {
    super();
    this.#waypoint = waypoint;
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
  }

  get template() {
    return createFormOfEditingTemplate(this.#waypoint, this.#allOffers, this.#allDestinations);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (event) => {
    event.preventDefault();
    this._callback.click();
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#SubmitHandler);
  };

  #SubmitHandler = (event) => {
    event.preventDefault();
    this._callback.submit();
  };
}
