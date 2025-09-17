import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LoadingCard } from '../../components/common';
import { BingoBoard } from '../../components/common/BingoBoard';
import { Header } from '../../components/play-challenge/Header';
import { WelcomeModal } from '../../components/ui/WelcomeModal';
import { createProgress, getProgress, updateProgress } from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { BingoCard } from '../../types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentChallenge } = useChallengesStore();

  const [bingoCardsData, setBingoCardsData] = useState<BingoCard[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeActionCardId, setActiveActionCardId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleLetsGo = async () => {
    try {
      await createProgress(currentChallenge?.id as string);

      setShowWelcomeModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowActions = (cardId: string) => {
    setActiveActionCardId(cardId || null);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      console.log(id, status);

      const { current_progress } = await updateProgress(
        currentChallenge?.id as string,
        id,
        status
      );
      const _cardData = bingoCardsData.map((card, index) => {
        return {
          ...card,
          status:
            current_progress[index] === 'unmark' ||
            current_progress[index] === 'mark'
              ? current_progress[index]
              : 'check',
        };
      });
      setBingoCardsData(_cardData as never);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getProgress(currentChallenge?.id as string);

        if (!data?.current_progress) {
          setShowWelcomeModal(true);
        } else {
          const { current_progress, card_ids, bingoCards } = data;

          const _cardData = card_ids.map((id: string, index: number) => {
            const card = bingoCards.find((card: any) => card.id === id);
            const _progress = current_progress[index];

            return {
              _id: index.toString(),
              id: card?.id,
              name: card?.name,
              color: card?.color,
              type: card?.type,
              status:
                _progress === 'mark' || _progress === 'unmark'
                  ? _progress
                  : 'check',
            };
          });
          setBingoCardsData([..._cardData]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentChallenge?.id && !showWelcomeModal) {
      fetchProgress();
    }
  }, [currentChallenge?.id, showWelcomeModal]);

  return (
    <>
      <View style={styles.container}>
        <Header
          title={currentChallenge?.title || 'BINGO CARD'}
          current_week={currentChallenge?.current_week || 1}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Summary */}
          <View style={styles.progressSummary}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Done</Text>
              <Text style={styles.summaryCount}>
                {bingoCardsData.filter(card => card.status === 'check').length}
              </Text>
              <Text style={styles.summaryTotal}>completed</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Doing</Text>
              <Text style={styles.summaryCount}>
                {bingoCardsData.filter(card => card.status === 'mark').length}
              </Text>
              <Text style={styles.summaryTotal}>in progress</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Todo</Text>
              <Text style={styles.summaryCount}>
                {
                  bingoCardsData.filter(
                    card => card.status === 'unmark' || !card.status
                  ).length
                }
              </Text>
              <Text style={styles.summaryTotal}>remaining</Text>
            </View>
          </View>

          <BingoBoard
            bingoCardsData={bingoCardsData}
            mode="play"
            handleStatusChange={handleStatusChange}
            onShowActions={handleShowActions}
            activeActionCardId={activeActionCardId}
          />
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <WelcomeModal
        visible={showWelcomeModal}
        onClose={() => {}}
        onLetsGo={handleLetsGo}
        title="Welcome aboard!"
        subtitle="Week 1 starts now—let's get moving."
        buttonText="LET'S GO"
      />

      <LoadingCard
        visible={loading}
        message="Fetching progress..."
        subMessage="Please wait a moment"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#062850',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  summaryCard: {
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flex: 1,
    maxWidth: 90,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  summaryTitle: {
    fontSize: 9,
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsMedium,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryCount: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsBold,
    marginBottom: 2,
  },
  summaryTotal: {
    fontSize: 8,
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsRegular,
    textAlign: 'center',
  },
});
