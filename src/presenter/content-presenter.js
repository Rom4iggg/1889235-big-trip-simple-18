import { render } from '../render.js';
import SortingView from '../view/sorting-view.js';
import FormOfEditingView from '../view/form-of-editing-view.js';
import EventsListView from '../view/events-list-view.js';
import WaypointView from '../view/waypoint-view.js';


export default class ContentPresenter {
  eventsListComponent = new EventsListView();

  init = (boardContainer) => {

    render(new SortingView(), boardContainer);
    render(this.eventsListComponent, boardContainer);
    render(new FormOfEditingView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.eventsListComponent.getElement());
    }
  };
}
