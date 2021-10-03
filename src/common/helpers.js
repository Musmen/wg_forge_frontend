import { CARD_MASK_SETTINGS, USER_PREFIX_BY_GENDER } from './constants';

export const fetchData = async url => {
  const response = await fetch(url);
  return response.json();
}

export const getCardNumberMask = cardNumber => 
  `${
    cardNumber
      .slice(0, CARD_MASK_SETTINGS.START_INDEX)
  }${
    '*'.repeat(cardNumber.length - (CARD_MASK_SETTINGS.START_INDEX + CARD_MASK_SETTINGS.FINISH_INDEX_TO_END))
  }${
    cardNumber.slice(-CARD_MASK_SETTINGS.FINISH_INDEX_TO_END)
  }`;

export const getOrderTime = orderTime => new Date(+orderTime).toLocaleString('en-GB');

export const getUserPrefix = user => USER_PREFIX_BY_GENDER[user.gender];

export const getUserFullName = user => `${user.first_name || ''} ${user.last_name || ''}`;
