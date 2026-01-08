import { useState } from 'react';
import { updateProgress } from '../services';
import { playCompleteCardSound } from '../services/sound.service';
import { useChallengesStore } from '../store';
import { BingoCard } from '../types';

interface UseBingoProgressProps {
  bingoCardsData: BingoCard[];
  setBingoCardsData: React.Dispatch<React.SetStateAction<BingoCard[]>>;
  isSetupMode: boolean;
}

export const useBingoProgress = ({
  bingoCardsData,
  setBingoCardsData,
  isSetupMode,
}: UseBingoProgressProps) => {
  const { selectedChallenge } = useChallengesStore();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [pendingCardUpdate, setPendingCardUpdate] = useState<{
    cardId: number;
    status: string;
    previousStatus: 'mark' | 'unmark' | 'check' | undefined;
  } | null>(null);

  const handleClick = async (cardId: number, status?: string) => {
    if (isSetupMode) {
      if (
        bingoCardsData.reduce((acc, card) => acc + card.count, 0) >=
        (selectedChallenge?.card_size || 24)
      )
        return;

      const selectedCard = bingoCardsData[cardId];
      selectedCard.count++;
      setBingoCardsData(prev =>
        prev.map(card => (card.id === selectedCard.id ? selectedCard : card))
      );
    } else {
      const action = status || 'mark';
      const currentCardStatus = bingoCardsData[cardId]?.status;

      if (action === 'check' && currentCardStatus !== 'check') {
        const updatedCardData: BingoCard[] = bingoCardsData.map(
          (card, index) => {
            if (index === cardId) {
              return {
                ...card,
                status: 'check' as const,
              };
            }
            return card;
          }
        );

        const allCardsWillBeChecked = updatedCardData.every(
          card => card.status === 'check'
        );

        if (allCardsWillBeChecked) {
          setBingoCardsData(updatedCardData);
          setPendingCardUpdate({
            cardId,
            status: action,
            previousStatus: currentCardStatus,
          });
          setShowConfirmationModal(true);
          return;
        }
      }

      const { current_progress } = await updateProgress(
        selectedChallenge?.id as string,
        cardId,
        action
      );
      const _cardData = bingoCardsData.map((card, index) => {
        return {
          ...card,
          status:
            current_progress[index] === 'unmark' ||
            current_progress[index] === 'mark'
              ? current_progress[index]
              : Date.parse(current_progress[index])
              ? 'check'
              : 'unmark',
        };
      });
      setBingoCardsData(_cardData);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!pendingCardUpdate) return;

    try {
      const { current_progress } = await updateProgress(
        selectedChallenge?.id as string,
        pendingCardUpdate.cardId,
        pendingCardUpdate.status
      );
      const _cardData = bingoCardsData.map((card, index) => {
        return {
          ...card,
          status:
            current_progress[index] === 'unmark' ||
            current_progress[index] === 'mark'
              ? current_progress[index]
              : Date.parse(current_progress[index])
              ? 'check'
              : 'unmark',
        };
      });
      setBingoCardsData(_cardData);
      setPendingCardUpdate(null);
      setShowConfirmationModal(false);
      playCompleteCardSound();
      setShowCelebrationModal(true);
    } catch (error) {
      const _cardData: BingoCard[] = bingoCardsData.map((card, index) => {
        if (index === pendingCardUpdate.cardId) {
          return {
            ...card,
            status: pendingCardUpdate.previousStatus,
          };
        }
        return card;
      });
      setBingoCardsData(_cardData);
      setPendingCardUpdate(null);
      setShowConfirmationModal(false);
    }
  };

  const handleCancelCompletion = () => {
    if (!pendingCardUpdate) return;

    const _cardData: BingoCard[] = bingoCardsData.map((card, index) => {
      if (index === pendingCardUpdate.cardId) {
        return {
          ...card,
          status: pendingCardUpdate.previousStatus,
        };
      }
      return card;
    });
    setBingoCardsData(_cardData);
    setPendingCardUpdate(null);
    setShowConfirmationModal(false);
  };

  return {
    handleClick,
    showConfirmationModal,
    setShowConfirmationModal,
    showCelebrationModal,
    setShowCelebrationModal,
    handleConfirmCompletion,
    handleCancelCompletion,
  };
};
