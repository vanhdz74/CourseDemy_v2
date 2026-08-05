export interface AppearanceSettings {
  appearance: string;
  autoPlay: boolean;
}

export interface NotificationSettings {
  notifications: boolean;
  emailNotif: boolean;
  smsNotif: boolean;
}

export interface AdvancedSettings {
  language: string;
  itemsPerPage: number;
}

async function getLocalSetting<T>(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  return res.json() as Promise<T>;
}

export function getAppearanceSettings() {
  return getLocalSetting<AppearanceSettings>("/api/settings/appearance");
}

export function getNotificationSettings() {
  return getLocalSetting<NotificationSettings>("/api/settings/notifications");
}

export function getAdvancedSettings() {
  return getLocalSetting<AdvancedSettings>("/api/settings/advanced");
}
