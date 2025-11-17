import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../theme';
import { CustomButton } from '../common';

type Props = {
  weeks: number[];
  currentWeek: number;
  selectedWeek: number;
  selectWeek: (week: number) => void;
  isOrganizer: boolean;
};

const TAB_WIDTH = 104;
const TAB_GAP = 8;
const PADDING_HORIZONTAL = 16;

export const WeekTabBar: React.FC<Props> = ({
  weeks,
  currentWeek,
  selectedWeek,
  selectWeek,
  isOrganizer,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const isWeekDisabled = (week: number) => !isOrganizer && week > currentWeek;

  const handleWeekPress = (week: number) => {
    if (!isWeekDisabled(week)) {
      selectWeek(week);
    }
  };

  useEffect(() => {
    const selectedIndex = weeks.indexOf(selectedWeek);
    if (selectedIndex !== -1 && scrollViewRef.current) {
      const scrollPosition =
        selectedIndex * (TAB_WIDTH + TAB_GAP) - PADDING_HORIZONTAL;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: Math.max(0, scrollPosition),
          animated: true,
        });
      }, 100);
    }
  }, [selectedWeek, weeks]);

  const getTabIcon = (week: number) => {
    if (isWeekDisabled(week)) {
      return <Icon name="lock" size={12} style={styles.lockIcon} />;
    }
    if (currentWeek === week && selectedWeek !== week) {
      return (
        <Icon
          name="radio-button-checked"
          size={10}
          style={styles.currentIcon}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {weeks.map(week => {
          const isDisabled = isWeekDisabled(week);
          const isActive = selectedWeek === week;
          const isCurrent = currentWeek === week;

          return (
            <CustomButton
              key={week}
              text={`Week ${week}`}
              onPress={() => handleWeekPress(week)}
              disabled={isDisabled}
              icon={getTabIcon(week)}
              buttonStyle={[
                styles.tab,
                isActive && styles.activeTab,
                isCurrent && !isActive && styles.currentTab,
                isDisabled && styles.disabledTab,
              ]}
              textStyle={[
                styles.tabText,
                isActive && styles.activeTabText,
                isDisabled && styles.disabledTabText,
              ]}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  activeTab: {
    backgroundColor: COLORS.primary.green,
  },
  currentTab: {
    borderWidth: 2,
    borderColor: COLORS.primary.green,
  },
  disabledTab: {
    backgroundColor: COLORS.gray.veryLight,
    opacity: 0.6,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.blue,
  },
  activeTabText: {
    color: COLORS.primary.white,
  },
  disabledTabText: {
    color: COLORS.gray.mediumDark,
  },
  currentIcon: {
    marginLeft: 2,
    color: COLORS.primary.green,
  },
  lockIcon: {
    marginLeft: 2,
    color: COLORS.gray.mediumDark,
  },
});
