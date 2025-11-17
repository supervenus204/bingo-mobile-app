import moment from 'moment-timezone';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { COLORS, FONTS } from '../../theme';

const TIMEZONE_LIST = moment.tz.names();

type Props = {
  mode: 'edit' | 'view';
  timezone: string;
  onSelect: (timezone: string) => void;
};

export const TimezoneSelector: React.FC<Props> = ({
  mode,
  timezone,
  onSelect,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTimezones = useMemo(() => {
    if (!search.trim()) {
      return TIMEZONE_LIST;
    }

    const query = search.trim().toLowerCase();
    return TIMEZONE_LIST.filter(name => name.toLowerCase().includes(query));
  }, [search]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsModalVisible(false);
    setSearch('');
  };

  if (mode === 'view') {
    return (
      <View style={styles.container}>
        <Text style={styles.labelStyle}>Timezone</Text>
        <Text style={styles.valueStyle}>{timezone || 'N/A'}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, styles.editContainer]}>
        <Text style={styles.labelStyle}>Timezone</Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.valueStyle}>{timezone || 'Select Timezone'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Enter timezone"
              placeholderTextColor={COLORS.gray.mediumDark}
              style={styles.searchInput}
              autoCapitalize="none"
            />
          </View>

          <FlatList
            data={filteredTimezones}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.listItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
    </>
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
  editContainer: {
    alignItems: 'flex-start',
    gap: 8,
  },
  labelStyle: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.primary,
  },
  valueStyle: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.primary.white,
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.mediumDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 14,
    color: COLORS.text.primary,
    backgroundColor: COLORS.primary.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  listItem: {
    paddingVertical: 14,
  },
  listItemText: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray.light,
  },
});
