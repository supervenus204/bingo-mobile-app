import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  measureTarget: (
    callback: (layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void
  ) => void;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface HostTutorialOverlayProps {
  visible: boolean;
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const HostTutorialOverlay: React.FC<HostTutorialOverlayProps> = ({
  visible,
  steps,
  currentStep,
  onNext,
  onSkip,
  onComplete,
}) => {
  const [targetLayout, setTargetLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tooltipLayout, setTooltipLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const screenDimensions = Dimensions.get('window');
  const tooltipRef = useRef<View>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (visible && step) {
      step.measureTarget(layout => {
        setTargetLayout(layout);
      });
    }
  }, [visible, currentStep, step]);

  useEffect(() => {
    if (targetLayout && tooltipRef.current) {
      setTimeout(() => {
        tooltipRef.current?.measure((_x, _y, width, height) => {
          setTooltipLayout({ width, height });
        });
      }, 100);
    }
  }, [targetLayout]);

  if (!visible || !step || !targetLayout) {
    return null;
  }

  const calculateTooltipPosition = () => {
    const padding = 16;
    const tooltipWidth = 280;
    const tooltipHeight = tooltipLayout?.height || 200;

    const position = step.tooltipPosition || 'bottom';
    const targetCenterX = targetLayout.x + targetLayout.width / 2;
    const targetCenterY = targetLayout.y + targetLayout.height / 2;

    let tooltipX = 0;
    let tooltipY = 0;

    switch (position) {
      case 'top':
        tooltipX = Math.max(
          padding,
          Math.min(
            targetCenterX - tooltipWidth / 2,
            screenDimensions.width - tooltipWidth - padding
          )
        );
        tooltipY = Math.max(
          padding,
          targetLayout.y - tooltipHeight - padding - 20
        );
        break;
      case 'bottom':
        tooltipX = Math.max(
          padding,
          Math.min(
            targetCenterX - tooltipWidth / 2,
            screenDimensions.width - tooltipWidth - padding
          )
        );
        tooltipY = Math.min(
          screenDimensions.height - tooltipHeight - padding,
          targetLayout.y + targetLayout.height + padding + 20
        );
        break;
      case 'left':
        tooltipX = Math.max(
          padding,
          targetLayout.x - tooltipWidth - padding - 20
        );
        tooltipY = Math.max(
          padding,
          Math.min(
            targetCenterY - tooltipHeight / 2,
            screenDimensions.height - tooltipHeight - padding
          )
        );
        break;
      case 'right':
        tooltipX = Math.min(
          screenDimensions.width - tooltipWidth - padding,
          targetLayout.x + targetLayout.width + padding + 20
        );
        tooltipY = Math.max(
          padding,
          Math.min(
            targetCenterY - tooltipHeight / 2,
            screenDimensions.height - tooltipHeight - padding
          )
        );
        break;
    }

    return { x: tooltipX, y: tooltipY };
  };

  const tooltipPos = calculateTooltipPosition();

  const renderSpotlight = () => {
    const spotlightRadius =
      Math.max(targetLayout.width, targetLayout.height) / 2 + 8;
    const spotlightX = targetLayout.x + targetLayout.width / 2;
    const spotlightY = targetLayout.y + targetLayout.height / 2;

    return (
      <View
        style={[
          styles.spotlight,
          {
            left: spotlightX - spotlightRadius,
            top: spotlightY - spotlightRadius,
            width: spotlightRadius * 2,
            height: spotlightRadius * 2,
            borderRadius: spotlightRadius,
          },
        ]}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.dimmedBackground} pointerEvents="auto" />
        <View pointerEvents="none">{renderSpotlight()}</View>

        <View
          ref={tooltipRef}
          style={[
            styles.tooltip,
            {
              left: tooltipPos.x,
              top: tooltipPos.y,
            },
          ]}
          pointerEvents="auto"
          onLayout={() => {
            if (tooltipRef.current) {
              tooltipRef.current.measure((_x, _y, width, height) => {
                setTooltipLayout({ width, height });
              });
            }
          }}
        >
          <Text style={styles.tooltipTitle}>{step.title}</Text>
          <Text style={styles.tooltipDescription}>{step.description}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={isLastStep ? onComplete : onNext}
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? 'Got it' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  dimmedBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: COLORS.primary.white,
    shadowColor: COLORS.primary.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltip: {
    position: 'absolute',
    width: 280,
    backgroundColor: COLORS.primary.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.primary.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.primary.black,
    marginBottom: 8,
  },
  tooltipDescription: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.darker,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.medium,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.gray.darker,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary.blue,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.white,
  },
});
