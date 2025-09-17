import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BingoBoard } from '../../components/common/BingoBoard';
import { Footer, Header } from '../../components/create-challenge';
import { Button } from '../../components/ui';
import { SCREEN_NAMES } from '../../constants/screens';
import { getAllBingoCards } from '../../services';
import { useCreateStore } from '../../store';
import { COLORS } from '../../theme';

export const CardSetup: React.FC = () => {
  const navigation = useNavigation();
  const { bingoCards, setBingoCards, cardSize, title, categoryId } =
    useCreateStore();
  const selectedCardsCount = useMemo(
    () => bingoCards.reduce((total, card) => total + card.count, 0),
    [bingoCards]
  );

  useEffect(() => {
    const fetchBingoCards = async () => {
      const cards = await getAllBingoCards(categoryId);

      const bingoCards = cards.map((card: any) => ({
        id: card.id,
        name: card.name,
        color: card.color,
        type: card.type,
        count: 0,
      }));
      setBingoCards(bingoCards);
    };
    fetchBingoCards();
  }, [categoryId]);

  const handleIncrement = (id: string) => {
    if (selectedCardsCount >= cardSize) return;

    setBingoCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: card.count + 1 } : card
      )
    );
  };

  const handleDecrement = (id: string) => {
    setBingoCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: Math.max(0, card.count - 1) } : card
      )
    );
  };

  const handleReset = () => {
    setBingoCards(prev => prev.map(card => ({ ...card, count: 0 })));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Week 1 Card Setup"
        step={2}
        totalSteps={3}
        // onBack={handleBack}
        bgColor={COLORS.gray.veryLight}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Selected {selectedCardsCount} of {cardSize} - {title}
        </Text>
        <BingoBoard
          bingoCardsData={bingoCards}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          mode="edit"
        />
      </ScrollView>

      <Footer>
        <View style={styles.buttonGroup}>
          <Button
            text="Reset Selection"
            onPress={handleReset}
            variant="outline"
            buttonStyle={styles.resetButton}
          />
          <Button
            text="Next: Invite Participants"
            onPress={() =>
              navigation.navigate(
                SCREEN_NAMES._CREATE_CHALLENGE.INVITE_PARTICIPANTS as never
              )
            }
            disabled={selectedCardsCount !== cardSize}
            buttonStyle={styles.nextButton}
            textStyle={styles.nextButtonText}
          />
        </View>
      </Footer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  subtitle: {
    textAlign: 'left',
    fontSize: 12,
    color: 'black',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  resetButton: {
    width: '40%',
    height: 40,
    borderRadius: 12,
  },
  nextButton: {
    width: '55%',
    height: 40,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
