import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { BingoCard as BingoCardType } from '../../types/bingo.type';
import { BingoCard } from './BingoCard';

interface BingoRowProps {
  mode: string;
  cards: BingoCardType[];
  rowIndex: number;
  handleClick: (cardId: number, status?: string) => void;
  firstCardRef?: React.RefObject<View | null>;
}

const BingoRow = ({
  mode,
  cards,
  rowIndex,
  handleClick,
  firstCardRef,
}: BingoRowProps) => {
  const renderEmptySpace = (key: string) => (
    <View key={key} style={styles.emptySpace} />
  );

  const emptySpaces = 4 - cards.length;
  const emptySpaceElements = Array.from({ length: emptySpaces }, (_, index) =>
    renderEmptySpace(`empty-${rowIndex}-${index}`)
  );

  return (
    <View key={`row-${rowIndex}`} style={styles.row}>
      {cards.map((card, index) => {
        const isFirstCard = rowIndex === 0 && index === 0;
        return (
          <View
            key={`${card.id}-${index}`}
            ref={isFirstCard ? firstCardRef : undefined}
          >
            <BingoCard
              color={card.color}
              font_color={card.font_color}
              font_name={card.font_name}
              name={card.name}
              count={card.count}
              mode={mode === 'setup' ? 'setup' : card.status}
              handleClick={(status?: string) =>
                handleClick(rowIndex * 4 + index, status)
              }
            />
          </View>
        );
      })}
      {emptySpaceElements}
    </View>
  );
};

interface BingoBoardProps {
  bingoCardsData: BingoCardType[];
  mode: 'setup' | 'play';
  totalCount: number;
  handleClick: (cardId: number, status?: string) => void;
  progressSectionRef?: React.RefObject<View | null>;
  firstCardRef?: React.RefObject<View | null>;
  boardContainerRef?: React.RefObject<View | null>;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  bingoCardsData,
  mode,
  totalCount,
  handleClick,
  progressSectionRef,
  firstCardRef,
  boardContainerRef,
}) => {
  const selectedCount = useMemo(
    () =>
      mode === 'setup'
        ? bingoCardsData.reduce((acc, card) => acc + card.count, 0)
        : bingoCardsData.filter(card => card.status === 'check').length,
    [bingoCardsData, mode]
  );
  const progressPercentage = useMemo(
    () => (totalCount > 0 ? (selectedCount / totalCount) * 100 : 0),
    [selectedCount, totalCount]
  );

  const totalRows = useMemo(
    () => Math.ceil(bingoCardsData.length / 4),
    [bingoCardsData]
  );

  return (
    <View ref={boardContainerRef} style={styles.gridContainer}>
      <View ref={progressSectionRef} style={styles.progressSection}>
        <Text style={styles.progressText}>
          {selectedCount} of {totalCount} tasks{' '}
          {mode === 'setup' ? 'selected' : 'done'}
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.gridContent}>
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const startIndex = rowIndex * 4;
          const endIndex = startIndex + 4;
          const rowCards = bingoCardsData.slice(startIndex, endIndex);
          return (
            <BingoRow
              key={rowIndex}
              mode={mode}
              cards={rowCards}
              rowIndex={rowIndex}
              handleClick={handleClick}
              firstCardRef={rowIndex === 0 ? firstCardRef : undefined}
            />
          );
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
    color: COLORS.primary.blue,
    fontFamily: FONTS.family.poppinsMedium,
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.gray.lightMedium,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary.green,
    borderRadius: 3,
  },
  emptySpace: {
    width: 80,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
