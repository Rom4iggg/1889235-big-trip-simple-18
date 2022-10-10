import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointNewPresenter from './waypoint-new-presenter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortWaypointDay, sortWaypointPrice } from '../utils/common.js';
import { filter } from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #waypointsModel = null;
  #boardContainer = null;
  #filterModel = null;
  #waypointNewPresenter = null;
  #emptyListComponent = null;
  #sortingComponent = null;

  #loadingComponent = new LoadingView();
  #eventsListComponent = new EventsListView();

  #waypointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(boardContainer, waypointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#waypointNewPresenter = new WaypointNewPresenter(this.#waypointsModel, this.#eventsListComponent.element, this.#handleViewAction);
  }

  init = () => {
    this.#renderBoard();
  };

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredWaypoints.sort(sortWaypointDay);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortWaypointPrice);
    }
    return filteredWaypoints;
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#waypointPresenter.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch (err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#waypointNewPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch (err) {
          this.#waypointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#waypointPresenter.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch (err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderWaypoints = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#waypointsModel, this.#eventsListComponent.element, this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderSort = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortingComponent, this.#boardContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyListComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#waypointNewPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #clearBoard = ({ resetSortType = false } = {}) => {
    this.#waypointNewPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointPresenter.clear();

    remove(this.#sortingComponent);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    render(this.#eventsListComponent, this.#boardContainer);

    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;
    if (waypointsCount === 0) {
      this.#renderEmptyList();
      return;
    }

    this.waypoints.forEach((element) => this.#renderWaypoints(element));
  };

  createWaypoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#waypointNewPresenter.init(callback);
  };
}
