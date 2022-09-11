import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

const formatStringToDateWithTime = (date) => dayjs(date).format('DD/MM/YY H:mm');

const formatStringToDate = (date) => dayjs(date).format('DD.MM.YY');

const humanizeTaskDueDate = (date) => dayjs(date).format('MMM D');

const formatStringToTime = (date) => dayjs(date).format('hh:mm');

export { getRandomInteger, getRandomValue, formatStringToDateWithTime, formatStringToDate, humanizeTaskDueDate, formatStringToTime };
