import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import WaypointPesenter from './waypoint-presenter.js';

export default class BoardPesenter {
  #waypointsModel = null;
  #boardContainer = null;

  #eventsListComponent = new EventsListView();
  #sortingComponent = new SortingView();
  #emptyListComponent = new EmptyListView();

  constructor(boardContainer, waypointsModel) {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
  }

  init = () => {

    this.#renderEventList();

    if (!(this.waypoints.length > 0)) {
      this.#renderEmptyList();
    } else {
      for (let i = 0; i < this.#listWaypoints.length; i++) {
        this.#renderWaypoint(this.#listWaypoints[i]);
      }
    }
  };

  #renderSort = () => {
    render(this.#sortingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#eventsListComponent.element);
    waypointPresenter.init(waypoint);
  };

  // #renderWaypoints = (from, to) => {
  //   if (!(this.#listWaypoints.length > 0)) {
  //     render(this.#emptyListComponent, this.#boardContainer);
  //   } else {

  //     render(this.#eventsListComponent, this.#boardContainer);

  //     for (let i = 0; i < this.#listWaypoints.length; i++) {
  //       this.#renderWaypoint(this.#listWaypoints[i]);
  //     }
  //   }
  // };

  #renderWaypoints = (from, to) => {
    this.#listWaypoints
      .slice(from, to)
      .forEach((Waypoint) => this.#renderWaypoint(Waypoint));
  };

  #renderEmptyList = () => {
    render(this.#emptyListComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEventList = () => {
    render(this.#eventsListComponent, this.#boardContainer);
  };

}
