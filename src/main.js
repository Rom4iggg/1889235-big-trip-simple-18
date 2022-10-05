import { render } from './framework/render.js';
import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import WaypointsModel from './model/waypoints-model.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const contentPresenter = new ContentPresenter(siteMainElement, waypointsModel);


render(new FiltersView(), siteHeaderElement);

contentPresenter.init();
