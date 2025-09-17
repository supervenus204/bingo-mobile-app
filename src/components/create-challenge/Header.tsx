import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {COLORS} from '../../theme/colors';

interface HeaderProps {
  title: string;
  step?: number;
  totalSteps?: number;
  showProgressBar?: boolean;
  onBack?: () => void;
  style?: ViewStyle;
  bgColor?: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  step,
  totalSteps,
  showProgressBar = true,
  onBack,
  bgColor = 'F0F0F0',
  description,
}) => {
  const progress = step && totalSteps ? step / totalSteps : 0;

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {step && totalSteps && (
            <Text style={styles.stepIndicator}>
              Step {step} of {totalSteps}
            </Text>
          )}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>

      {showProgressBar && step && totalSteps && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${progress * 100}%`}]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  progressContainer: {},
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray.lightMedium,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green.forest,
    borderRadius: 3,
  },
});
