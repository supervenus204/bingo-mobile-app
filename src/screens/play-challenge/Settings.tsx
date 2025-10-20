import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LoadingCard } from '../../components/common';
import { BingoBoard } from '../../components/common/BingoBoard';
import { Header } from '../../components/play-challenge/Header';
import { Button } from '../../components/ui/Button';
import {
  getAllBingoCards,
  getBingoTasks,
  updateBingoTasks,
} from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS } from '../../theme';
import { BingoCard } from '../../types';

export const Settings: React.FC = () => {
  const { currentChallenge } = useChallengesStore();
  const categoryId = currentChallenge?.category_id;
  const totalWeeks = currentChallenge?.duration || 12;
  const currentWeek = currentChallenge?.current_week || 1;

  const [selectedWeek, setSelectedWeek] = React.useState<number>(currentWeek);
  const [cardData, setCardData] = React.useState<BingoCard[]>([]);
  const [mode, setMode] = React.useState<'view' | 'edit' | 'play'>('view');
  const [loading, setLoading] = React.useState<boolean>(false);
  const weekScrollRef = React.useRef<ScrollView>(null);
  const ITEM_WIDTH = 110; // styles.weekButton width
  const GAP = 10; // styles.weekSlider gap

  const handleIncrement = (id: string) => {
    setCardData(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: card.count + 1 } : card
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCardData(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: Math.max(0, card.count - 1) } : card
      )
    );
  };

  const fetchBingoCards = async () => {
    const cards = await getAllBingoCards(categoryId as string);

    const bingoCards = cards.map((card: any) => ({
      id: card.id,
      name: card.name,
      color: card.color,
      type: card.type,
      count: 0,
    }));
    return bingoCards;
  };

  useEffect(() => {
    const fetchBingoTasks = async () => {
      try {
        setLoading(true);
        const { card_ids, bingoCards, status } = await getBingoTasks(
          currentChallenge?.id as string,
          selectedWeek
        );

        if (status === 'not_ready' || status === undefined || status === null) {
          const bingoCards = await fetchBingoCards();

          const _cardData = bingoCards.map((card: any) => ({
            id: card.id,
            name: card.name,
            color: card.color,
            type: card.type,
            count: card_ids?.length
              ? card_ids.filter((id: string) => id === card.id).length
              : 0,
          }));

          setCardData([..._cardData]);
          setMode('edit');
          return;
        }

        const _cardData = card_ids.map((id: string) => {
          const card = bingoCards.find((card: any) => card.id === id);
          return {
            id,
            name: card?.name,
            color: card?.color,
            type: card?.type,
          };
        });

        setCardData([..._cardData]);
        setMode('view');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedWeek && currentChallenge?.id) {
      fetchBingoTasks();
    }
  }, [selectedWeek, currentChallenge?.id]);

  const scrollToWeek = (week: number, animated = true) => {
    const index = Math.max(0, week - 1);
    const x = Math.max(0, index * (ITEM_WIDTH + GAP));
    weekScrollRef.current?.scrollTo({ x, y: 0, animated });
  };

  React.useEffect(() => {
    scrollToWeek(currentWeek, false);
  }, []);

  const handleSave = async () => {
    const defaultCard = [];
    for (let i = 0; i < cardData.length; i++) {
      let count = cardData[i].count;
      while (count > 0) {
        defaultCard.push(cardData[i].id);
        count--;
      }
    }
    try {
      setLoading(true);
      await updateBingoTasks(
        currentChallenge?.id as string,
        selectedWeek,
        defaultCard,
        []
      );
      setMode('view');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          title={currentChallenge?.title || 'BINGO CARD'}
          current_week={currentChallenge?.current_week || 1}
        />

        {!loading && (
          <>
            <View style={styles.container}>
              <Text style={styles.inviteText}>3 participants invited</Text>

              <ScrollView
                ref={weekScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weekSlider}
              >
                {Array.from({ length: totalWeeks }, (_, idx) => {
                  const week = idx + 1;
                  const isSelected = selectedWeek === week;
                  return (
                    <Button
                      key={`week-${week}`}
                      text={`WEEK ${week}`}
                      onPress={() => setSelectedWeek(week)}
                      variant={isSelected ? 'primary' : 'outline'}
                      buttonStyle={styles.weekButton}
                      disabled={week > currentWeek + 1}
                    />
                  );
                })}
              </ScrollView>
              <BingoBoard
                bingoCardsData={cardData}
                mode={mode}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
              {mode === 'edit' && (
                <View style={styles.buttonGroup}>
                  <Button
                    text="Save"
                    onPress={handleSave}
                    variant="primary"
                    buttonStyle={styles.saveButton}
                    textStyle={styles.buttonText}
                  />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <LoadingCard
        visible={loading}
        message={
          mode === 'edit'
            ? 'Preparing bingo tasks...'
            : 'Loading bingo tasks...'
        }
        subMessage="Please wait a moment"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  inviteText: {
    fontSize: 14,
    color: COLORS.black,
    marginVertical: 12,
  },
  weekSlider: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.gray.medium,
  },
  weekButton: {
    borderRadius: 24,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  saveButton: {
    width: '60%',
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 12,
  },
  text: {
    fontSize: 12,
  },
  textSelected: {
    fontSize: 12,
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
