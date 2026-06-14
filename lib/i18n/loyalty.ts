export type Locale = "sv" | "en" | "da";

export const locales: { code: Locale; label: string }[] = [
  { code: "sv", label: "SV" },
  { code: "en", label: "EN" },
  { code: "da", label: "DA" },
];

export const defaultLocale: Locale = "sv";

export const loyaltyTranslations = {
  sv: {
    brandName: "SparkleWash",
    tagline: "Premium biltvätt",
    yourPoints: "Dina poäng",
    pointsUnit: "poäng",
    exteriorWash: "Utvändig tvätt: 12 poäng",
    fullService: "Fullservice: 2 poäng",
    customerNotFound: "Kunden hittades inte",
    customerNotFoundHint:
      "Vi kunde tyvärr inte hitta något lojalitetskonto kopplat till detta nummer. Kontakta oss gärna vid frågor.",
    loading: "Laddar…",
    phoneLabel: "Telefon",
  },
  en: {
    brandName: "SparkleWash",
    tagline: "Premium car wash",
    yourPoints: "Your points",
    pointsUnit: "points",
    exteriorWash: "Exterior Wash: 12 points",
    fullService: "Full Service: 2 points",
    customerNotFound: "Customer not found",
    customerNotFoundHint:
      "We couldn't find a loyalty account linked to this number. Feel free to contact us if you need help.",
    loading: "Loading…",
    phoneLabel: "Phone",
  },
  da: {
    brandName: "SparkleWash",
    tagline: "Premium bilvask",
    yourPoints: "Dine point",
    pointsUnit: "point",
    exteriorWash: "Udvendig vask: 12 point",
    fullService: "Fuld service: 2 point",
    customerNotFound: "Kunden blev ikke fundet",
    customerNotFoundHint:
      "Vi kunne desværre ikke finde en loyalitetskonto til dette nummer. Kontakt os gerne, hvis du har brug for hjælp.",
    loading: "Indlæser…",
    phoneLabel: "Telefon",
  },
} as const;

export type LoyaltyCopy = (typeof loyaltyTranslations)[Locale];

export function getLoyaltyCopy(locale: Locale): LoyaltyCopy {
  return loyaltyTranslations[locale];
}
