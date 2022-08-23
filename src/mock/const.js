import { getRandomInteger } from './utils.js';

const generateDescription = () => {
  const descriptions = [
    'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

export const generateDestination = () => ({
  id: 1,
  description: generateDescription(),
  name: 'Chamonix',
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger()}`,
      description: 'Chamonix parliament building'
    }
  ]
});
