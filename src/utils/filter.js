import { FilterType } from '../const.js';
import { isFutureDate } from '../utils/common.js';

const filter = {
  [FilterType.EVERYTHING]: (waypoint) => waypoint,
  [FilterType.FUTURE]: (waypoint) => waypoint.filter((wayPoint) => isFutureDate(wayPoint.dateTo, wayPoint.dateFrom)),
};

export { filter };
