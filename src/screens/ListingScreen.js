import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { CATEGORIES, FOOD_TYPES } from '../constants/categories';
import Toolbar from '../components/Toolbar';
import RepeatItemCard from '../components/RepeatItemCard';
import FoodItemCard from '../components/FoodItemCard';
import FilterChip from '../components/FilterChip';
import foodService from '../services/foodService';
import { filterFoodItems } from '../utils/filterUtils';
import useCartStore from '../features/cart/cartStore';

export default function ListingScreen({ navigation, route }) {
  const initialCategory = route?.params?.initialCategory;

  // Selected Filters State
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedFoodType, setSelectedFoodType] = useState(null); // 'Veg' | 'Non Veg' | null

  // Cart Store
  const quantities = useCartStore((state) => state.quantities);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const openCart = useCartStore((state) => state.openCart);

  // All Items from FoodService
  const allItems = useMemo(() => foodService.getAllItems(), []);
  const repeatItems = useMemo(() => foodService.getRepeatItems(), []);

  // Sync route param change if navigated again
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory]);

  // Total cart badge count
  const totalCartCount = useMemo(() => {
    return Object.values(quantities).reduce((acc, q) => acc + q, 0);
  }, [quantities]);

  // Filter handlers
  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleToggleFoodType = (type) => {
    setSelectedFoodType((prev) => (prev === type ? null : type));
  };

  // Filtered Main Food List (Pure filter-combination logic)
  const filteredFoodItems = useMemo(() => {
    return filterFoodItems(allItems, {
      selectedCategories,
      selectedFoodType,
    });
  }, [allItems, selectedCategories, selectedFoodType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* 1. Fixed Toolbar at the top at all times (not part of the scroll) */}
      <Toolbar
        title="Food & Beverages"
        subtitle="Audi 2 • INOX Cinema"
        showBack={true}
        onBack={() => navigation.goBack()}
        cartCount={totalCartCount}
        onCartPress={openCart}
      />

      {/* 2. Below it, a single vertically scrolling body with sticky filter row at index 1 */}
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Horizontal Repeat List */}
        <View style={styles.repeatSection}>
          <View style={styles.repeatHeader}>
            <View style={styles.repeatTitleRow}>
              <Ionicons name="repeat" size={16} color={THEME.colors.primaryAccent} />
              <Text style={styles.repeatTitle}>REPEAT AGAIN?</Text>
            </View>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={repeatItems}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <RepeatItemCard
                item={item}
                quantity={quantities[item.itemId] || 0}
                onIncrement={() => increment(item.itemId)}
                onDecrement={() => decrement(item.itemId)}
              />
            )}
            contentContainerStyle={styles.repeatListContent}
          />
        </View>

        {/* Section 2: Sticky Filter Row (Veg/Non-Veg + 5 Categories) */}
        <View style={styles.stickyFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRowContent}
          >
            {/* Veg toggle */}
            <FilterChip
              label="Veg"
              type="veg"
              selected={selectedFoodType === FOOD_TYPES.VEG}
              onPress={() => handleToggleFoodType(FOOD_TYPES.VEG)}
            />

            {/* Non-Veg toggle */}
            <FilterChip
              label="Non-Veg"
              type="non_veg"
              selected={selectedFoodType === FOOD_TYPES.NON_VEG}
              onPress={() => handleToggleFoodType(FOOD_TYPES.NON_VEG)}
            />

            <View style={styles.filterDivider} />

            {/* 5 Category Chips */}
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <FilterChip
                  key={cat.id}
                  label={cat.label}
                  selected={isSelected}
                  onPress={() => handleToggleCategory(cat.id)}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Section 3: Vertical Main Food List */}
        <View style={styles.mainListSection}>
          <View style={styles.mainListHeader}>
            <Text style={styles.mainListTitle}>
              {selectedCategories.length === 1
                ? selectedCategories[0]
                : 'ALL ITEMS'}
            </Text>
            <Text style={styles.itemCountText}>
              {filteredFoodItems.length} {filteredFoodItems.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {filteredFoodItems.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={44} color={THEME.colors.textMuted} />
              <Text style={styles.noResultsTitle}>No items found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try adjusting your category or dietary filter combination.
              </Text>
            </View>
          ) : (
            filteredFoodItems.map((item) => (
              <FoodItemCard
                key={item.itemId}
                item={item}
                quantity={quantities[item.itemId] || 0}
                onIncrement={() => increment(item.itemId)}
                onDecrement={() => decrement(item.itemId)}
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  repeatSection: {
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.background,
  },
  repeatHeader: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  repeatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repeatTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.8,
  },
  repeatListContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  stickyFilterContainer: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  filterRowContent: {
    paddingHorizontal: THEME.spacing.lg,
    alignItems: 'center',
  },
  filterDivider: {
    width: 1,
    height: 22,
    backgroundColor: THEME.colors.border,
    marginRight: THEME.spacing.sm,
  },
  mainListSection: {
    backgroundColor: THEME.colors.surface,
    minHeight: 400,
  },
  mainListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xs,
  },
  mainListTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.8,
  },
  itemCountText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  noResultsContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 10,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
