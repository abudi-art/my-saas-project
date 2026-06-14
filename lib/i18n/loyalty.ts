export type Locale = "sv" | "en" | "da";

export const CARD_TARGET_POINTS = 12;
export const EXTERIOR_WASH_POINTS = 1;
export const FULL_SERVICE_POINTS = 2;

export const locales: { code: Locale; label: string }[] = [
  { code: "sv", label: "SV" },
  { code: "en", label: "EN" },
  { code: "da", label: "DA" },
];

export const defaultLocale: Locale = "sv";

export const BILCLEANIKEN_LOGO_URL =
  "https://www.bilcleaniken.se/wp-content/uploads/2020/11/logo.svg";

export const loyaltyTranslations = {
  sv: {
    brandName: "Bilcleaniken",
    tagline: "Biltvätt i Malmö",
    yourPoints: "Dina poäng",
    pointsUnit: "poäng",
    cardGoal: "12 poäng för att fylla kortet",
    cardComplete: "Kortet är klart — dags för belöning!",
    exteriorWash: "Utvändig tvätt: 1 poäng",
    fullService: "Fullservice: 2 poäng",
    customerNotFound: "Kunden hittades inte",
    customerNotFoundHint:
      "Vi kunde tyvärr inte hitta något lojalitetskonto kopplat till detta nummer. Kontakta oss gärna vid frågor.",
    loading: "Laddar…",
    phoneLabel: "Telefon",
    addToAppleWallet: "Lägg till i Apple Wallet",
    addToGoogleWallet: "Lägg till i Google Wallet",
    walletHint: "Spara kortet i mobilen — poängen uppdateras automatiskt.",
    walletLoading: "Förbereder kort…",
    walletError: "Kunde inte skapa plånbokskort. Försök igen senare.",
  },
  en: {
    brandName: "Bilcleaniken",
    tagline: "Car wash in Malmö",
    yourPoints: "Your points",
    pointsUnit: "points",
    cardGoal: "12 points to complete your card",
    cardComplete: "Card complete — reward unlocked!",
    exteriorWash: "Exterior Wash: 1 point",
    fullService: "Full Service: 2 points",
    customerNotFound: "Customer not found",
    customerNotFoundHint:
      "We couldn't find a loyalty account linked to this number. Feel free to contact us if you need help.",
    loading: "Loading…",
    phoneLabel: "Phone",
    addToAppleWallet: "Add to Apple Wallet",
    addToGoogleWallet: "Add to Google Wallet",
    walletHint: "Save the card to your phone — points update automatically.",
    walletLoading: "Preparing pass…",
    walletError: "Could not create wallet pass. Please try again later.",
  },
  da: {
    brandName: "Bilcleaniken",
    tagline: "Bilvask i Malmø",
    yourPoints: "Dine point",
    pointsUnit: "point",
    cardGoal: "12 point for at udfylde kortet",
    cardComplete: "Kortet er fuldt — belønning klar!",
    exteriorWash: "Udvendig vask: 1 point",
    fullService: "Fuld service: 2 point",
    customerNotFound: "Kunden blev ikke fundet",
    customerNotFoundHint:
      "Vi kunne desværre ikke finde en loyalitetskonto til dette nummer. Kontakt os gerne, hvis du har brug for hjælp.",
    loading: "Indlæser…",
    phoneLabel: "Telefon",
    addToAppleWallet: "Tilføj til Apple Wallet",
    addToGoogleWallet: "Tilføj til Google Wallet",
    walletHint: "Gem kortet på telefonen — point opdateres automatisk.",
    walletLoading: "Forbereder kort…",
    walletError: "Kunne ikke oprette tegnebogskort. Prøv igen senere.",
  },
} as const;

export type LoyaltyCopy = (typeof loyaltyTranslations)[Locale];

export function getLoyaltyCopy(locale: Locale): LoyaltyCopy {
  return loyaltyTranslations[locale];
}
