import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface AvatarProps {
  firstName: string;
  lastName: string;
  image?: string | null;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  image,
  size = 48,
}) => {
  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
    },
  ];

  const textStyle = [
    styles.initials,
    {
      fontSize: size * 0.4,
    },
  ];

  if (image) {
    return (
      <View style={containerStyle}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{getInitials()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    backgroundColor: COLORS.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initials: {
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.primary.main,
    textAlign: 'center',
  },
});
