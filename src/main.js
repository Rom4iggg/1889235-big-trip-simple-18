import FiltersView from './view/filters-view.js';
import { render } from './render.js';
import ContentPresenter from './presenter/content-presenter.js';
import WaypointsModel from './model/waypoints-model.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const contentPresenter = new ContentPresenter();
const waypointsModel = new WaypointsModel();

render(new FiltersView(), siteHeaderElement);

contentPresenter.init(siteMainElement, waypointsModel);
