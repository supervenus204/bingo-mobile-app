import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoadingCard } from '../../components/common';
import { BingoBoard } from '../../components/common/BingoBoard';
import { Footer, Header } from '../../components/create-challenge';
import { DashboardHeader } from '../../components/dashboard';
import { CustomButton } from '../../components/common';
import { SCREEN_NAMES } from '../../constants/screens';
import { useCards } from '../../hooks/useCards';
import { useCreateStore } from '../../store';
import { COLORS } from '../../theme';

export const CardSetup: React.FC = () => {
  const navigation = useNavigation();
  const { bingoCards, setBingoCards, cardSize, title, categoryId } =
    useCreateStore();
  const { cards } = useCards(categoryId as string);

  useEffect(() => {
    if (cards && cards.length > 0) {
      setBingoCards(cards.map(card => ({
        ...card,
        count: 0,
      })));
    }
  }, [cards]);

  const selectedCardsCount = useMemo(
    () => bingoCards.reduce((total, card) => total + card.count, 0),
    [bingoCards]
  );

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

  const handleBack = () => {
    navigation.navigate(SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE as never);
  };

  const handleCancel = () => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
  }

  return (
    <>
      <DashboardHeader
        title="Create Challenge"
        action={
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ color: COLORS.green.forest, marginRight: 4 }}>Cancel</Text>
          </TouchableOpacity>
        }
        showProfileIcon={false}
      />
      <View style={styles.container}>
        <Header
          title="Week 1 Card Setup"
          step={2}
          totalSteps={3}
          onBack={handleBack}
          bgColor={COLORS.gray.veryLight}
        />
        {cards === undefined || cards.length === 0 ? (
          <LoadingCard
            visible={cards === undefined || cards.length === 0}
            message="Loading Bingo Cards..."
            subMessage="Please wait a moment while we load the bingo cards for you"
          />
        ) : (
          <>
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
                mode="setup"
              />
            </ScrollView>

            <Footer>
              <View style={styles.buttonGroup}>
                <CustomButton
                  text="Reset Selection"
                  onPress={handleReset}
                  variant="outline"
                  buttonStyle={styles.resetButton}
                />
                <CustomButton
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
          </>
        )}
      </View>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
