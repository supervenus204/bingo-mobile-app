import { useEffect } from 'react';
import { useCardsStore } from '../store/cards.store';

export const useCards = (categoryId: string) => {
  const { cards, loading, error, fetchCards } = useCardsStore();

  useEffect(() => {
    if (cards[categoryId] === undefined || cards[categoryId] === null) {
      fetchCards(categoryId as string);
    }
  }, [categoryId]);

  return { cards: cards[categoryId], loading, error, fetchCards };
};
