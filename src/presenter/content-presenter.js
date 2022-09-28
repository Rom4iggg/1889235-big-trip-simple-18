import { render, replace } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import FormOfEditingView from '../view/form-of-editing-view.js';
import EventsListView from '../view/events-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class ContentPresenter {
  #eventsListComponent = new EventsListView();
  #boardContainer = null;
  #waypointsModel = null;
  #listWaypoints = [];

  constructor(boardContainer, waypointsModel) {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
  }

  init = () => {
    this.#listWaypoints = [...this.#waypointsModel.waypoints];

    this.#renderList();
  };

  #renderWaypoint = (waypoint) => {
    const waypointComponent = new WaypointView(waypoint);

    const formOfEditingComponent = new FormOfEditingView(waypoint);

    const replaceWaypointToForm = () => {
      replace(formOfEditingComponent, waypointComponent);
    };

    const replaceFormToWaypoint = () => {
      replace(waypointComponent, formOfEditingComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    waypointComponent.setClickHandler(() => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formOfEditingComponent.setSubmitHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    formOfEditingComponent.setClickHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#eventsListComponent.element);
  };

  #renderList = () => {
    if (!(this.#listWaypoints.length > 0)) {
      render(new EmptyListView(), this.#boardContainer);
    } else {

      render(new SortingView(), this.#boardContainer);

      render(this.#eventsListComponent, this.#boardContainer);

      for (let i = 0; i < this.#listWaypoints.length; i++) {
        this.#renderWaypoint(this.#listWaypoints[i]);
      }
    }
  };
}
