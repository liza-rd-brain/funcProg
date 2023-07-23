import Api from "../tools/api";
import {
  tap, //
  ifElse,
  allPass,
  __,
  pipe,
  lt,
  gt,
  partial,
  length,
  test,
} from "ramda";

const REGEXP_NUM_SYMBOL = /^[0-9]*[.,]?[0-9]+$/;

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

const api = new Api();

/**
 * Я – пример, удали меня
 */
const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  console.log({ value, writeLog, handleSuccess, handleError });
  const makeWriteLog = tap(writeLog);

  const lessThen = (num) => lt(__, num);
  const moreThen = (num) => gt(__, num);
  const maxLengthString = (num) => pipe(length, lessThen(num));
  const minLengthString = (num) => pipe(length, moreThen(num));
  const isPositiveNumber = pipe(Math.sign, moreThen(0));
  const isCorrectNumber = test(REGEXP_NUM_SYMBOL);

  const isValidString = allPass([
    maxLengthString(10),
    minLengthString(2),
    isPositiveNumber,
    isCorrectNumber,
  ]);

  const makeNumberHandling = pipe(Number, Math.round, makeWriteLog);

  const makeNextStep = pipe(makeNumberHandling);

  const validateWithErrMsg = partial(handleError, ["ValidationError"]);
  const makeValidation = ifElse(
    isValidString,
    makeNextStep,
    validateWithErrMsg
  );

  const runSequence = pipe(makeWriteLog, makeValidation);
  runSequence(value);
};

export default processSequence;
