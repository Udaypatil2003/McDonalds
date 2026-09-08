import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import Toolbar from '../components/Toolbar';
import CategoryTile from '../components/CategoryTile';
import RepeatItemCard from '../components/RepeatItemCard';
import foodService from '../services/foodService';
import useCartStore from '../features/cart/cartStore';

export default function HomeScreen({ navigation }) {
  const quantities = useCartStore((state) => state.quantities);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const openCart = useCartStore((state) => state.openCart);

  // Data from service
  const popularItems = useMemo(() => foodService.getPopularItems(), []);
  const repeatItems = useMemo(() => foodService.getRepeatItems(), []);

  // Total cart count
  const totalCartCount = useMemo(() => {
    return Object.values(quantities).reduce((acc, q) => acc + q, 0);
  }, [quantities]);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Listing', { initialCategory: categoryId });
  };

  const handleViewAllMenu = () => {
    navigation.navigate('Listing', { initialCategory: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />

      {/* Fixed Toolbar */}
      <Toolbar
        title="INOX F&B Ordering"
        subtitle="Audi 2 • Screen 1"
        showBack={false}
        cartCount={totalCartCount}
        onCartPress={openCart}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Cinema Banner Section */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>CINEMA EXCLUSIVE</Text>
          </View>
          <Text style={styles.heroTitle}>Delivered Right To Your Seat</Text>
          <Text style={styles.heroSubtitle}>
            Fresh gourmet popcorn, hot combos & chilled beverages
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewAllMenu}
            style={styles.orderNowButton}
          >
            <Text style={styles.orderNowText}>Order Now / View Full Menu</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B2F00" />
          </TouchableOpacity>
        </View>

        {/* Category Tiles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EXPLORE CATEGORIES</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRowContent}
          >
            {CATEGORIES.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Horizontal Repeat Order List */}
        {repeatItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <Ionicons name="repeat" size={18} color={THEME.colors.primaryAccent} />
                <Text style={styles.sectionTitle}>REPEAT AGAIN?</Text>
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
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        )}

        {/* Horizontal Popular Items List */}
        {popularItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <Ionicons name="flame" size={18} color="#D9534F" />
                <Text style={styles.sectionTitle}>POPULAR ITEMS</Text>
              </View>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularItems}
              keyExtractor={(item) => item.itemId}
              renderItem={({ item }) => (
                <RepeatItemCard
                  item={item}
                  quantity={quantities[item.itemId] || 0}
                  onIncrement={() => increment(item.itemId)}
                  onDecrement={() => decrement(item.itemId)}
                />
              )}
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        )}

        <View style={{ height: 32 }} />
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
  scrollContent: {
    paddingBottom: 24,
  },
  heroBanner: {
    backgroundColor: THEME.colors.cartBarBackground,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: '#F0E2BA',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryAccent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3D2F00',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  orderNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.ctaGold,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 8,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  orderNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2F00',
  },
  section: {
    marginTop: THEME.spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 1,
  },
  categoryRowContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  carouselContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
});
