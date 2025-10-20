import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../theme';
import { COLORS } from '../../theme/colors';

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
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.blue.indigo} />
          </TouchableOpacity>
          <View style={styles.titleContent}>
            <Text style={styles.title}>{title}</Text>
            {step && totalSteps && (
              <Text style={styles.stepIndicator}>
                Step {step} of {totalSteps}
              </Text>
            )}
            {description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
      </View>

      {showProgressBar && step && totalSteps && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  titleContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.indigo,
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
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
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 0,
  },
});
