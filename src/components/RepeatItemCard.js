import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import QuantityStepper from './QuantityStepper';
import { DietaryIndicator } from './FoodItemCard';

export default function RepeatItemCard({
  item,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  if (!item) return null;

  const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.itemImageURL ? (
          <Image
            source={{ uri: item.itemImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🍿</Text>
          </View>
        )}
        <View style={styles.dietaryBadge}>
          <DietaryIndicator type={item.foodType} size={13} />
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.itemName}
        </Text>
        <Text style={styles.price}>₹{price.toFixed(0)}</Text>
      </View>

      <View style={styles.actionContainer}>
        <QuantityStepper
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          size="small"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 10,
    marginRight: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: 90,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  dietaryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
    padding: 2,
  },
  details: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 17,
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
});
