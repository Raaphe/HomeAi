import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? null;
  } catch {
    // Handle potential errors
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to store.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and parses it as JSON.
 *
 * @param key The key to fetch.
 */
export async function load<T>(key: string): Promise<T | null> {
  try {
    const value = await loadString(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage as JSON.
 *
 * @param key The key to store.
 * @param value The value to store.
 */
export async function save(key: string, value: unknown): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    return await saveString(key, jsonValue);
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to remove.
 */
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Handle potential errors
  }
}

/**
 * Clears all data from storage.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {
    // Handle potential errors
  }
}