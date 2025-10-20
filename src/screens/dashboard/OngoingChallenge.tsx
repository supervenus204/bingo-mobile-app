import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoadingCard } from '../../components/common';
import { DashboardHeader } from '../../components/dashboard';
import { ChallengeCard } from '../../components/dashboard/ChallengeCard';
import { Button } from '../../components/ui';
import { SCREEN_NAMES } from '../../constants';
import { useChallenges } from '../../hooks/useChallenges';
import {
  DashboardStackParamList,
  RootStackParamList,
} from '../../navigation/types';
import { useChallengesStore } from '../../store/challenges.store';
import { COLORS, FONTS } from '../../theme';
import { Challenge } from '../../types/challenge.type';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

type NavigationProp = NativeStackNavigationProp<DashboardStackParamList>;

export const OngoingChallenge: React.FC = () => {
  const { challenges, loading, error } = useChallenges({ auto: true });
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const { setCurrentChallenge } = useChallengesStore();

  const navigation = useNavigation<NavigationProp>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const getActiveChallenges = () => {
      const activeChallenges = challenges.filter(
        challenge => challenge.status !== 'finish'
      );
      setActiveChallenges(activeChallenges);
    };
    getActiveChallenges();
  }, [challenges]);

  return (
    <View style={styles.wrapper}>
      <DashboardHeader
        title="Ongoing Challenges"
        action={
          <TouchableOpacity onPress={() => {
            navigation.navigate(SCREEN_NAMES._DASHBOARD.ARCHIVED_CHALLENGE);
          }}>
            <Text style={{ color: COLORS.green.forest, marginRight: 4 }}>View Archived</Text>
          </TouchableOpacity>
        }
      />

      < View style={styles.content} >
        {!loading &&
          (activeChallenges.length === 0 ? (
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/dashboard/image.png')}
                  style={styles.image}
                />
              </View>

              <View style={[styles.transitionIcon]}>
                <Image
                  source={require('../../assets/images/dashboard/mark.png')}
                  style={styles.smallIcon}
                />
              </View>

              <View
                style={[styles.textContainer, { backgroundColor: '#7Ed957' }]}
              >
                <Text style={styles.headline}>
                  You haven't joined any challenges yet.
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.button]} onPress={() => {
                    navigation.navigate(SCREEN_NAMES._DASHBOARD.ENTER_CODE);
                  }}>
                    <Text style={styles.buttonText}>Join a Challenge</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => {
                    rootNavigation.navigate(SCREEN_NAMES.CREATE_CHALLENGE);
                  }}>
                    <Text style={[styles.buttonText, styles.outlineButtonText]}>
                      Host a Challenge
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <View style={styles.topButtons}>
                <Button
                  text="Join a Challenge"
                  buttonStyle={[styles.topBtn]}
                  textStyle={[styles.topBtnText]}
                  onPress={() => {
                    navigation.navigate(SCREEN_NAMES._DASHBOARD.ENTER_CODE);
                  }}
                />
                <Button
                  text="Host a Challenge"
                  onPress={() => {
                    rootNavigation.navigate(SCREEN_NAMES.CREATE_CHALLENGE);
                  }}
                  buttonStyle={[styles.topBtn]}
                  textStyle={[styles.topBtnText]}
                  variant="outline"
                />
              </View>

              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {activeChallenges.map(ch => (
                  <ChallengeCard
                    key={ch.id}
                    title={ch.title}
                    status={ch.status as never}
                    currentWeek={ch.current_week ?? 1}
                    totalWeeks={ch.duration}
                    progress={(ch.current_week ?? 0) / Math.max(1, ch.duration)}
                    isOrganizer={true}
                    plan={ch.plan}
                    onPress={() => {
                      setCurrentChallenge(ch as Challenge);
                      rootNavigation.navigate(SCREEN_NAMES.PLAY_CHALLENGE);
                    }}
                    onPayPress={
                      ch.status === 'unpaid'
                        ? () => {
                          const parent = navigation.getParent();
                          if (parent) {
                            parent.navigate(SCREEN_NAMES.CREATE_CHALLENGE, {
                              screen:
                                SCREEN_NAMES._CREATE_CHALLENGE
                                  .CHALLENGE_PUBLISHED,
                              params: { challenge: ch },
                            });
                          }
                        }
                        : undefined
                    }
                    disabled={ch.status !== 'active'}
                  />
                ))}
              </ScrollView>
            </View>
          ))}

        <LoadingCard
          visible={loading}
          message="Loading challenges..."
          subMessage="Please wait a moment"
        />
      </View >
    </View >
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  imageContainer: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transitionIcon: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.4 - 25,
    borderRadius: 12,
    zIndex: 1,
    alignSelf: 'center',
  },
  smallIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  headline: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: FONTS.family.poppinsRegular,
    paddingHorizontal: 30,
    color: COLORS.blue.oxford,
  },
  buttonRow: {
    width: DEVICE_WIDTH * 0.88,
    gap: 14,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 999,
    backgroundColor: COLORS.green.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsMedium,
    textTransform: 'uppercase',
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.green.forest,
  },
  outlineButtonText: {
    color: COLORS.green.forest,
  },
  topButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  topBtn: {
    paddingHorizontal: 12,
    height: 36,
    width: '48%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnText: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsMedium,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
