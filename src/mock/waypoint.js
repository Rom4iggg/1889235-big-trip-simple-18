import { getRandomInteger, getRandomValue } from './utils.js';
import { descriptions, waypointType, cities, titles, } from './const.js';

export const generateWaypoint = () => ({
  description: getRandomValue(descriptions),
  name: getRandomValue(cities),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger()}`,
      description: getRandomValue(descriptions),
    },
  ],
  type: getRandomValue(waypointType),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  price: getRandomInteger(1, 120),
  basePrice: getRandomInteger(1, 222),
  title: getRandomValue(titles),
});

// const destination = () => ({
//   id: 1,
//   description: getRandomValue(descriptions),
//   name: getRandomValue(cities),
//   pictures: [
//     {
//       src: `http://picsum.photos/248/152?r=${getRandomInteger()}`,
//       description: getRandomValue(descriptions),
//     },
//   ],
// });

// const offer = () => ({
//   id: 1,
//   title: 'Upgrade to a business class',
//   price: 120,
// });

// const offersByType = () => ({
//   type: getRandomValue(waypointType),
//   offers: `${Array(offer)}`,
// });

// const point = () => ({
//   basePrice: 222,
//   dateFrom: '2019-07-10T22:55:56.845Z',
//   dateTo: '2019-07-11T11:22:13.375Z',
//   destination: `${generateWaypoint.id}`,
//   offers: `${Array(offer.id)}`,
//   type: getRandomValue(waypointType),
// });
