import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface DropdownItem {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  visible: boolean;
  onToggle: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  visible,
  onToggle,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        {trigger}
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onToggle}
      >
        <TouchableWithoutFeedback onPress={onToggle}>
          <View style={styles.overlay}>
            <View style={styles.dropdown}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.item,
                    index === items.length - 1 && styles.lastItem,
                  ]}
                  onPress={() => {
                    item.onPress();
                    onToggle();
                  }}
                  activeOpacity={0.7}
                >
                  {item.icon && (
                    <View style={styles.iconContainer}>{item.icon}</View>
                  )}
                  <Text
                    style={[
                      styles.itemText,
                      item.destructive && styles.destructiveText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  dropdown: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    minWidth: 160,
    shadowColor: COLORS.primary.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  itemText: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.blue,
  },
  destructiveText: {
    color: COLORS.primary.red,
  },
});
