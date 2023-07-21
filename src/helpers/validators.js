import {
  __,
  allPass, //
  pipe,
  prop,
  values,
  equals,
  filter,
  gte,
  length,
} from "ramda";

const CIRCLE_FGR = "circle";
const SQUARE_FGR = "square";
const TRIANGLE_FGR = "triangle";
const STAR_FGR = "star";

const RED_CLR = "red";
const WHITE_CLR = "white";
const GREEN_CLR = "green";
const YELLOW_CLR = "yellow";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const isWhite = equals(WHITE_CLR);
const isGreen = equals(GREEN_CLR);
const isRed = equals(RED_CLR);
const isYellow = equals(YELLOW_CLR);

const getCircle = prop(CIRCLE_FGR);
const getSquare = prop(SQUARE_FGR);
const getTriangle = prop(TRIANGLE_FGR);
const getStar = prop(STAR_FGR);

const isCircleWhite = pipe(getCircle, isWhite);
const isSquareGreen = pipe(getSquare, isGreen);
const isTriangleWhite = pipe(getTriangle, isWhite);
const isStarRed = pipe(getStar, isRed);

const getAmount = gte(__, 2);

const filterByGreen = filter((item) => item === GREEN_CLR);

const getGreenFigureList = pipe(filterByGreen, values, length);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isCircleWhite,
  isSquareGreen,
  isTriangleWhite,
  isStarRed,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(getGreenFigureList, getAmount);
// export const validateFieldN2 = getGreenFigureList;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = () => false;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = () => false;

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = () => false;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => false;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = () => false;
