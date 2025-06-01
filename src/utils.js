export const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

export const padZero = (number, length) => String(number).padStart(length, '0');

export default {
    isPlainObject,
    padZero,
};