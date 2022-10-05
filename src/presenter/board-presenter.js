import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';

export default class BoardPesenter {
  #waypointsModel = null;
  #boardContainer = null;

  #eventsListComponent = new EventsListView();
  #sortingComponent = new SortingView();
  #emptyListComponent = new EmptyListView();

  #boardWaypoints = [];
  #waypointPresenter = new Map();

  constructor(boardContainer, waypointsModel) {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
  }

  init = () => {
    this.#boardWaypoints = [...this.#waypointsModel.waypoints];
    this.#renderBoard();

    if (!(this.#boardWaypoints.length > 0)) {
      this.#renderEmptyList();
    } else {
      for (let i = 0; i < this.#boardWaypoints.length; i++) {
        this.#renderWaypoint(this.#boardWaypoints[i]);
      }
    }
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#eventsListComponent.element, this.#handleWaypointChange, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderSort = () => {
    render(this.#sortingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#eventsListComponent, this.#boardContainer);
  };

  #renderEmptyList = () => {
    render(this.#emptyListComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #clearWaypointList = () => {
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointPresenter.clear();
  };

  #handleWaypointChange = (waypointUpdate) => {
    this.#boardWaypoints = updateItem(this.#boardWaypoints, waypointUpdate);
    this.#waypointPresenter.get(waypointUpdate.id).init(waypointUpdate);
  };

  #handleModeChange = () => {
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

}
