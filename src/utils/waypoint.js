import dayjs from 'dayjs';

const formatStringToDateWithTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');

const formatStringToDate = (date) => dayjs(date).format('YYYY-MM-DD');

const humanizeDate = (date) => dayjs(date).format('D MMMM');

const humanizeTime = (date) => dayjs(date).format('HH:mm');

const humanizeDateTime = (date) => dayjs(date).format('DD/MM/01 HH:mm');

const toUpperCaseFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

export { formatStringToDateWithTime, formatStringToDate, humanizeDate, humanizeTime, humanizeDateTime, toUpperCaseFirstLetter };
