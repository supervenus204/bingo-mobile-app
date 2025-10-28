import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { BingoCard as BingoCardType } from '../../types';
import { BingoCard } from './BingoCard';

interface BingoBoardProps {
  bingoCardsData: BingoCardType[];
  handleIncrement?: (id: string) => void;
  handleDecrement?: (id: string) => void;
  handleStatusChange?: (id: string, status: string) => void;
  mode?: 'view' | 'edit' | 'play';
  completedCount?: number;
  totalCount?: number;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  bingoCardsData,
  handleIncrement,
  handleDecrement,
  handleStatusChange,
  mode,
  completedCount,
  totalCount,
}) => {
  // Calculate total cards selected for edit mode
  const totalCardsSelected = mode === 'edit'
    ? bingoCardsData.reduce((sum, card) => sum + (card.count || 0), 0)
    : 0;
  const totalCardsNeeded = totalCount || 24;
  const isDisabled = mode === 'edit' && totalCardsSelected >= totalCardsNeeded;

  const renderBingoCard = (card: BingoCardType, index: number) => {
    // In edit mode, disable a card if:
    // 1. We've reached the limit and this card has count 0 (can't add more)
    // 2. OR we've exceeded the limit (disable all cards)
    let cardDisabled = false;
    if (mode === 'edit') {
      if (totalCardsSelected > totalCardsNeeded) {
        // Exceeded limit: disable ALL cards (including decrement)
        cardDisabled = true;
      } else if (isDisabled && card.count === 0) {
        // Reached limit: only disable cards with count 0 (can't increment more)
        cardDisabled = true;
      }
    }

    return (
      <BingoCard
        key={`${card.id}-${index}`}
        color={card.color}
        name={card.name}
        count={card.count}
        mode={mode}
        onIncrement={() => handleIncrement?.(card.id)}
        onDecrement={() => handleDecrement?.(card.id)}
        onStatusChange={(status: string) =>
          handleStatusChange?.(index.toString(), status)
        }
        status={card.status}
      />
    );
  };

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
        {cards.map((card, index) => renderBingoCard(card, index + rowIndex * 4))}
        {emptySpaceElements}
      </View>
    );
  };

  // Calculate how many rows we need (4 cards per row)
  const totalRows = Math.ceil(bingoCardsData.length / 4);

  const completedCountValue = completedCount || 0;
  const totalCountValue = totalCount || bingoCardsData.length;
  const progressPercentage = totalCountValue > 0 ? (completedCountValue / totalCountValue) * 100 : 0;

  const selectedPercentage = totalCardsNeeded > 0 ? (totalCardsSelected / totalCardsNeeded) * 100 : 0;
  const showExcess = mode === 'edit' && totalCardsSelected > totalCardsNeeded;

  return (
    <View style={styles.gridContainer}>
      {mode === 'play' && (
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {completedCountValue} of {totalCountValue} tasks done
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` }
              ]}
            />
          </View>
        </View>
      )}
      {mode === 'edit' && (
        <View style={styles.progressSection}>
          <Text style={[styles.progressText, showExcess && styles.excessText]}>
            {totalCardsSelected} of {totalCardsNeeded} tasks selected
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(selectedPercentage, 100)}%` }
              ]}
            />
          </View>
          {showExcess && (
            <Text style={styles.excessWarning}>
              You've selected too many tasks! Please reset or remove some.
            </Text>
          )}
        </View>
      )}
      <View style={styles.gridContent}>
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const startIndex = rowIndex * 4;
          const endIndex = startIndex + 4;
          const rowCards = bingoCardsData.slice(startIndex, endIndex);
          return renderRow(rowCards, rowIndex);
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
  },
  gridContent: {
    gap: 10,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.blue.oxford,
    fontFamily: FONTS.family.poppinsMedium,
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(6, 40, 80, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.green.forest,
    borderRadius: 3,
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
  excessText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  excessWarning: {
    fontSize: 11,
    color: '#ef4444',
    fontFamily: FONTS.family.poppinsMedium,
    marginTop: 8,
    textAlign: 'center',
  },
});
