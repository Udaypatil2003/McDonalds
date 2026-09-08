import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export default function QuantityStepper({
  quantity = 0,
  onIncrement,
  onDecrement,
  size = 'normal',
  style,
}) {
  const isSmall = size === 'small';

  if (quantity === 0) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onIncrement}
        style={[
          styles.addButton,
          isSmall && styles.addButtonSmall,
          style,
        ]}
      >
        <Text style={[styles.addButtonText, isSmall && styles.addButtonTextSmall]}>
          ADD
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.stepperContainer,
        isSmall && styles.stepperContainerSmall,
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        style={[styles.stepperButton, isSmall && styles.stepperButtonSmall]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.stepperButtonText, isSmall && styles.stepperButtonTextSmall]}>
          −
        </Text>
      </TouchableOpacity>

      <Text style={[styles.quantityText, isSmall && styles.quantityTextSmall]}>
        {quantity}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        style={[styles.stepperButton, isSmall && styles.stepperButtonSmall]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.stepperButtonText, isSmall && styles.stepperButtonTextSmall]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: THEME.colors.goldLight,
    borderColor: THEME.colors.primaryAccent,
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  addButtonSmall: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.sm,
  },
  addButtonText: {
    color: '#3D2F00',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButtonTextSmall: {
    fontSize: 11,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 92,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperContainerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 78,
  },
  stepperButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonSmall: {
    paddingHorizontal: 4,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  stepperButtonTextSmall: {
    fontSize: 14,
    lineHeight: 16,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  quantityTextSmall: {
    fontSize: 12,
  },
});
