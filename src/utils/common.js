import dayjs from 'dayjs';
import { UNIT_DATE } from '../const.js';

const formatStringToDateWithTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const formatStringToDate = (date) => dayjs(date).format('YYYY-MM-DD');
const humanizeDate = (date) => dayjs(date).format('D MMMM');
const humanizeTime = (date) => dayjs(date).format('HH:mm');
const humanizeDateTime = (date) => dayjs(date).format('DD/MM/01 HH:mm');

const toUpperCaseFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const sortWaypointDay = (taskA, taskB) => dayjs(taskA.dateFrom).diff(dayjs(taskB.dateFrom));

const sortWaypointPrice = (taskA, taskB) => taskB.basePrice - taskA.basePrice;

const isFutureDate = (dateStart, dateEnd) => dayjs().isBefore(dayjs(dateStart), UNIT_DATE) || dayjs().isBefore(dayjs(dateEnd), UNIT_DATE);

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const getDestination = (idDestination, allDestinations) => allDestinations.find((destinationItem) => destinationItem.id === idDestination);

const getOffersByType = (typeOffer, allOffers) => allOffers.find((offer) => offer.type === typeOffer).offers;

export { formatStringToDateWithTime, formatStringToDate, humanizeDate, humanizeTime, humanizeDateTime, toUpperCaseFirstLetter, sortWaypointDay, sortWaypointPrice, isFutureDate, isDatesEqual, getDestination, getOffersByType };

