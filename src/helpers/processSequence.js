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
  curry,
  andThen,
  prop,
  pick,
  identity,
} from "ramda";

const REGEXP_NUM_SYMBOL = /^[0-9]*[.,]?[0-9]+$/;
const URL_NUMBER = "https://api.tech/numbers/base";
const URL_ANIMAL = "https://animals.tech";
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
  /* console.log({ value, writeLog, handleSuccess, handleError }); */
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

  const squareNumber = (number) => Math.pow(number, 2);
  const calculateReminder = (number) => number % 3;

  const makeNumberHandling = pipe(Number, Math.round, makeWriteLog);
  const getSymbolAmount = pipe(andThen(length), andThen(makeWriteLog));
  const makeSquareNumber = pipe(andThen(squareNumber), andThen(makeWriteLog));
  const getReminder = pipe(andThen(calculateReminder), andThen(makeWriteLog));

  const setParams = (entry) => {
    return { number: entry, from: 10, to: 2 };
  };
  const handleResult = pipe(prop("result"), String);
  const getSuccess = andThen(handleResult);
  const makeRequestNumber = pipe(setParams, api.get(URL_NUMBER));
  const makeNumberBinary = pipe(
    makeRequestNumber,
    getSuccess,
    andThen(makeWriteLog)
  );

  const setParamsAnimal = (id) => `${URL_ANIMAL}/${id}`;
  const makeRequestAnimal = api.get(__, {});
  const getAnimal = pipe(
    tap(console.log), //
    andThen(setParamsAnimal),
    tap(console.log),
    andThen(makeRequestAnimal),
    getSuccess
  );

  const makeConditionalStep = pipe(
    makeNumberHandling,
    makeNumberBinary,
    getSymbolAmount,
    makeSquareNumber,
    getReminder,
    getAnimal
  );

  const validateWithErrMsg = partial(handleError, ["ValidationError"]);

  const makeValidation = ifElse(
    isValidString,
    makeConditionalStep,
    validateWithErrMsg
  );

  const runSequence = pipe(makeWriteLog, makeValidation);
  runSequence(value);
};

export default processSequence;
