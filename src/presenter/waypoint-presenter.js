import WaypointView from '../view/waypoint-view.js';
import FormOfEditingView from '../view/form-of-editing-view.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #eventsListContainer = null;
  #waypointsModel = null;
  #changeData = null;
  #changeMode = null;

  #waypointComponent = null;
  #formOfEditingComponent = null;

  #waypoint = null;

  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, waypointsModel, changeData, changeMode) {
    this.#eventsListContainer = eventsListContainer;
    this.#waypointsModel = waypointsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (waypoint) => {
    this.#waypoint = waypoint;

    // this.waypoints = this.#waypointsModel.waypoints;

    const prevWaypointComponent = this.#waypointComponent;
    const prevFormOfEditingComponent = this.#formOfEditingComponent;

    this.#waypointComponent = new WaypointView(
      waypoint,
      this.#waypointsModel.getWaypointOffers(waypoint),
      this.#waypointsModel.getWaypointDestinations(waypoint)
    );

    this.#formOfEditingComponent = new FormOfEditingView(
      waypoint,
      this.#waypointsModel.allOffers,
      this.#waypointsModel.allDestinations
    );

    this.#waypointComponent.setClickHandler(this.#setClickWaypointToForm);
    this.#formOfEditingComponent.setSubmitHandler(this.#setSubmitHandler);
    this.#formOfEditingComponent.setClickHandler(this.#setClickFormToWaypoint);

    if (prevWaypointComponent === null || prevFormOfEditingComponent === null) {
      render(this.#waypointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formOfEditingComponent, prevFormOfEditingComponent);
    }

    remove(prevWaypointComponent);
    remove(prevFormOfEditingComponent);
  };

  destroy = () => {
    remove(this.#waypointComponent);
    remove(this.#formOfEditingComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToWaypoint();
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToWaypoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #replaceWaypointToForm = () => {
    replace(this.#formOfEditingComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.EDITING;
  };

  #replaceFormToWaypoint = () => {
    replace(this.#waypointComponent, this.#formOfEditingComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };


  #setClickWaypointToForm = () => {
    this.#replaceWaypointToForm();
  };

  #setSubmitHandler = () => {
    this.#replaceFormToWaypoint();
  };

  #setClickFormToWaypoint = () => {
    this.#replaceFormToWaypoint();
  };
}
