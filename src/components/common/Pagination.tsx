import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 3,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <View style={styles.pagination}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationDisabled,
        ]}
        onPress={handlePrevious}
        disabled={currentPage === 1}
      >
        <Text
          style={[
            styles.paginationText,
            currentPage === 1 && styles.paginationDisabledText,
          ]}
        >
          ‹
        </Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      {visiblePages.map(page => (
        <TouchableOpacity
          key={page}
          style={[
            styles.paginationButton,
            page === currentPage && styles.paginationActive,
          ]}
          onPress={() => onPageChange(page)}
        >
          <Text
            style={[
              styles.paginationText,
              page === currentPage && styles.paginationActiveText,
            ]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationDisabled,
        ]}
        onPress={handleNext}
        disabled={currentPage === totalPages}
      >
        <Text
          style={[
            styles.paginationText,
            currentPage === totalPages && styles.paginationDisabledText,
          ]}
        >
          ›
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
  },
  paginationActive: {
    backgroundColor: COLORS.primary.main,
    borderColor: COLORS.primary.main,
  },
  paginationDisabled: {
    backgroundColor: COLORS.gray.veryLight,
    borderColor: COLORS.gray.light,
  },
  paginationText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.text.secondary,
  },
  paginationActiveText: {
    color: COLORS.primary.white,
  },
  paginationDisabledText: {
    color: COLORS.gray.medium,
  },
});
