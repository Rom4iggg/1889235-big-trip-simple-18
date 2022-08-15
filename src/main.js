import FilterView from './view/filters-view';
import { render } from './render.js';

const siteMainElement = document.querySelector('.trip-main__trip-controls');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__filters');

render(new FilterView(), siteHeaderElement);
