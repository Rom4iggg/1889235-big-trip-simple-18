const TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant',];

const SortType = {
  DAY: 'day',
  PRICE: 'price',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const DEFAULT_WAYPOINT = {
  id: null,
  basePrice: 100,
  dateFrom: new Date,
  dateTo: new Date,
  destination: 1,
  offers: [],
  type: TYPE[0],
};

const UNIT_DATE = 'minute';

const AUTHORIZATION = 'Basic fqwgqnu132w415';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';

const EMPTY_LIST_TEXT = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

export { SortType, FilterType, UserAction, UpdateType, UNIT_DATE, DEFAULT_WAYPOINT, TYPE, AUTHORIZATION, END_POINT, EMPTY_LIST_TEXT };
