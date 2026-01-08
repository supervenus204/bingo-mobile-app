import { useState } from 'react';
import { updateBingoTasks } from '../services';
import { useChallengesStore, useHostTutorialStore } from '../store';
import { BingoCard } from '../types';

interface UseBoardSetupProps {
  selectedWeek: number;
  bingoCardsData: BingoCard[];
  setBingoCardsData: React.Dispatch<React.SetStateAction<BingoCard[]>>;
  refreshData: () => Promise<void>;
  refreshDataSilent: () => Promise<string | null | undefined>;
}

export const useBoardSetup = ({
  selectedWeek,
  bingoCardsData,
  setBingoCardsData,
  refreshData,
  refreshDataSilent,
}: UseBoardSetupProps) => {
  const { selectedChallenge } = useChallengesStore();
  const { completedWhatsNextTutorial, hasHydrated } = useHostTutorialStore();
  const [saving, setSaving] = useState(false);
  const [showBoardSavedModal, setShowBoardSavedModal] = useState(false);
  const [boardSavedWeek, setBoardSavedWeek] = useState<number | null>(null);
  const [boardStatus, setBoardStatus] = useState<string | null>(null);

  const handleSaveTaskSetup = async () => {
    const defaultCard: string[] = [];
    const customCardData: Array<{
      title: string;
      color: string;
      font_color: string;
      font_name: string;
      count: number;
    }> = [];

    for (let i = 0; i < bingoCardsData.length; i++) {
      const card = bingoCardsData[i];
      if (card.id.startsWith('custom-')) {
        if (card.count > 0) {
          customCardData.push({
            title: card.name,
            color: card.color,
            font_color: card.font_color,
            font_name: card.font_name,
            count: card.count,
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
      const status = await refreshDataSilent();
      setBoardSavedWeek(selectedWeek);
      setBoardStatus(status || null);
      setShowBoardSavedModal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetTaskSetup = () => {
    setBingoCardsData(prev =>
      prev
        .filter(card => !card.id.startsWith('custom-'))
        .map(card => ({ ...card, count: 0 }))
    );
  };

  const handleAddCustomCard = (
    title: string,
    color: string,
    font_color: string,
    font_name: string,
    count: number
  ) => {
    const maxCount = selectedChallenge?.card_size ?? 24;
    const currentTotal = bingoCardsData.reduce(
      (sum, card) => sum + card.count,
      0
    );
    const availableSpots = maxCount - currentTotal;
    const cardCount = Math.max(0, Math.min(count, availableSpots));

    const newCard: BingoCard = {
      id: 'custom-' + Date.now(),
      name: title,
      color: color,
      font_color: font_color,
      font_name: font_name,
      type: 'custom',
      count: cardCount,
    };
    setBingoCardsData(prev => [...prev, newCard]);
  };

  const shouldShowTutorial = (): boolean => {
    return (
      hasHydrated &&
      !completedWhatsNextTutorial &&
      Boolean(selectedChallenge?.is_organizer)
    );
  };

  return {
    saving,
    showBoardSavedModal,
    setShowBoardSavedModal,
    boardSavedWeek,
    setBoardSavedWeek,
    boardStatus,
    handleSaveTaskSetup,
    handleResetTaskSetup,
    handleAddCustomCard,
    shouldShowTutorial,
  };
};
