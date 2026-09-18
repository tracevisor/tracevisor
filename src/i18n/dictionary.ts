import { en } from "./locales/en";

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };

export type Dictionary = DeepString<typeof en>;

export const locales = ["en", "es", "fr", "pt", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  de: "Deutsch",
};

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  es: async () => (await import("./locales/es")).es,
  fr: async () => (await import("./locales/fr")).fr,
  pt: async () => (await import("./locales/pt")).pt,
  de: async () => (await import("./locales/de")).de,
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

export async function dictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/(en|es|fr|pt|de)(?=\/|$)/, "");
  return `/${locale}${clean.startsWith("/") ? clean : `/${clean}`}`.replace(/\/+$/, "") || `/${locale}`;
}

export function preferredLocale(request: Request): Locale {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [code, q] = part.trim().split(";q=");
      return { code: code.trim().split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((entry) => isLocale(entry.code));
  return match ? (match.code as Locale) : defaultLocale;
}

export function redirectToLocale(path: string, request: Request): Response {
  return new Response(null, { status: 302, headers: { Location: `/${preferredLocale(request)}${path}` } });
}
