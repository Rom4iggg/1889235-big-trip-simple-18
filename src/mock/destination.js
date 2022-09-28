import { getRandomValue } from '../utils/utils.js';
import { NAME, DESCRIPTIONS } from './const-mock';

export const generateDestination = (id) => ({
  id: id,
  description: getRandomValue(DESCRIPTIONS),
  name: getRandomValue(NAME),
  pictures: [
    {
      // src: `http://picsum.photos/248/152?r=$(getRandomInteger)`,
      description: 'Chamonix parliament building'
    }
  ]
});
