import { remove, render, RenderPosition } from '../framework/render.js';
import FormAddView from '../view/form-add-view.js';
import { UserAction, UpdateType } from '../const.js';
import { DEFAULT_WAYPOINT } from '../const.js';

export default class WaypointNewPresenter {
  #waypointsModel = null;
  #eventsListContainer = null;
  #changeData = null;
  #waypointNewComponent = null;
  #destroyCallback = null;

  constructor(waypointsModel, eventsListContainer, changeData) {
    this.#waypointsModel = waypointsModel;
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
  }


  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#waypointNewComponent !== null) {
      return;
    }

    this.#waypointNewComponent = new FormAddView(
      DEFAULT_WAYPOINT,
      this.#waypointsModel.allDestinations,
      this.#waypointsModel.allOffers
    );

    this.#waypointNewComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#waypointNewComponent.setCancelClickHandler(this.#pointDeleteHandler);
    render(this.#waypointNewComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#waypointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  destroy = () => {
    if (this.#waypointNewComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#waypointNewComponent);
    this.#waypointNewComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #formSubmitHandler = (waypoint) => {
    this.#changeData(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      waypoint,
    );
  };

  #pointDeleteHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#waypointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointNewComponent.shake(resetFormState);
  };
}
