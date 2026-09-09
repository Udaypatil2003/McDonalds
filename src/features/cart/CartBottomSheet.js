import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import useCartStore from './cartStore';
import foodService from '../../services/foodService';
import CartLineItem from '../../components/CartLineItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CartBottomSheet() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const quantities = useCartStore((state) => state.quantities);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  const itemsMap = foodService.getItemsMap();

  // Animated slide & fade
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCartOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCartOpen]);

  // Compute active cart items and totals
  const cartItems = useMemo(() => {
    const list = [];
    for (const [itemId, qty] of Object.entries(quantities)) {
      if (qty > 0 && itemsMap.has(itemId)) {
        list.push({
          item: itemsMap.get(itemId),
          quantity: qty,
        });
      }
    }
    return list;
  }, [quantities, itemsMap]);

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, ci) => {
      const price =
        ci.item.effectivePrice || ci.item.itemOfferRate || ci.item.itemRate || 0;
      return acc + price * ci.quantity;
    }, 0);
  }, [cartItems]);

  if (!isCartOpen) return null;

  return (
    <Modal
      transparent
      visible={isCartOpen}
      animationType="none"
      onRequestClose={closeCart}
      statusBarTranslucent
    >
      <View style={styles.overlayContainer}>
        <TouchableWithoutFeedback onPress={closeCart}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Drag Handle Bar */}
          <View style={styles.dragHandleWrapper}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={closeCart}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body: Cart Line Items */}
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={54} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>
                Add delicious snacks and beverages to your order!
              </Text>
            </View>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={(ci) => ci.item.itemId}
              renderItem={({ item: ci }) => (
                <CartLineItem
                  item={ci.item}
                  quantity={ci.quantity}
                  onIncrement={() => increment(ci.item.itemId)}
                  onDecrement={() => decrement(ci.item.itemId)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              style={styles.list}
            />
          )}

          {/* Bottom Total Summary Strip & Proceed Button */}
          {cartItems.length > 0 && (
            <View style={styles.totalBarContainer}>
              <View style={styles.totalBarStrip}>
                <View style={styles.totalLeft}>
                  <Ionicons name="cart" size={18} color="#D32F2F" />
                  <Text style={styles.totalCountText}>
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </Text>
                  <Ionicons name="caret-down" size={12} color="#111111" />
                </View>

                <View style={styles.totalRight}>
                  <Text style={styles.totalAmountText}>
                    ₹{totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Proceed CTA */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  closeCart();
                }}
                style={styles.cartProceedButton}
              >
                <Text style={styles.cartProceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetContainer: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.82,
    minHeight: SCREEN_HEIGHT * 0.45,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    shadowColor: THEME.colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 20,
  },
  dragHandleWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D6D6CF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  totalBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: THEME.colors.surface,
  },
  totalBarStrip: {
    backgroundColor: THEME.colors.cartBarBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalCountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  cartProceedButton: {
    backgroundColor: THEME.colors.primaryAccent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cartProceedButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
});
