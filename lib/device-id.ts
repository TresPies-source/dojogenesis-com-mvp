const DEVICE_ID_KEY = 'dojo_device_id';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const existingId = localStorage.getItem(DEVICE_ID_KEY);
    
    if (existingId) {
      return existingId;
    }

    const newId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (error) {
    console.error('Failed to get/create device ID:', error);
    return crypto.randomUUID();
  }
}
