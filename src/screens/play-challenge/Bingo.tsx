import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BingoBoard, CustomButton, LoadingCard, WelcomeModal } from "../../components/common";
import { AddCustomCardModal, WeekTabBar } from "../../components/play-challenge";
import { createProgress, getAllBingoCards, getBingoTasks, getProgress, updateBingoTasks, updateProgress } from "../../services";
import { useChallengesStore } from "../../store";
import { COLORS } from "../../theme";
import { BingoCard } from "../../types";

export const BingoScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();

  const [selectedWeek, setSelectedWeek] = useState<number>(selectedChallenge?.current_week || 1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bingoCardsData, setBingoCardsData] = useState<BingoCard[]>([]);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  const availableWeeks = useMemo(() => {
    return Array.from({ length: selectedChallenge?.duration || 12 }, (_, index) => index + 1);
  }, [selectedChallenge?.duration]);

  const isSetupMode = useMemo(() => {
    return selectedChallenge?.is_organizer && selectedWeek > (selectedChallenge?.current_week || 1);
  }, [selectedChallenge?.is_organizer, selectedChallenge?.current_week, selectedWeek]);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      if (isSetupMode) {
        const { card_ids, status } = await getBingoTasks(
          selectedChallenge?.id as string,
          selectedWeek
        );
        if (status === 'not_ready' || status === undefined || status === null) {
          const cards = await getAllBingoCards(selectedChallenge?.category_id as string);
          const _cardData = cards.map((card: any) => {
            const count = card_ids?.length
              ? card_ids.filter((id: string) => id === card.id).length
              : 0;
            return {
              id: card.id,
              name: card.name,
              color: card.color,
              type: card.type || 'default',
              count,
              _count: count
            };
          })
          setBingoCardsData(_cardData);
        }
      } else {
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
          setBingoCardsData(_cardData);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [selectedChallenge?.id, selectedWeek, isSetupMode]);

  useEffect(() => {
    if (showWelcomeModal || saving) {
      return;
    }
    getData();
  }, [getData, showWelcomeModal, saving]);

  const handleLetsGo = async () => {
    try {
      await createProgress(selectedChallenge?.id as string);

      setShowWelcomeModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveTaskSetup = async () => {
    const defaultCard: string[] = [];
    const customCardData: Array<{ title: string; color: string; count: number }> = [];

    for (let i = 0; i < bingoCardsData.length; i++) {
      const card = bingoCardsData[i];
      if (card.id.startsWith('custom-')) {
        if (card.count > 0) {
          customCardData.push({
            title: card.name,
            color: card.color,
            count: card.count
          });
        }
      } else {
        let count = card.count;
        while (count > 0) {
          defaultCard.push(card.id as string);
          count--;
        }
      }
    }

    try {
      setSaving(true);
      await updateBingoTasks(
        selectedChallenge?.id as string,
        selectedWeek,
        defaultCard,
        customCardData
      );
      await getData();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetTaskSetup = () => {
    if (!isSetupMode) return;
    setBingoCardsData(prev => prev.filter(card => !card.id.startsWith('custom-')).map(card => ({ ...card, count: card._count || 0 })));
  };

  const handleAddCustomCard = (title: string, color: string, count: number) => {
    const maxCount = selectedChallenge?.card_size ?? 24;
    const currentTotal = bingoCardsData.reduce((sum, card) => sum + card.count, 0);
    const availableSpots = maxCount - currentTotal;
    const cardCount = Math.max(0, Math.min(count, availableSpots));

    const newCard: BingoCard = {
      id: 'custom-' + Date.now(),
      name: title,
      color: color,
      type: 'custom',
      count: cardCount
    };
    setBingoCardsData(prev => [...prev, newCard]);
  };

  const handleClick = async (cardId: number, status?: string) => {
    if (isSetupMode) {
      if (bingoCardsData.reduce((acc, card) => acc + card.count, 0) >= (selectedChallenge?.card_size || 24)) return;

      const selectedCard = bingoCardsData[cardId];
      selectedCard.count++;
      setBingoCardsData(prev => prev.map(card => card.id === selectedCard.id ? selectedCard : card));
    } else {
      const { current_progress } = await updateProgress(
        selectedChallenge?.id as string,
        cardId,
        status || 'mark'
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
      setBingoCardsData(_cardData);
    }
  };

  return (
    <View style={styles.container}>
      <WeekTabBar
        weeks={availableWeeks}
        currentWeek={selectedChallenge?.current_week || 1}
        selectedWeek={selectedWeek}
        selectWeek={setSelectedWeek}
        isOrganizer={selectedChallenge?.is_organizer || false}
      />

      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {isSetupMode
                ? 'Setup Week ' + selectedWeek + ' Tasks'
                : 'Let\'s get started with Week ' + selectedWeek + ' Bingo'}
            </Text>
          </View>
          <BingoBoard
            bingoCardsData={bingoCardsData}
            mode={isSetupMode ? 'setup' : 'play'}
            handleClick={handleClick}
            totalCount={selectedChallenge?.card_size || 24}
          />
          {isSetupMode && (
            <>
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={() => setShowAddCustomModal(true)}
              >
                <MaterialIcons name="add" size={24} color={COLORS.white} />
                <Text style={styles.addCustomButtonText}>Add Custom Task</Text>
              </TouchableOpacity>
              <View style={styles.buttonGroup}>
                <CustomButton
                  text="Reset Tasks"
                  onPress={handleResetTaskSetup}
                  variant="primary"
                  buttonStyle={styles.resetButton}
                />
                <CustomButton
                  text="Save Tasks"
                  onPress={handleSaveTaskSetup}
                  variant="primary"
                  buttonStyle={styles.saveButton}
                  loading={saving}
                />
              </View>
            </>
          )}
        </ScrollView>

        <WelcomeModal
          visible={showWelcomeModal}
          onClose={() => { }}
          onLetsGo={handleLetsGo}
          title="Welcome aboard!"
          subtitle="Week 1 starts now—let's get moving."
          buttonText="LET'S GO"
        />
      </View>

      <AddCustomCardModal
        visible={showAddCustomModal}
        onClose={() => setShowAddCustomModal(false)}
        onSave={handleAddCustomCard}
      />

      <LoadingCard
        visible={loading}
        message={isSetupMode ? "Loading bingo cards..." : "Fetching progress..."}
        subMessage="Please wait a moment"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue.dark,
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
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
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 4,
  },
  resetButton: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 4,
    backgroundColor: COLORS.primary.pink.bright_1,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue.oxford,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  addCustomButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.white,
  },
});
