import {
  CARD_MASK_SETTINGS, DEFAULT_SORT_BY_PROPERTY, EMPTY_AMOUNT_TO_PRINT, LOCALE_STRING,
  MASK_SYMBOL, MONEY_FLOAT_DIGITS, USER_PREFIX_BY_GENDER,
} from './constants';
import CURRENCIES_SYMBOLS from './currencies';

export const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const getCardNumberMask = (cardNumber) => `${
  cardNumber
    .slice(0, CARD_MASK_SETTINGS.START_INDEX)
}${
  MASK_SYMBOL.repeat(cardNumber.length
    - (CARD_MASK_SETTINGS.START_INDEX + CARD_MASK_SETTINGS.FINISH_INDEX_TO_END))
}${
  cardNumber.slice(-CARD_MASK_SETTINGS.FINISH_INDEX_TO_END)
}`;

export const getOrderTime = (orderTime) => new Date(+orderTime).toLocaleString(LOCALE_STRING);

export const getUserBirthday = (userBirthdayTime) => new Date(+userBirthdayTime)
  .toLocaleDateString(LOCALE_STRING);

export const getUserPrefix = (user) => USER_PREFIX_BY_GENDER[user.gender];

export const getUserFullName = (user) => `${user.first_name || ''} ${user.last_name || ''}`;

const findListItemById = (list, id) => list.find((item) => item.id === id);

export const getCurrentUserById = (users, orderUserId) => findListItemById(users, orderUserId);

export const getUserCompanyById = (
  companies, userCompanyId,
) => findListItemById(companies, userCompanyId);

export const getCompareFunction = (sortState) => {
  const [compareProperty, secondCompareProperty] = sortState.sortByProperties;
  const sortByObject = sortState.sortByObject || DEFAULT_SORT_BY_PROPERTY;

  if (sortState.isNumericSorting) {
    return (
      firstCompareOrder, secondCompareOrder,
    ) => firstCompareOrder[sortByObject][compareProperty]
      - secondCompareOrder[sortByObject][compareProperty];
  }

  return (firstCompareOrder, secondCompareOrder) => firstCompareOrder[sortByObject][compareProperty]
    .localeCompare(secondCompareOrder[sortByObject][compareProperty])
    || (
      secondCompareProperty && (
        firstCompareOrder[sortByObject][secondCompareProperty]
          .localeCompare(secondCompareOrder[sortByObject][secondCompareProperty])
      )
    );
};

const numericCompare = (firstElement, secondElement) => firstElement - secondElement;

export const getOrders = (ordersForView) => ordersForView.map((orderForView) => orderForView.order);

export const getAverage = (total, count) => (total / count);

export const getOrdersTotal = (orders) => +orders.reduce(
  (accumulator, currentOrder) => accumulator + +currentOrder.total, 0,
);

export const getMedian = (array) => {
  const sortedArray = array.sort(numericCompare);
  const middleIndex = sortedArray.length / 2;
  return middleIndex % 1 === 0
    ? ((sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2)
    : sortedArray[Math.floor(middleIndex)];
};

export const printAmountFactory = (
  currencySymbol, currencyRatio,
) => (amount) => (
  amount
    ? `${CURRENCIES_SYMBOLS[currencySymbol] || currencySymbol} ${(amount * currencyRatio)
      .toFixed(MONEY_FLOAT_DIGITS)}`
    : EMPTY_AMOUNT_TO_PRINT
);
