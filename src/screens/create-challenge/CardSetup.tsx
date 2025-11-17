import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CustomButton, LoadingCard } from '../../components/common';
import { BingoBoard } from '../../components/common/BingoBoard';
import { Footer, Header } from '../../components/create-challenge';
import { DashboardHeader } from '../../components/dashboard';
import { AddCustomCardModal } from '../../components/play-challenge';
import { SCREEN_NAMES } from '../../constants/screens';
import { useCards } from '../../hooks';
import { useCreateStore } from '../../store';
import { COLORS } from '../../theme';
import { BingoCard } from '../../types';

export const CardSetup: React.FC = () => {
  const navigation = useNavigation();
  const { bingoCards, setBingoCards, cardSize, categoryId } = useCreateStore();
  const { cards, loading } = useCards(categoryId as string);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  useEffect(() => {
    if (cards && cards.length > 0) {
      setBingoCards(
        cards.map(card => ({
          ...card,
          count: 0,
          font_color: card.font_color || COLORS.primary.black,
          font_name: card.font_name || 'Poppins-Regular',
        }))
      );
    }
  }, [cards]);

  const selectedCardsCount = useMemo(
    () => bingoCards.reduce((total, card) => total + card.count, 0),
    [bingoCards]
  );

  const handleClick = (cardId: number, _status?: string) => {
    if (selectedCardsCount >= cardSize) return;

    const selectedCard = bingoCards[cardId];
    selectedCard.count++;
    setBingoCards(prev =>
      prev.map(card => (card.id === selectedCard.id ? selectedCard : card))
    );
  };

  const handleReset = () => {
    setBingoCards(prev => prev.map(card => ({ ...card, count: 0 })));
  };

  const handleBack = () => {
    navigation.navigate(
      SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE as never
    );
  };

  const handleCancel = () => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD as never);
  };

  const handleAddCustomCard = (
    title: string,
    color: string,
    font_color: string,
    font_name: string,
    count: number
  ) => {
    const currentTotal = bingoCards.reduce((sum, card) => sum + card.count, 0);
    const availableSpots = cardSize - currentTotal;
    const cardCount = Math.max(0, Math.min(count, availableSpots));

    if (cardCount > 0) {
      const newCard: BingoCard = {
        id: 'custom-' + Date.now(),
        name: title,
        color: color,
        font_color: font_color,
        font_name: font_name,
        type: 'custom',
        count: cardCount,
      };
      setBingoCards(prev => [...prev, newCard]);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Create Challenge"
        action={
          <TouchableOpacity onPress={handleCancel}>
            <Text style={{ color: COLORS.primary.green, marginRight: 4 }}>
              Cancel
            </Text>
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
        {loading ? (
          <LoadingCard
            visible={loading}
            message="Loading Bingo Cards..."
            subMessage="Please wait a moment while we load the bingo cards for you"
          />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <BingoBoard
                bingoCardsData={bingoCards}
                mode="setup"
                handleClick={handleClick}
                totalCount={cardSize}
              />
              <CustomButton
                text="Add Custom Task"
                icon={
                  <MaterialIcons
                    name="add"
                    size={24}
                    color={COLORS.primary.white}
                  />
                }
                onPress={() => setShowAddCustomModal(true)}
                variant="primary"
                buttonStyle={styles.addCustomButton}
                textStyle={styles.addCustomButtonText}
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
                  text="Next: Invite Players"
                  onPress={() =>
                    navigation.navigate(
                      SCREEN_NAMES._CREATE_CHALLENGE
                        .INVITE_PARTICIPANTS as never
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

      <AddCustomCardModal
        visible={showAddCustomModal}
        onClose={() => setShowAddCustomModal(false)}
        onSave={handleAddCustomCard}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.white,
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
  addCustomButton: {
    backgroundColor: COLORS.primary.blue,
    height: 48,
    width: '80%',
  },
  addCustomButtonText: {
    fontSize: 16,
    color: COLORS.primary.white,
  },
});
