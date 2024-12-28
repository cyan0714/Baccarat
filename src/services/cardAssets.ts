const CARD_SUITS = {
  hearts: 'hearts',
  diamonds: 'diamonds',
  clubs: 'clubs',
  spades: 'spades'
} as const;

const CARD_VALUES = {
  1: 'ace',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'jack',
  12: 'queen',
  13: 'king'
} as const;

export function getCardImage(suit: keyof typeof CARD_SUITS, value: keyof typeof CARD_VALUES) {
  return `https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/${CARD_VALUES[value]}_of_${CARD_SUITS[suit]}.png`;
}

export const CARD_BACK = 'https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/back.png'; 
