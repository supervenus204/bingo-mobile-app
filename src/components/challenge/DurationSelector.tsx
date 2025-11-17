import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface Props {
  duration: number;
  maxDuration: number;
  onChange: (duration: number) => void;
}

export const DurationSelector: React.FC<Props> = ({
  duration,
  maxDuration,
  onChange,
}) => {
  return (
    <View>
      <Text style={styles.title}>Duration</Text>
      <Text style={styles.description}>
        Choose how long your challenge runs - 6 weeks is a popular pick (Premium
        & Pro only)
      </Text>
      <View style={styles.durationContainer}>
        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => onChange(duration - 1)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  duration === 1 ? COLORS.gray.medium : COLORS.text.primary,
              },
            ]}
          >
            -
          </Text>
        </TouchableOpacity>

        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{duration}</Text>
          <Text style={styles.durationUnit}>weeks</Text>
        </View>

        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => onChange(duration + 1)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  duration === maxDuration
                    ? COLORS.gray.medium
                    : COLORS.text.primary,
              },
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.blue,
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    marginBottom: 8,
  },
  description: {
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  durationButtonText: {
    fontSize: 24,
    color: COLORS.text.primary,
  },
  durationDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  durationUnit: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  durationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray.medium,
    borderRadius: 20,
  },
});
