# Premium F&B Ordering App (React Native - Expo)

A client-ready cinema Food & Beverage (F&B) ordering mobile application built with React Native (Expo SDK 57), following clean architecture principles, strict modular component organization, and single shared quantity state management.

---

## 🚀 How to Run the Project

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
- Press **`a`** to launch on Android emulator.
- Press **`w`** to open in web browser.
- Or scan the QR code using the **Expo Go** app on your physical device.

### 3. Generate Release APK via EAS
To build a standalone production release APK for Android devices:

1. Install EAS CLI (if not already installed):
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure and trigger the build:
   ```bash
   eas build -p android --profile preview
   ```
   *(Or `eas build -p android --profile production` for a Google Play Store AAB/APK)*.

---

## 🏛️ Architecture & Key Design Decisions

### 1. Single Shared Quantity Store (`zustand`)
- **Location:** [`/src/features/cart/cartStore.js`](./src/features/cart/cartStore.js)
- **Design Pattern:** All food lists across the app (Home Popular Carousel, Home Repeat Carousel, Listing Repeat Carousel, Listing Main Food List, and the Cart Bottom Sheet) read from and write to **one shared quantity dictionary** keyed strictly by `itemId`:
  ```js
  quantities: { [itemId: string]: number }
  ```
- **Instant Synchronization:** When an item's quantity is changed in *any* of the screens or modals, the Zustand store atomically updates `quantities[itemId]`. Because all card components and line items subscribe directly to this store via selectors, changes reflect **instantly across all 4 touchpoints without prop-drilling or component re-mounting**.

### 2. Sticky Filter Behavior
- **Location:** [`/src/screens/ListingScreen.js`](./src/screens/ListingScreen.js)
- Pinned directly below the fixed `Toolbar` using React Native's native `stickyHeaderIndices={[1]}`.
- As the user scrolls vertically past the Repeat Carousel (Section 0), the Filter Row (Section 1) seamlessly sticks to the top directly under the Toolbar, while the Main Food List (Section 2) scrolls smoothly underneath.

### 3. Combinable Filter Logic
- **Location:** [`/src/utils/filterUtils.js`](./src/utils/filterUtils.js)
- Pure functional filtering that supports combining any set of categories (`SNACKS`, `POPCORN`, `COMBOS`, `COLD BEVERAGES`, `HOT BEVERAGES`) with dietary filters (`Veg`, `Non Veg`, or all).
- Tested combinations:
  - Veg only / Non-Veg only
  - Single category (e.g. `POPCORN`)
  - Multiple categories (e.g. `SNACKS + COMBOS`)
  - Dietary + Category combinations (e.g. `Veg + POPCORN`)

### 4. Separation of Concerns (Dumb Components)
- All business logic, JSON parsing, image fallbacks, and price normalization live exclusively in [`/src/services/foodService.js`](./src/services/foodService.js) and [`/src/utils/filterUtils.js`](./src/utils/filterUtils.js).
- Components in [`/src/components`](./src/components) (`FoodItemCard`, `RepeatItemCard`, `CategoryTile`, `FilterChip`, `Toolbar`, `QuantityStepper`, `CartLineItem`) are purely presentational and receive data via props.

### 5. Cart Bottom Sheet
- **Location:** [`/src/features/cart/CartBottomSheet.js`](./src/features/cart/CartBottomSheet.js)
- Opens via the Toolbar cart icon on both `HomeScreen` and `ListingScreen`.
- Shows every item where `quantity > 0` with item thumbnail, dietary indicator, unit price, and steppers.
- Concludes strictly with the total item count and order amount summary strip in `#FCF1D0`, avoiding unnecessary dummy checkout/payment CTA flows as specified.

---

## 🎨 Design System & Color Palette

Sampled directly from the cinema ordering video reference:
- **Background:** Crisp off-white `#F8F8F6`
- **Surface / Cards:** Pure white `#FFFFFF` with `#E8E8E2` borders
- **Primary Accent:** `#FFC100` (Cinema Gold)
- **CTA Accent:** `#FBC900`
- **Cart Summary Strip:** `#FCF1D0`
- **Dietary Indicators:** Official FSSAI Veg (Green `#2E7D32`) & Non-Veg (Red `#C62828`)
- **Typography:** Bold modern sans-serif with deep charcoal `#1C1C1E`

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

## 📋 Assumptions Made

1. **Category Mapping:** The 5 categories specified in the brief (`SNACKS`, `POPCORN`, `COMBOS`, `COLD BEVERAGES`, `HOT BEVERAGES`) cover all cinema F&B items.
2. **Item Flags Distribution:** As approved in the plan, 6 items are marked as popular and 4 items as repeat to provide rich, testable carousels.
3. **Cart Dismissal:** Users can dismiss the cart bottom sheet by tapping the backdrop or the close button; quantities persist across screens.
