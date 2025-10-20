import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface ProfileIconProps {
  image?: string | null;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  image,
  firstName,
  lastName,
  size = 40,
}) => {
  const getInitials = () => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getBackgroundColor = () => {
    const name = (firstName || '') + (lastName || '');
    const colors = [
      COLORS.primary.green.sgbus,
      COLORS.primary.blue.oxford,
      COLORS.primary.pink.bright_1,
      COLORS.secondary.purple.lavender,
      COLORS.secondary.blue.argentinian,
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (image) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Image
          source={{ uri: image }}
          style={[styles.image, { width: size, height: size }]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.placeholder,
        { width: size, height: size, backgroundColor: getBackgroundColor() },
      ]}
    >
      <Text
        style={[
          styles.initials,
          { fontSize: size * 0.4 },
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    borderRadius: 18,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
