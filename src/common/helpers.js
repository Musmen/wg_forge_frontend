export const fetchData = async url => {
  const response = await fetch(url);
  return response.json();
}

export const getCardNumberMask = cardNumber => 
  `${cardNumber.slice(0, 2)}${'*'.repeat(cardNumber.length - 6)}${cardNumber.slice(-4)}`;

export const getOrderTime = orderTime => new Date(+orderTime).toLocaleString('en-GB');