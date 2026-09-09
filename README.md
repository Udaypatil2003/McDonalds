# Premium F&B Ordering App (React Native - Expo)

A client-ready cinema Food & Beverage (F&B) ordering mobile application built with React Native (Expo SDK 57), following clean architecture principles, strict modular component organization, and single shared quantity state management.

---

## How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go on an iOS/Android device or an Android Emulator

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
# or
npx expo start
```

## Notes & Assumptions
- No payment/checkout flow — not part of the provided assignment spec or JSON schema.
- A few additional items were flagged as `isPopuplarItem`/`isRepeat` in `fnb.json` to populate the Home carousels, since the original file had very few marked.


## Architecture & Key Design Decisions

### 1. Single Shared Cart Store (Zustand)
`/src/features/cart/cartStore.js` holds one object: `quantities: { [itemId]: number }`.
Every list and the Cart (Home carousels, Listing's Repeat List, Listing's Main List, Cart Bottom Sheet) reads and updates this same store by `itemId`. That's why changing a quantity anywhere updates it everywhere else instantly — there's only one source of truth, not four separate copies to keep in sync.

### 2. Sticky Filter
`/src/screens/ListingScreen.js` uses `stickyHeaderIndices` so the Filter Row pins directly below the Toolbar once the user scrolls past the Repeat List, while the Main List keeps scrolling underneath.

### 3. Combinable Filters
`/src/utils/filterUtils.js` is a pure function that filters by category + food type together (e.g. Veg + Popcorn, or Non-Veg + Snacks). Tested with single filters, multiple categories, and category + diet combos.

### 4. Clean Separation
- Data loading/normalization → `/src/services/foodService.js`
- Filter logic → `/src/utils/filterUtils.js`
- Components (`FoodItemCard`, `RepeatItemCard`, `Toolbar`, etc.) → purely presentational, no logic, just props in / UI out.

### 5. Cart Bottom Sheet
`/src/features/cart/CartBottomSheet.js` opens from the Toolbar on both screens, shows items with `quantity > 0`, and ends at the total summary — no checkout/payment button, since none was in the assignment spec.
---



## 📂 Exact Folder Structure

```
/src
  /assets
    fnb.json
  /components
    CartLineItem.js
    CategoryTile.js
    FilterChip.js
    FoodItemCard.js
    QuantityStepper.js
    RepeatItemCard.js
    Toolbar.js
  /constants
    categories.js
    theme.js
  /features/cart
    CartBottomSheet.js
    cartStore.js
  /navigation
    AppNavigator.js
  /screens
    HomeScreen.js
    ListingScreen.js
  /services
    foodService.js
  /utils
    filterUtils.js
App.js
```

---
