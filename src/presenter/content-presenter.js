import { render } from '../render.js';
import SortingView from '../view/sorting-view.js';
import FormOfEditingView from '../view/form-of-editing-view.js';
import EventsListView from '../view/events-list-view.js';
import WaypointView from '../view/waypoint-view.js';

export default class ContentPresenter {
  #eventsListComponent = new EventsListView();
  #boardContainer = null;
  #waypointsModel = null;
  #listWaypoints = [];

  init = (boardContainer, waypointsModel,) => {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
    this.#listWaypoints = [...this.#waypointsModel.waypoints];

    render(new SortingView(), this.#boardContainer);

    render(this.#eventsListComponent, this.#boardContainer);

    // render(new FormOfEditingView(this.#listWaypoints[0]), this.#eventsListComponent.element);

    for (let i = 0; i < this.#listWaypoints.length; i++) {
      this.#renderWaypoint(this.#listWaypoints[i]);
    }
  };

  #renderWaypoint = (waypoint) => {
    const waypointComponent = new WaypointView(waypoint);

    const formOfEditingComponent = new FormOfEditingView(waypoint);

    const replaceWaypointToForm = () => {
      this.#eventsListComponent.element.replaceChild(formOfEditingComponent.element, waypointComponent.element);
    };

    const replaceFormToWaypoint = () => {
      this.#eventsListComponent.element.replaceChild(waypointComponent.element, formOfEditingComponent.element);
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formOfEditingComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#eventsListComponent.element);
  };
}
