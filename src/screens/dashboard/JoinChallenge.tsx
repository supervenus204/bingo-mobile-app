import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { SCREEN_NAMES } from '../../constants';
import { useToast } from '../../hooks/useToast';
import { joinChallenge } from '../../services/challenge.service';
import { COLORS, FONTS } from '../../theme';

export const JoinChallenge: React.FC = () => {
  const route = useRoute();
  const { challenge } = route.params as { challenge: any };
  const navigation = useNavigation();
  const { showToast } = useToast();

  const handleJoin = async () => {
    const invitationCode = challenge.invitation_code;
    try {
      await joinChallenge(invitationCode);
      navigation.navigate(SCREEN_NAMES._DASHBOARD.ACTIVE_CHALLENGE as never);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Something went wrong', 'error',);
    }
  };

  const handleCancel = () => {
    navigation.navigate(SCREEN_NAMES._DASHBOARD.ACTIVE_CHALLENGE as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Challenge?</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {challenge?.title || 'Challenge Title'}
          </Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>
              {challenge?.plan?.toUpperCase() || 'FREE'}
            </Text>
          </View>
        </View>
        <Text style={styles.hosted}>Hosted by You</Text>

        <View style={styles.row}>
          <Text style={styles.heart}>❤</Text>
          <Text style={styles.categoryText}>
            {challenge?.category_id || 'Category'}
          </Text>
        </View>

        <Text style={styles.duration}>
          Duration: {challenge?.duration || 0} weeks
        </Text>
        <Text style={styles.cardSize}>
          Card Size: {challenge?.card_size || 0} tasks
        </Text>
        <Text style={styles.participants}>
          Participants: {challenge?.participants?.length || 0}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          You’ll join this challenge as a Player.
        </Text>
        <Text style={styles.infoText}>No payment required.</Text>
        {challenge?.custom_cards && challenge.custom_cards.length > 0 && (
          <Text style={styles.infoText}>
            Custom Cards: {challenge.custom_cards.length}
          </Text>
        )}
        {challenge?.default_cards && challenge.default_cards.length > 0 && (
          <Text style={styles.infoText}>
            Default Cards: {challenge.default_cards.length}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="JOIN"
          onPress={handleJoin}
          buttonStyle={styles.joinButton}
          textStyle={styles.joinButtonText}
        />

        <Button
          text="CANCEL"
          onPress={handleCancel}
          buttonStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 28,
    color: COLORS.blue.oxford,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.gray.lightMedium,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 20,
    color: COLORS.text.primary,
  },
  freeBadge: {
    backgroundColor: COLORS.green.mantis,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  freeBadgeText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 12,
  },
  hosted: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  heart: {
    fontSize: 16,
    color: COLORS.primary.pink.bright_2,
  },
  categoryText: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  duration: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  cardSize: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  participants: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 12,
    gap: 6,
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  infoText: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  buttonContainer: {
    gap: 16,
  },
  joinButton: {
    backgroundColor: COLORS.primary.pink.bright_2,
    borderRadius: 10,
    height: 54,
  },
  joinButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.primary.pink.bright_2,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: COLORS.blue.indigo,
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 16,
    marginTop: 6,
  },
});
