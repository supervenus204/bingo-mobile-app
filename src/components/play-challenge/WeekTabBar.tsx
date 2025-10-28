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

export const WeekTabBar: React.FC<Props> = ({ weeks, currentWeek, selectedWeek, selectWeek, isOrganizer }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const isWeekDisabled = (week: number) => {
    return !isOrganizer && week > currentWeek;
  };

  const handleWeekPress = (week: number) => {
    if (!isWeekDisabled(week)) {
      selectWeek(week);
    }
  };

  useEffect(() => {
    const scrollToCurrentWeek = () => {
      const currentWeekIndex = weeks.indexOf(currentWeek);
      if (currentWeekIndex !== -1 && scrollViewRef.current) {
        const approximateTabWidth = 120;
        const scrollPosition = currentWeekIndex * approximateTabWidth;

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
          });
        }, 100);
      }
    };

    scrollToCurrentWeek();
  }, [currentWeek, weeks]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {weeks.map((week) => {
          const isDisabled = isWeekDisabled(week);
          const isActive = selectedWeek === week;
          const isCurrent = currentWeek === week;

          const getIcon = () => {
            if (isDisabled) {
              return <Icon name="lock" size={12} style={styles.lockIcon} />;
            }
            if (isCurrent && !isActive) {
              return <Icon name="radio-button-checked" size={10} style={styles.currentIcon} />;
            }
            return null;
          };

          return (
            <CustomButton
              key={week}
              text={`Week ${week}`}
              onPress={() => handleWeekPress(week)}
              disabled={isDisabled}
              icon={getIcon()}
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
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.green.forest,
  },
  currentTab: {
    borderWidth: 2,
    borderColor: COLORS.green.forest,
  },
  disabledTab: {
    backgroundColor: COLORS.gray.veryLight,
    opacity: 0.6,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.blue.oxford,
  },
  activeTabText: {
    color: COLORS.white,
  },
  disabledTabText: {
    color: COLORS.gray.mediumDark,
  },
  currentIcon: {
    marginLeft: 2,
    color: COLORS.green.forest,
  },
  lockIcon: {
    marginLeft: 2,
    color: COLORS.gray.mediumDark,
  },
});
