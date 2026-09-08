import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { DietaryIndicator } from './FoodItemCard';

export default function FilterChip({
  label,
  selected = false,
  onPress,
  type = 'category', // 'category' | 'veg' | 'non_veg'
}) {
  const isVeg = type === 'veg';
  const isNonVeg = type === 'non_veg';
  const isDietary = isVeg || isNonVeg;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        isDietary && selected && isVeg && styles.chipSelectedVeg,
        isDietary && selected && isNonVeg && styles.chipSelectedNonVeg,
      ]}
    >
      {isDietary && (
        <View style={styles.dietaryIconContainer}>
          <DietaryIndicator type={isVeg ? 'Veg' : 'Non Veg'} size={14} />
        </View>
      )}

      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          isDietary && selected && isVeg && styles.labelVeg,
          isDietary && selected && isNonVeg && styles.labelNonVeg,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: THEME.spacing.sm,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: THEME.colors.ctaGold,
    borderColor: THEME.colors.primaryAccent,
  },
  chipSelectedVeg: {
    backgroundColor: THEME.colors.vegLight,
    borderColor: THEME.colors.veg,
  },
  chipSelectedNonVeg: {
    backgroundColor: THEME.colors.nonVegLight,
    borderColor: THEME.colors.nonVeg,
  },
  dietaryIconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  labelSelected: {
    color: '#342600',
    fontWeight: '700',
  },
  labelVeg: {
    color: THEME.colors.veg,
    fontWeight: '700',
  },
  labelNonVeg: {
    color: THEME.colors.nonVeg,
    fontWeight: '700',
  },
});
