import type { Card, GameState } from '../types/game';

const CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

export class GameService {
  private deck: Card[] = [];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.deck = [];
    for (const suit of SUITS) {
      for (const value of CARD_VALUES) {
        this.deck.push({
          suit,
          value,
        });
      }
    }
    this.shuffleDeck();
  }

  private getNumericValue(value: string): number {
    if (value === 'A') return 1;
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    return parseInt(value);
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  public drawCard(): Card {
    if (this.deck.length === 0) {
      this.initializeDeck();
    }
    return this.deck.pop()!;
  }

  public calculateHandScore(cards: Card[]): number {
    let score = cards.reduce((sum, card) => {
      let value = card.value;
      if (value > 10) value = 0;
      return (sum + value) % 10;
    }, 0);
    return score;
  }

  public shouldDrawThirdCard(score: number, isPlayer: boolean, bankerScore?: number): boolean {
    if (isPlayer) {
      return score <= 5;
    } else {
      // 庄家补牌规则
      if (score >= 7) return false;
      if (score <= 2) return true;
      // 其他情况根据闲家第三张牌决定
      // 这里需要实现完整的补牌规则
      return false;
    }
  }
} 
