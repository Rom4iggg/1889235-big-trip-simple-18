import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { DEFAULT_WAYPOINT } from '../const.js';
import { getDestination, getOffersByType } from '../utils/common.js';
import { createOffersByTypeTemplate, createEventTypeListTemplate, createDestinationOptionsTemplate } from './tamplate/common-templates';
import { humanizeDateTime, } from '../utils/common.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const createFormOfEditingTemplate = (waypoint, allOffers, allDestinations) => {
  const dateFrom = waypoint.dateFrom;
  const dateTo = waypoint.dateTo;
  const DEFAULT_DESTINATION = allDestinations[0];

  const destinationById = waypoint.destination ? getDestination(waypoint.destination, allDestinations) : DEFAULT_DESTINATION;
  const offersByType = getOffersByType(waypoint.type, allOffers);

  const dateTimeFromReadble = humanizeDateTime(dateFrom);
  const dateTimeToReadble = humanizeDateTime(dateTo);

  const createDestinationsContainerTemplate = () => `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(destinationById.description)}</p>
    </section>`;

  return (`
  <li class="trip-events__item">
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
          ${createEventTypeListTemplate(waypoint)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${waypoint.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDestinationOptionsTemplate(allDestinations)}
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

    <button class="event__save-btn  btn  btn--blue" type="submit" ${waypoint.isDisabled ? 'disabled' : ''}>${waypoint.isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${waypoint.isDisabled ? 'disabled' : ''}>${waypoint.isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      ${offersByType.length ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}
      <div class="event__available-offers">
        ${createOffersByTypeTemplate(waypoint, offersByType)}
      </div>
    </section>
    ${destinationById ? createDestinationsContainerTemplate() : ''}
  </section>
  </form>
  </li>
  `);
};

export default class FormOfEditingView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;

  #datepickerStart = null;
  #datepickerEnd = null;

  constructor(waypoint = DEFAULT_WAYPOINT, allOffers = [], allDestinations = []) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this._state = FormOfEditingView.parseWaypointToState(waypoint);
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  get template() {
    return createFormOfEditingTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input')).forEach((typeElement) => typeElement.addEventListener('click', this.#eventTypeHandler));
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#eventOfferHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationHandler);
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  };

  #eventTimeStartHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #eventTimeEndHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #eventDestinationHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      destination: this.#allDestinations.find((destination) => evt.target.value === destination.name).id,
    });
  };

  #eventTypeHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      type: event.target.value,
      offers: [],
    });
  };

  #eventPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value.replace(/[^\d.]/g, '')),
    });
  };

  #eventOfferHandler = (event) => {
    event.preventDefault();
    const currentOffers = Array.from(this._state.offers);
    const offerId = Number(event.target.dataset.index);

    if (event.target.checked) {
      currentOffers.push(offerId);
    }

    if (!event.target.checked) {
      currentOffers.splice(currentOffers.indexOf(offerId), 1);
    }

    this.updateElement({
      offers: currentOffers
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setClickHandler(this._callback.click);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #setDatepickerStart = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#eventTimeStartHandler,
      },
    );
  };

  #setDatepickerEnd = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        onClose: this.#eventTimeEndHandler,
      },
    );
  };

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
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
  };

  #submitHandler = (event) => {
    event.preventDefault();
    this._callback.submit(FormOfEditingView.parseStateToWaypoint(this._state));
  };

  reset = (waypoint) => {
    this.updateElement(
      FormOfEditingView.parseWaypointToState(waypoint),
    );
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormOfEditingView.parseStateToWaypoint(this._state));
  };

  static parseWaypointToState = (waypoint) => ({
    ...waypoint,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToWaypoint = (state) => {
    const waypoint = { ...state };

    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;
    return waypoint;
  };
}
