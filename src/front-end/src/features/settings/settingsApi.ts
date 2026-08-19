import { baseApi } from "@/redux/api/baseApi";

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

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppearanceSettings: builder.query<AppearanceSettings, void>({
      queryFn: () => ({
        data: {
          appearance: "system",
          autoPlay: false,
        },
      }),
      providesTags: [{ type: "User", id: "SETTINGS-APPEARANCE" }],
    }),
    getNotificationSettings: builder.query<NotificationSettings, void>({
      queryFn: () => ({
        data: {
          notifications: false,
          emailNotif: false,
          smsNotif: false,
        },
      }),
      providesTags: [{ type: "User", id: "SETTINGS-NOTIFICATIONS" }],
    }),
    getAdvancedSettings: builder.query<AdvancedSettings, void>({
      queryFn: () => ({
        data: {
          language: "vi",
          itemsPerPage: 10,
        },
      }),
      providesTags: [{ type: "User", id: "SETTINGS-ADVANCED" }],
    }),
  }),
});

export const {
  useGetAdvancedSettingsQuery,
  useGetAppearanceSettingsQuery,
  useGetNotificationSettingsQuery,
} = settingsApi;
