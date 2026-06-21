export const WISHLIST_KEY = 'wishlist_v1';

export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY) || '[]';
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function isInWishlist(productId) {
  const list = getWishlist();
  return list.includes(productId);
}

export function addToWishlist(productId) {
  const list = getWishlist();
  if (!list.includes(productId)) {
    list.push(productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    try { window.dispatchEvent(new Event('wishlist-updated')); } catch (e) {}
  }
  return list;
}

export function removeFromWishlist(productId) {
  let list = getWishlist();
  list = list.filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  try { window.dispatchEvent(new Event('wishlist-updated')); } catch (e) {}
  return list;
}

export function toggleWishlist(productId) {
  if (isInWishlist(productId)) {
    return removeFromWishlist(productId);
  }
  return addToWishlist(productId);
}
