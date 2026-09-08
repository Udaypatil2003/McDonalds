import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import QuantityStepper from './QuantityStepper';

// Veg / Non-Veg Indicator (FSSAI standard)
export function DietaryIndicator({ type = 'Veg', size = 14 }) {
  const isVeg = (type || '').trim().toLowerCase() === 'veg';
  const color = isVeg ? THEME.colors.veg : THEME.colors.nonVeg;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      {isVeg ? (
        <View
          style={{
            width: size * 0.45,
            height: size * 0.45,
            borderRadius: (size * 0.45) / 2,
            backgroundColor: color,
          }}
        />
      ) : (
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: size * 0.28,
            borderRightWidth: size * 0.28,
            borderBottomWidth: size * 0.5,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      )}
    </View>
  );
}

export default function FoodItemCard({
  item,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  if (!item) return null;

  const price = item.effectivePrice || item.itemOfferRate || item.itemRate || 0;
  const originalRate = item.itemRate;
  const hasDiscount = item.itemOfferRate && originalRate && item.itemOfferRate < originalRate;

  return (
    <View style={styles.card}>
      <View style={styles.contentLeft}>
        <View style={styles.headerRow}>
          <DietaryIndicator type={item.foodType} size={15} />
          {item.isPopuplarItem && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>BESTSELLER</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemName} numberOfLines={2}>
          {item.itemName}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>₹{originalRate.toFixed(2)}</Text>
          )}
        </View>

        {(item.calories || item.itemWeight) && (
          <Text style={styles.metaText}>
            {[item.itemWeight, item.calories].filter(Boolean).join(' • ')}
          </Text>
        )}

        {item.isAddOnAvailable && (
          <Text style={styles.customisableText}>Customisable</Text>
        )}
      </View>

      <View style={styles.contentRight}>
        <View style={styles.imageWrapper}>
          {item.itemImageURL ? (
            <Image
              source={{ uri: item.itemImageURL }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🍿</Text>
            </View>
          )}

          <View style={styles.stepperWrapper}>
            <QuantityStepper
              quantity={quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  contentLeft: {
    flex: 1,
    paddingRight: THEME.spacing.md,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  popularBadge: {
    marginLeft: 6,
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: THEME.colors.goldBorder,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A6D00',
    letterSpacing: 0.3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  originalPrice: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  metaText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  customisableText: {
    fontSize: 11,
    color: '#8A6D00',
    fontWeight: '500',
    marginTop: 2,
  },
  contentRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
    alignItems: 'center',
  },
  foodImage: {
    width: 104,
    height: 104,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: '#F0F0EB',
  },
  placeholderImage: {
    width: 104,
    height: 104,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: '#F0F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 34,
  },
  stepperWrapper: {
    position: 'absolute',
    bottom: -8,
    zIndex: 2,
  },
});
