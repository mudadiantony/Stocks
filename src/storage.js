import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEMS_KEY = 'stockroom-items';
const LOGS_KEY = 'stockroom-logs';

export async function loadItems() {
  try {
    const raw = await AsyncStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveItems(items) {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    return false;
  }
}

export async function loadLogs() {
  try {
    const raw = await AsyncStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveLogs(logs) {
  try {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return true;
  } catch (e) {
    return false;
  }
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
