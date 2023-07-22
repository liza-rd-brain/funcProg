import { head } from "lodash";
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
  identity,
  without,
  countBy,
  sort,
  last,
  and,
  not,
  complement,
} from "ramda";

const CIRCLE_FGR = "circle";
const SQUARE_FGR = "square";
const TRIANGLE_FGR = "triangle";
const STAR_FGR = "star";

const RED_CLR = "red";
const WHITE_CLR = "white";
const GREEN_CLR = "green";
const ORANGE_CLR = "orange";
const BLUE_CLR = "blue";

const TEST_OBJ = {
  CIRCLE_FGR: RED_CLR, //
  SQUARE_FGR: WHITE_CLR,
  TRIANGLE_FGR: ORANGE_CLR,
  STAR_FGR: BLUE_CLR,
};

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
const isOrange = equals(ORANGE_CLR);
const isBlue = equals(BLUE_CLR);

const isColor = (color) => equals(color);

const getCircle = prop(CIRCLE_FGR);
const getSquare = prop(SQUARE_FGR);
const getTriangle = prop(TRIANGLE_FGR);
const getStar = prop(STAR_FGR);

const getFigureItem = (figure) => {
  console.log(figure, prop(figure)(TEST_OBJ));
  return prop(figure);
};

const isCircleWhite = pipe(getCircle, isWhite);
const isCircleBlue = pipe(getCircle, isBlue);
const isSquareGreen = pipe(getSquare, isGreen);
const isSquareOrange = pipe(getSquare, isOrange);
const isTriangleWhite = pipe(getTriangle, isWhite);
const isTriangleGreen = pipe(getTriangle, isGreen);
const isStarRed = pipe(getStar, isRed);
const isStarWhite = pipe(getStar, isWhite);
const isStarNotRed = complement(isStarRed);
const isStarNotWhite = complement(isStarWhite);

const isTwoAmount = gte(__, 2);
const isAmount = (amount) => gte(__, amount);

const filterByColor = (color) => filter((item) => item === color);

const getColorAmount = (color) => {
  return pipe(filterByColor(color), values, length);
};

const getColorOf = (figure) => pipe(getFigureItem(figure), values, head);

const isEqualAmount = (color1, color2) => {
  const colorAmount = getColorAmount(color1);
  //  identity(equals(getColorAmount(color1), getColorAmount(color2)));
  /*   console.log(identity(equals(getColorAmount(color1), getColorAmount(color2)))); */
  /*  return identity(res); */
  return false;
};

const isFigureSameColor = ({ triangle: tColor, square: sColor }) =>
  equals(tColor, sColor);
const triangleNotWhite = complement(isTriangleWhite);

const isAllSameColor = (color) => {
  return pipe(getColorAmount(color), isAmount(4));
};

const filterWithoutColor = (color) => without([color]);
const sortBiggerFirst = sort((a, b) => b - a);

const getSameColorAmount = pipe(
  countBy(identity),
  values,
  sortBiggerFirst,
  head
);

const isPartNotColor = (color, amount) => {
  return pipe(
    values,
    filterWithoutColor(color),
    getSameColorAmount,
    isAmount(amount)
  );
};

const isTwoFigureGreen = pipe(getColorAmount(GREEN_CLR), isAmount(2));
const someFigureRed = pipe(getColorAmount(RED_CLR), isAmount(1));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isCircleWhite,
  isSquareGreen,
  isTriangleWhite,
  isStarRed,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(getColorAmount(GREEN_CLR), isTwoAmount);
/* console.log(validateFieldN2); */
// export const validateFieldN2 = getGreenFigureList;

// 3. Количество красных фигур равно кол-ву синих.
//ОСТАВИЛА НА ПОТОМ!!
export const validateFieldN3 = isEqualAmount(RED_CLR, BLUE_CLR);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета

export const validateFieldN4 = allPass([
  isCircleBlue,
  isStarRed,
  isSquareOrange,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = isPartNotColor(WHITE_CLR, 3);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isTriangleGreen,
  isTwoFigureGreen,
  someFigureRed,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllSameColor(ORANGE_CLR);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isStarNotWhite, isStarNotRed]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllSameColor(GREEN_CLR);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isFigureSameColor, triangleNotWhite]);
