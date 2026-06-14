export type Locale = "sv" | "en" | "ar";

export const CARD_TARGET_POINTS = 12;
export const EXTERIOR_WASH_POINTS = 1;
export const FULL_SERVICE_POINTS = 2;

export const locales: { code: Locale; label: string }[] = [
  { code: "sv", label: "SV" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export const defaultLocale: Locale = "sv";

export const BILCLEANIKEN_LOGO_URL = "/branding/bilcleaniken-car-mark.png";

/** Official rectangular badge (navy + border + car mark) for loyalty UI. */
export const BILCLEANIKEN_BADGE_URL = "/branding/bilcleaniken-logo-badge.png";

export const loyaltyTranslations = {
  sv: {
    brandName: "Bilcleaniken",
    tagline: "Biltvätt i Malmö",
    greeting: "Hej, {name}!",
    greetingFallback: "Välkommen!",
    stampCard: "Stämpelkort",
    stampsLabel: "Stämplar",
    collectStamps: "Samla 12 stämplar för belöning",
    cardGoal: "12 stämplar för att fylla kortet",
    cardComplete: "Kortet är klart — belöning upplåst!",
    rewardUnlocked: "Grattis! Du har låst upp din belöning.",
    yourPoints: "Dina poäng",
    pointsUnit: "poäng",
    totalPoints: "Totalt",
    exteriorWash: "Utvändig tvätt: 1 stämpel",
    fullService: "Fullservice: 2 stämplar",
    customerNotFound: "Kunden hittades inte",
    customerNotFoundHint:
      "Vi kunde tyvärr inte hitta något lojalitetskonto kopplat till detta nummer. Kontakta oss gärna vid frågor.",
    loading: "Laddar…",
    phoneLabel: "Telefon",
    myQrCode: "Min QR-kod",
    qrHint: "Visa denna kod vid varje besök",
    scanAtArrival: "Skanna vid ankomst",
    customerCode: "Kundkod",
    showQrAtCheckout: "Visa QR-koden i kassan",
    stampAdded: "Ny stämpel!",
    liveSync: "Synkad live",
    rulesTitle: "Så fungerar det",
    viewStampCard: "Visa stämpelkort",
    addToAppleWallet: "Lägg till i Apple Wallet",
    addToGoogleWallet: "Lägg till i Google Wallet",
    walletHint: "Spara kortet i mobilen — stämplar uppdateras automatiskt.",
    walletLoading: "Förbereder kort…",
    walletError: "Kunde inte skapa plånbokskort. Försök igen senare.",
    downloadQr: "Ladda ner",
    qrLinkError: "QR-länken kunde inte skapas. Kontrollera app-URL.",
    qrGenerateError: "QR-koden kunde inte genereras. Försök igen.",
  },
  en: {
    brandName: "Bilcleaniken",
    tagline: "Car wash in Malmö",
    greeting: "Hi, {name}!",
    greetingFallback: "Welcome!",
    stampCard: "Stamp card",
    stampsLabel: "Stamps",
    collectStamps: "Collect 12 stamps to unlock your reward",
    cardGoal: "12 stamps to complete your card",
    cardComplete: "Card complete — reward unlocked!",
    rewardUnlocked: "Congratulations! Your reward is ready.",
    yourPoints: "Your points",
    pointsUnit: "points",
    totalPoints: "Total",
    exteriorWash: "Exterior wash: 1 stamp",
    fullService: "Full service: 2 stamps",
    customerNotFound: "Customer not found",
    customerNotFoundHint:
      "We couldn't find a loyalty account linked to this number. Feel free to contact us if you need help.",
    loading: "Loading…",
    phoneLabel: "Phone",
    myQrCode: "My QR code",
    qrHint: "Show this code at every visit",
    scanAtArrival: "Scan on arrival",
    customerCode: "Customer code",
    showQrAtCheckout: "Show your QR code at checkout",
    stampAdded: "New stamp!",
    liveSync: "Live sync",
    rulesTitle: "How it works",
    viewStampCard: "View stamp card",
    addToAppleWallet: "Add to Apple Wallet",
    addToGoogleWallet: "Add to Google Wallet",
    walletHint: "Save the card to your phone — stamps update automatically.",
    walletLoading: "Preparing pass…",
    walletError: "Could not create wallet pass. Please try again later.",
    downloadQr: "Download",
    qrLinkError: "Could not build QR link. Check the app URL setting.",
    qrGenerateError: "Could not generate QR code. Please try again.",
  },
  ar: {
    brandName: "Bilcleaniken",
    tagline: "غسيل سيارات في مالمو",
    greeting: "مرحباً، {name}!",
    greetingFallback: "أهلاً بك!",
    stampCard: "بطاقة الأختام",
    stampsLabel: "الأختام",
    collectStamps: "اجمع 12 ختمًا لفتح المكافأة",
    cardGoal: "12 ختمًا لإكمال البطاقة",
    cardComplete: "اكتملت البطاقة — المكافأة جاهزة!",
    rewardUnlocked: "مبروك! مكافأتك جاهزة.",
    yourPoints: "نقاطك",
    pointsUnit: "نقطة",
    totalPoints: "المجموع",
    exteriorWash: "غسيل خارجي: ختم واحد",
    fullService: "خدمة كاملة: ختمين",
    customerNotFound: "العميل غير موجود",
    customerNotFoundHint:
      "لم نتمكن من العثور على حساب ولاء مرتبط بهذا الرقم. تواصل معنا إذا احتجت مساعدة.",
    loading: "جاري التحميل…",
    phoneLabel: "الهاتف",
    myQrCode: "رمز QR الخاص بي",
    qrHint: "اعرض هذا الرمز في كل زيارة",
    scanAtArrival: "امسح عند الوصول",
    customerCode: "رمز العميل",
    showQrAtCheckout: "اعرض رمز QR عند الدفع",
    stampAdded: "ختم جديد!",
    liveSync: "مزامنة مباشرة",
    rulesTitle: "كيف يعمل",
    viewStampCard: "عرض بطاقة الأختام",
    addToAppleWallet: "أضف إلى Apple Wallet",
    addToGoogleWallet: "أضف إلى Google Wallet",
    walletHint: "احفظ البطاقة في هاتفك — تتحدث الأختام تلقائياً.",
    walletLoading: "جاري تجهيز البطاقة…",
    walletError: "تعذر إنشاء بطاقة المحفظة. حاول مرة أخرى.",
    downloadQr: "تنزيل",
    qrLinkError: "تعذر إنشاء رابط QR. تحقق من إعداد عنوان التطبيق.",
    qrGenerateError: "تعذر إنشاء رمز QR. حاول مرة أخرى.",
  },
} as const;

export type LoyaltyCopy = (typeof loyaltyTranslations)[Locale];

export function getLoyaltyCopy(locale: Locale): LoyaltyCopy {
  return loyaltyTranslations[locale];
}

export function formatGreeting(
  copy: LoyaltyCopy,
  name?: string | null,
): string {
  if (name?.trim()) {
    return copy.greeting.replace("{name}", name.trim());
  }
  return copy.greetingFallback;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}
