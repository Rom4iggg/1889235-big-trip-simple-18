const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

const getDestination = (idDestination, allDestinations) => allDestinations.find((destinationItem) => destinationItem.id === idDestination);

const getOffersByType = (typeOffer, allOffers) => allOffers.find((offer) => offer.type === typeOffer).offers;

export { getRandomInteger, getRandomValue, getDestination, getOffersByType };
