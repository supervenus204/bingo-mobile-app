import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CustomButton, LoadingCard } from '../../components/common';
import { BingoBoard } from '../../components/common/BingoBoard';
import { WeekTabBar } from '../../components/play-challenge/WeekTabBar';
import { WelcomeModal } from '../../components/ui/WelcomeModal';
import { createProgress, getAllBingoCards, getBingoTasks, getProgress, updateBingoTasks, updateProgress } from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS } from '../../theme';
import { BingoCard } from '../../types';

export const BingoScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();

  const [bingoCardsData, setBingoCardsData] = useState<BingoCard[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isTaskSetupMode, setIsTaskSetupMode] = useState(false);
  const [taskSetupCards, setTaskSetupCards] = useState<BingoCard[]>([]);

  const handleLetsGo = async () => {
    try {
      await createProgress(selectedChallenge?.id as string);

      setShowWelcomeModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { current_progress } = await updateProgress(
        selectedChallenge?.id as string,
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
              : (Date.parse(current_progress[index]) ? 'check' : 'unmark'),
        };
      });
      setBingoCardsData(_cardData as never);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week);
    const isOrganizer = selectedChallenge?.is_organizer || false;
    const currentWeek = selectedChallenge?.current_week || 1;

    // Show task setup for future weeks if user is organizer
    if (isOrganizer && week > currentWeek) {
      setIsTaskSetupMode(true);
    } else {
      setIsTaskSetupMode(false);
    }
  };

  const handleIncrement = (id: string) => {
    setTaskSetupCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: card.count + 1 } : card
      )
    );
  };

  const handleDecrement = (id: string) => {
    setTaskSetupCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, count: Math.max(0, card.count - 1) } : card
      )
    );
  };

  const handleSaveTaskSetup = async () => {
    const defaultCard = [];
    for (let i = 0; i < taskSetupCards.length; i++) {
      let count = taskSetupCards[i].count;
      while (count > 0) {
        defaultCard.push(taskSetupCards[i].id);
        count--;
      }
    }
    try {
      setLoading(true);
      await updateBingoTasks(
        selectedChallenge?.id as string,
        selectedWeek,
        defaultCard,
        []
      );
      setIsTaskSetupMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableWeeks = () => {
    const totalWeeks = selectedChallenge?.duration || 4;
    return Array.from({ length: totalWeeks }, (_, i) => i + 1);
  };

  useEffect(() => {
    if (selectedChallenge?.current_week) {
      setSelectedWeek(selectedChallenge.current_week);
    }
  }, [selectedChallenge?.current_week]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (isTaskSetupMode) {
          // Fetch task setup data for future weeks
          const { card_ids, bingoCards, status } = await getBingoTasks(
            selectedChallenge?.id as string,
            selectedWeek
          );

          if (status === 'not_ready' || status === undefined || status === null) {
            const cards = await getAllBingoCards(selectedChallenge?.category_id as string);
            const bingoCards = cards.map((card: any) => ({
              id: card.id,
              name: card.name,
              color: card.color,
              type: card.type,
              count: card_ids?.length
                ? card_ids.filter((id: string) => id === card.id).length
                : 0,
            }));
            setTaskSetupCards([...bingoCards]);
          } else {
            const _cardData = card_ids.map((id: string) => {
              const card = bingoCards.find((card: any) => card.id === id);
              return {
                id,
                name: card?.name,
                color: card?.color,
                type: card?.type,
                count: 1,
              };
            });
            setTaskSetupCards([..._cardData]);
          }
        } else {
          // Fetch progress data for current/past weeks
          const data = await getProgress(selectedChallenge?.id as string);

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
                    : (Date.parse(_progress) ? 'check' : 'unmark'),
              };
            });
            setBingoCardsData([..._cardData]);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedChallenge?.id && !showWelcomeModal) {
      fetchData();
    }
  }, [selectedChallenge?.id, showWelcomeModal, selectedWeek, isTaskSetupMode]);

  return (
    <>
      <View style={styles.container}>
        <WeekTabBar
          weeks={getAvailableWeeks()}
          currentWeek={selectedChallenge?.current_week || 1}
          selectedWeek={selectedWeek}
          selectWeek={handleWeekSelect}
          isOrganizer={selectedChallenge?.is_organizer || false}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isTaskSetupMode ? (
            <>
              <View style={styles.setupContainer}>
                <Text style={styles.setupTitle}>Setup Week {selectedWeek} Tasks</Text>
              </View>

              <BingoBoard
                bingoCardsData={taskSetupCards}
                mode="edit"
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
              <View style={styles.buttonGroup}>
                <CustomButton
                  text="Save Tasks"
                  onPress={handleSaveTaskSetup}
                  variant="primary"
                  buttonStyle={styles.saveButton}
                  textStyle={styles.buttonText}
                />
              </View>
            </>
          ) : (
            <BingoBoard
              bingoCardsData={bingoCardsData}
              mode="play"
              handleStatusChange={handleStatusChange}
              completedCount={bingoCardsData.filter(card => {
                if (!card.status) return true;
                return card.status !== 'mark' && card.status !== 'unmark';
              }).length}
              totalCount={bingoCardsData.length}
            />
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      <WelcomeModal
        visible={showWelcomeModal}
        onClose={() => { }}
        onLetsGo={handleLetsGo}
        title="Welcome aboard!"
        subtitle="Week 1 starts now—let's get moving."
        buttonText="LET'S GO"
      />

      <LoadingCard
        visible={loading}
        message={isTaskSetupMode ? "Loading task setup..." : "Fetching progress..."}
        subMessage="Please wait a moment"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue.dark,
  },
  scrollContainer: {
    flex: 1,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  setupContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  setupTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  saveButton: {
    width: '100%',
    height: 40,
  },
  buttonText: {
    fontSize: 12,
  },
});
