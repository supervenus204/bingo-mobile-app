import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONTS } from '../../theme';
import { Input } from '../common';

type Props = {
  mode: 'edit' | 'view';
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const ProfileInput: React.FC<Props> = ({
  mode,
  label,
  value,
  onChangeText,
}) => {
  return (
    <View style={[styles.container, mode === 'edit' && styles.editMode]}>
      {mode === 'edit' ? (
        <>
          <Text style={styles.labelStyle}>{label}</Text>
          <Input
            inputStyle={styles.inputStyle}
            value={value}
            onChangeText={onChangeText}
            placeholder={`Enter your ${label}`}
          />
        </>
      ) : (
        <>
          <Text style={styles.labelStyle}>{label}</Text>
          <Text style={styles.valueStyle}>{value ? value : 'N/A'}</Text>
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
  editMode: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  inputStyle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.mediumDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
  },
});
