import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { boardLayoutOptions } from '../../constants';
import { usePlans } from '../../hooks';
import { COLORS, FONTS } from '../../theme';
import { Challenge } from '../../types/challenge.type';
import { ChallengeField } from './ChallengeField';

interface ChallengeDetailsViewProps {
  challenge: Challenge;
  categoryName?: string;
}

export const ChallengeDetailsView: React.FC<ChallengeDetailsViewProps> = ({
  challenge,
  categoryName,
}) => {
  const { getPlanById } = usePlans();

  const formatDayName = (day: string | null | undefined): string => {
    if (!day) return '';
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Challenge Details</Text>
      <ChallengeField label="Title" value={challenge.title || ''} />
      <ChallengeField label="Category" value={categoryName || ''} />
      <ChallengeField
        label="Plan"
        value={getPlanById(challenge.plan || '')?.name || ''}
      />
      <ChallengeField
        label="Duration"
        value={`${challenge.duration || 0} weeks`}
      />
      <ChallengeField
        label="Starting Day of Week"
        value={formatDayName(challenge.starting_day_of_week)}
      />
      <ChallengeField
        label="Card Size"
        value={
          boardLayoutOptions.find(l => l.id === challenge.card_size)?.size ||
          ''
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
  },
});

