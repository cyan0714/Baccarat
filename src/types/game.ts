export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
}

export interface GameState {
  playerCards: Card[];
  bankerCards: Card[];
  playerScore: number;
  bankerScore: number;
  gameStatus: 'waiting' | 'dealing' | 'finished';
  winner: 'player' | 'banker' | 'tie' | null;
}

export interface BetState {
  player: number;
  banker: number;
  tie: number;
} 
