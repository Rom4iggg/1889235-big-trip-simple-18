import WaypointView from '../view/waypoint-view.js';
import FormOfEditingView from '../view/form-of-editing-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointListContainer = null;
  #waypointsModel = null;
  #changeData = null;
  #changeMode = null;
  #waypointComponent = null;
  #formOfEditingComponent = null;
  #waypoint = null;

  #mode = Mode.DEFAULT;

  constructor(waypointsModel, waypointListContainer, changeData, changeMode) {
    this.#waypointsModel = waypointsModel;
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (waypoint) => {
    this.#waypoint = waypoint;
    this.waypoints = this.#waypointsModel.waypoints;

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
    this.#formOfEditingComponent.setDeleteClickHandler(this.#pointDeleteHandler);

    if (prevWaypointComponent === null || prevFormOfEditingComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevFormOfEditingComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevWaypointComponent);
    remove(prevFormOfEditingComponent);
  };

  setSaving = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if (this.#mode === Mode.EDITING) {
      this.#formOfEditingComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#formOfEditingComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  destroy = () => {
    remove(this.#waypointComponent);
    remove(this.#formOfEditingComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#formOfEditingComponent.reset(this.#waypoint);
      this.#replaceFormToWaypoint();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#formOfEditingComponent.reset(this.#waypoint);
      this.#replaceFormToWaypoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceWaypointToForm = () => {
    replace(this.#formOfEditingComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToWaypoint = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    replace(this.#waypointComponent, this.#formOfEditingComponent);
    this.#mode = Mode.DEFAULT;
  };

  #setClickWaypointToForm = () => {
    this.#replaceWaypointToForm();
  };

  #setClickFormToWaypoint = () => {
    this.#formOfEditingComponent.reset(this.#waypoint);
    this.#replaceFormToWaypoint();
  };

  #setSubmitHandler = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#waypoint.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#waypoint.dateTo, update.dateTo) ||
      this.#waypoint.basePrice !== update.basePrice;

    this.#changeData(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #pointDeleteHandler = (waypoint) => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      waypoint,
    );
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formOfEditingComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formOfEditingComponent.shake(resetFormState);
  };
}
