import { StyleSheet, Text, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

import { COLORS, FONTS } from '../../theme';

const COUNTRY_PICKER_PROPS = {
  withFilter: true,
  withFlag: true,
  withCountryNameButton: true,
  withAlphaFilter: false,
  withCallingCode: false,
  withEmoji: true,
};

type Props = {
  mode: 'edit' | 'view';
  countryCode: string;
  onSelect: (countryCode: string) => void;
};

export const CountrySelector: React.FC<Props> = ({
  mode,
  countryCode,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {mode === 'edit' ? (
        <>
          <Text style={styles.labelStyle}>Country</Text>
          <CountryPicker
            countryCode={countryCode as any}
            {...COUNTRY_PICKER_PROPS}
            onSelect={country => onSelect(country.cca2)}
          />
        </>
      ) : (
        <>
          <Text style={styles.labelStyle}>Country</Text>
          <Text style={styles.valueStyle}>
            {countryCode ? countryCode : 'N/A'}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: COLORS.gray.light,
  },
  labelStyle: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
  },
  valueStyle: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
  },
});
