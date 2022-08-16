import FilterView from './view/filters-view.js';
import { render } from './render.js';
import ContentPresenter from './presenter/content-presenter.js';


const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const contentPresenter = new ContentPresenter();

render(new FilterView(), siteHeaderElement);

contentPresenter.init(siteMainElement);
