"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultLocale,
  LOCALE_STORAGE_KEY,
  locales,
  messages,
  type Locale,
} from "./messages";

type TranslationValues = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return !!value && locales.includes(value as Locale);
}

function getMessage(locale: Locale, key: string) {
  const parts = key.split(".");
  let current: unknown = messages[locale];

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, values?: TranslationValues) {
  if (!values) return template;

  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(storedLocale)) {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
      return;
    }

    document.documentElement.lang = defaultLocale;
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t(key, values) {
        const message =
          getMessage(locale, key) ?? getMessage(defaultLocale, key) ?? key;

        return interpolate(message, values);
      },
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
