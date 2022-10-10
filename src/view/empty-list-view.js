import AbstractView from '../framework/view/abstract-view.js';
import { EMPTY_LIST_TEXT } from '../const.js';


const createEmptyListTemplate = (filterType) => {
  const emptyListTextValue = EMPTY_LIST_TEXT[filterType];

  return (
    `<p class="trip-events__msg">${emptyListTextValue}</p>`
  );
};

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
