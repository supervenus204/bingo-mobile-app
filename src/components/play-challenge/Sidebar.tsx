import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { Challenge } from '../../types/challenge.type';
import { CustomButton } from '../common';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSwitchChallenge: (challenge: Challenge) => void;
  onProfile: () => void;
  onLogout: () => void;
  onGoToDashboard: () => void;
};

const { width: screenWidth } = Dimensions.get('window');

export const Sidebar: React.FC<Props> = ({
  visible,
  onClose,
  onSwitchChallenge,
  onProfile,
  onLogout,
  onGoToDashboard,
}) => {
  const { ongoingChallenges, selectedChallenge } = useChallengesStore();
  const activeChallenges = ongoingChallenges.filter(
    (challenge: Challenge) => challenge.status === 'active'
  );
  const sidebarWidth = Math.min(screenWidth * 0.86, 380);

  const translateX = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    if (visible) {
      translateX.setValue(-sidebarWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX, sidebarWidth]);

  const closeWithAnimation = () => {
    Animated.timing(translateX, {
      toValue: -sidebarWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  // Gestures removed: closing is available via backdrop tap and X button only

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeWithAnimation}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.sidebar,
            { width: sidebarWidth, transform: [{ translateX }] },
          ]}
        >
          {/* Header with close button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <CustomButton
              onPress={closeWithAnimation}
              buttonStyle={styles.closeButton}
              variant="default"
              icon={<Icon name="close" size={22} color={COLORS.gray.veryDark} />}
            />
          </View>

          <View style={styles.mainContent}>
            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Switch Challenges Section */}
              <View style={[styles.section, styles.firstSection]}>
                <View style={styles.sectionButtonWrapper}>
                  <CustomButton
                    onPress={onGoToDashboard}
                    buttonStyle={styles.sectionButton}
                    textStyle={styles.sectionButtonText}
                    variant="default"
                    icon={<Icon name="swap-horiz" size={22} color={COLORS.blue.oxford} />}
                    text="Switch Challenges"
                  />
                  <Icon
                    name="chevron-right"
                    size={22}
                    color={COLORS.gray.medium}
                  />
                </View>

                {activeChallenges.length > 0 && (
                  <View style={styles.challengesList}>
                    <Text style={styles.sectionSubtitle}>Active Challenges</Text>
                    {activeChallenges.map((challenge: Challenge) => (
                      <TouchableOpacity
                        key={challenge.id}
                        style={[
                          styles.challengeItem,
                          challenge.id === selectedChallenge?.id &&
                          styles.currentChallenge,
                        ]}
                        onPress={() => onSwitchChallenge(challenge)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.challengeInfo}>
                          <Text
                            style={[
                              styles.challengeTitle,
                              challenge.id === selectedChallenge?.id &&
                              styles.currentChallengeTitle,
                            ]}
                          >
                            {challenge.title}
                          </Text>
                          <Text style={styles.challengeWeek}>
                            Week {challenge.current_week}
                          </Text>
                        </View>
                        {challenge.id === selectedChallenge?.id && (
                          <Icon
                            name="check-circle"
                            size={24}
                            color={COLORS.green.sgbus}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

          </View>
          {/* Profile and Logout at Bottom */}
          <View style={styles.bottomSection}>
            <View style={styles.bottomButtonsRow}>
              <View style={[styles.sectionButtonWrapper, styles.bottomButton]}>
                <CustomButton
                  onPress={onProfile}
                  buttonStyle={styles.sectionButton}
                  textStyle={[styles.sectionButtonText, styles.bottomButtonText]}
                  variant="default"
                  icon={<Icon name="person" size={20} color={COLORS.blue.oxford} />}
                  text="Profile"
                />
                <Icon
                  name="chevron-right"
                  size={18}
                  color={COLORS.gray.medium}
                />
              </View>

              <View style={[styles.sectionButtonWrapper, styles.bottomButton]}>
                <CustomButton
                  onPress={onLogout}
                  buttonStyle={styles.sectionButton}
                  textStyle={[styles.sectionButtonText, styles.logoutText, styles.bottomButtonText]}
                  variant="default"
                  icon={<Icon name="logout" size={20} color={COLORS.red.bright} />}
                  text="Logout"
                />
                <Icon
                  name="chevron-right"
                  size={18}
                  color={COLORS.gray.medium}
                />
              </View>
            </View>
          </View>
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: sidebarWidth,
            right: 0,
            bottom: 0,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeWithAnimation}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.gray.veryLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    gap: 0,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flex: 1,
  },
  bottomSection: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.light,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bottomButton: {
    flex: 1,
    marginBottom: 0,
  },
  bottomButtonText: {
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  firstSection: {
    marginTop: 12,
  },
  sectionButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray.veryLight,
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 12,
  },
  sectionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 0,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  sectionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.black,
    letterSpacing: 0.2,
  },
  logoutText: {
    color: COLORS.red.bright,
  },
  challengesList: {
    marginTop: 16,
    paddingTop: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.gray.dark,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  currentChallenge: {
    backgroundColor: COLORS.secondary.blue.alice,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.black,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  currentChallengeTitle: {
    color: COLORS.blue.oxford,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
  },
  challengeWeek: {
    fontSize: 13,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.darker,
    opacity: 0.85,
  },
});
