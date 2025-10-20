import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardHeader } from '../../components/dashboard';
import { useChallenges } from '../../hooks';
import { COLORS, FONTS } from '../../theme';

export const ArchivedChallenge: React.FC = () => {
  const { challenges, loading, error } = useChallenges();

  return (
    <View style={styles.wrapper}>
      <DashboardHeader title="Archived Challenges" />

      <View style={styles.content}>
        <Text style={styles.title}>Completed Challenges</Text>
        <Text style={styles.subtitle}>View your past achievements</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>January Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>February Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>March Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View All Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: FONTS.size['2xl'],
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.dark,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: COLORS.gray.mediumDark,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsSemiBold,
  },
});
