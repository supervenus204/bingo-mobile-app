import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useChallengesStore } from '../store';
import { getNextOccurrenceOfDay } from '../utils/date.utils';

interface UseWhatsNextTutorialProps {
  weekTabBarRef: React.RefObject<View | null>;
  invitePlayersTabRef?: React.RefObject<
    React.ElementRef<typeof TouchableOpacity>
  >;
  chatTabRef?: React.RefObject<React.ElementRef<typeof TouchableOpacity>>;
  shouldShow: boolean;
}

export const useWhatsNextTutorial = ({
  weekTabBarRef,
  invitePlayersTabRef,
  chatTabRef,
  shouldShow,
}: UseWhatsNextTutorialProps) => {
  const { selectedChallenge } = useChallengesStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const challengeStartDate = useMemo(() => {
    if (!selectedChallenge?.starting_day_of_week) {
      return null;
    }
    return getNextOccurrenceOfDay(selectedChallenge.starting_day_of_week);
  }, [selectedChallenge?.starting_day_of_week]);

  const tutorialSteps = useMemo(() => {
    if (!selectedChallenge) return [];

    return [
      {
        id: 'build-next-board',
        title: 'Build next board',
        description:
          'Use the week tabs at the top to build boards for future weeks.',
        measureTarget: (
          callback: (layout: {
            x: number;
            y: number;
            width: number;
            height: number;
          }) => void
        ) => {
          weekTabBarRef.current?.measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              callback({ x: pageX, y: pageY, width, height });
            }
          );
        },
        tooltipPosition: 'bottom' as const,
      },
      {
        id: 'invite-players',
        title: 'Invite players',
        description:
          'Tap the person icon in the footer to add players to your challenge.',
        measureTarget: (
          callback: (layout: {
            x: number;
            y: number;
            width: number;
            height: number;
          }) => void
        ) => {
          invitePlayersTabRef?.current?.measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              callback({ x: pageX, y: pageY, width, height });
            }
          );
        },
        tooltipPosition: 'top' as const,
      },
      {
        id: 'send-message',
        title: 'Send a welcome message',
        description:
          'Use the chat tab to send a group message and get players excited!',
        measureTarget: (
          callback: (layout: {
            x: number;
            y: number;
            width: number;
            height: number;
          }) => void
        ) => {
          chatTabRef?.current?.measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              callback({ x: pageX, y: pageY, width, height });
            }
          );
        },
        tooltipPosition: 'top' as const,
      },
    ];
  }, [selectedChallenge, weekTabBarRef, invitePlayersTabRef, chatTabRef]);

  const handleNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  return {
    showTutorial,
    setShowTutorial,
    tutorialStep,
    setTutorialStep,
    tutorialSteps,
    handleNext,
    challengeStartDate,
  };
};
