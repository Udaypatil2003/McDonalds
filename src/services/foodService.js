import rawData from '../assets/fnb.json';

class FoodService {
  constructor() {
    this.items = (rawData.listOfFnbItems || []).map((item) => ({
      ...item,
      // Normalize rate / price
      effectivePrice: item.itemOfferRate || item.itemRate || 0,
      // Standardize foodType capitalization
      foodType: (item.foodType || 'Veg').trim().toLowerCase() === 'non veg' ? 'Non Veg' : 'Veg',
    }));

    this.itemsMap = new Map();
    this.items.forEach((item) => {
      this.itemsMap.set(item.itemId, item);
    });
  }

  getAllItems() {
    return this.items;
  }

  getItemsMap() {
    return this.itemsMap;
  }

  getItemById(itemId) {
    return this.itemsMap.get(itemId) || null;
  }

  getPopularItems() {
    return this.items.filter((item) => Boolean(item.isPopuplarItem));
  }

  getRepeatItems() {
    return this.items.filter((item) => Boolean(item.isRepeat));
  }
}

export const foodService = new FoodService();
export default foodService;
