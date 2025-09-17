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
  const { challenges, currentChallenge } = useChallengesStore();
  const activeChallenges = challenges.filter(
    challenge => challenge.status === 'active'
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
            <TouchableOpacity
              onPress={closeWithAnimation}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={COLORS.gray.darker} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Switch Challenges Section */}
            <View style={[styles.section, styles.firstSection]}>
              <TouchableOpacity
                onPress={onGoToDashboard}
                style={styles.sectionButton}
              >
                <Icon name="swap-horiz" size={24} color={COLORS.blue.oxford} />
                <Text style={styles.sectionButtonText}>Switch Challenges</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray.medium}
                />
              </TouchableOpacity>

              {activeChallenges.length > 0 && (
                <View style={styles.challengesList}>
                  <Text style={styles.sectionSubtitle}>Active Challenges</Text>
                  {activeChallenges.map(challenge => (
                    <TouchableOpacity
                      key={challenge.id}
                      style={[
                        styles.challengeItem,
                        challenge.id === currentChallenge?.id &&
                          styles.currentChallenge,
                      ]}
                      onPress={() => onSwitchChallenge(challenge)}
                    >
                      <View style={styles.challengeInfo}>
                        <Text
                          style={[
                            styles.challengeTitle,
                            challenge.id === currentChallenge?.id &&
                              styles.currentChallengeTitle,
                          ]}
                        >
                          {challenge.title}
                        </Text>
                        <Text style={styles.challengeWeek}>
                          Week {challenge.current_week}
                        </Text>
                      </View>
                      {challenge.id === currentChallenge?.id && (
                        <Icon
                          name="check-circle"
                          size={20}
                          color={COLORS.green.sgbus}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Profile Section */}
            <View style={styles.section}>
              <TouchableOpacity
                onPress={onProfile}
                style={styles.sectionButton}
              >
                <Icon name="person" size={24} color={COLORS.blue.oxford} />
                <Text style={styles.sectionButtonText}>Profile</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray.medium}
                />
              </TouchableOpacity>
            </View>

            {/* Logout Section */}
            <View style={styles.section}>
              <TouchableOpacity onPress={onLogout} style={styles.sectionButton}>
                <Icon name="logout" size={24} color={COLORS.red.bright} />
                <Text style={[styles.sectionButtonText, styles.logoutText]}>
                  Logout
                </Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray.medium}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
  },
  firstSection: {
    marginTop: 8,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray.light,
    borderRadius: 10,
    marginBottom: 6,
  },
  sectionButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.black,
  },
  logoutText: {
    color: COLORS.red.bright,
  },
  challengesList: {
    marginTop: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.gray.darker,
    marginBottom: 8,
    marginLeft: 12,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  currentChallenge: {
    borderColor: COLORS.blue.oxford,
    backgroundColor: COLORS.secondary.blue.alice,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.black,
    marginBottom: 2,
  },
  currentChallengeTitle: {
    color: COLORS.blue.oxford,
    fontFamily: FONTS.family.poppinsBold,
  },
  challengeWeek: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.darker,
  },
});
