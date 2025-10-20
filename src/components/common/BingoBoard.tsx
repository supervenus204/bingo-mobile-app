import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BingoCard as BingoCardType } from '../../types';
import { BingoCard } from './BingoCard';

interface BingoBoardProps {
  bingoCardsData: BingoCardType[];
  handleIncrement?: (id: string) => void;
  handleDecrement?: (id: string) => void;
  handleStatusChange?: (id: string, status: string) => void;
  onShowActions?: (cardId: string) => void;
  activeActionCardId?: string | null;
  mode?: 'view' | 'edit' | 'play';
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  bingoCardsData,
  handleIncrement,
  handleDecrement,
  handleStatusChange,
  onShowActions,
  activeActionCardId,
  mode,
}) => {
  const renderBingoCard = (card: BingoCardType, index: number) => (
    <BingoCard
      key={`${card.id}-${index}`}
      color={card.color}
      name={card.name}
      count={card.count}
      mode={mode}
      cardId={card.id}
      isActionActive={activeActionCardId === card.id}
      onIncrement={() => handleIncrement?.(card.id)}
      onDecrement={() => handleDecrement?.(card.id)}
      onStatusChange={(status: string) =>
        handleStatusChange?.(card.id, status)
      }
      onShowActions={onShowActions}
      status={card.status}
    />
  );

  const renderEmptySpace = (key: string) => (
    <View key={key} style={styles.emptySpace} />
  );

  const renderRow = (cards: BingoCardType[], rowIndex: number) => {
    const emptySpaces = 4 - cards.length;
    const emptySpaceElements = Array.from({ length: emptySpaces }, (_, index) =>
      renderEmptySpace(`empty-${rowIndex}-${index}`)
    );

    return (
      <View key={`row-${rowIndex}`} style={styles.row}>
        {cards.map((card, index) => renderBingoCard(card, index))}
        {emptySpaceElements}
      </View>
    );
  };

  // Calculate how many rows we need (4 cards per row)
  const totalRows = Math.ceil(bingoCardsData.length / 4);

  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: totalRows }, (_, rowIndex) => {
        const startIndex = rowIndex * 4;
        const endIndex = startIndex + 4;
        const rowCards = bingoCardsData.slice(startIndex, endIndex);
        return renderRow(rowCards, rowIndex);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    gap: 10,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  emptySpace: {
    width: 80,
    height: 80,
  },
});
