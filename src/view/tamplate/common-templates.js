import { TYPE } from '../../const.js';
import { toUpperCaseFirstLetter } from '../../utils/common.js';

export const createDestinationOptionsTemplate = (allDestinations) => (allDestinations.map((destinationItem) => (
  `<option value="${destinationItem.name}"></option>`
)).join(''));

export const createEventTypeListTemplate = (waypoint) => (TYPE.map((wayPointType) => {
  const checked = waypoint.type === wayPointType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
    <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${toUpperCaseFirstLetter(wayPointType)}</label>
  </div>`;
}
).join(''));

export const createOffersByTypeTemplate = (waypoint, offersByType) => (offersByType.map((offer, offerIndex) => {
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
