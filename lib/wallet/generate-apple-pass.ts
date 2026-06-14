import { PKPass } from "passkit-generator";
import sharp from "sharp";
import {
  BILCLEANIKEN_LOGO_OPAQUE_URL,
  CARD_TARGET_POINTS,
} from "@/lib/i18n/loyalty";
import {
  getPasskitCertificates,
  getPasskitIdentifiers,
} from "@/lib/wallet/passkit-certificates";

type GenerateApplePassInput = {
  phone: string;
  points: number;
  customerName?: string | null;
};

async function loadPassImages() {
  const response = await fetch(BILCLEANIKEN_LOGO_OPAQUE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Bilcleaniken logo for pass assets");
  }

  const svgBuffer = Buffer.from(await response.arrayBuffer());

  const [icon, icon2x, logo] = await Promise.all([
    sharp(svgBuffer).resize(58, 58, { fit: "contain", background: "#1e40af" }).png().toBuffer(),
    sharp(svgBuffer).resize(87, 87, { fit: "contain", background: "#1e40af" }).png().toBuffer(),
    sharp(svgBuffer).resize(160, 50, { fit: "contain", background: "#1e40af" }).png().toBuffer(),
  ]);

  return {
    "icon.png": icon,
    "icon@2x.png": icon2x,
    "logo.png": logo,
  };
}

export async function generateApplePassBuffer(
  input: GenerateApplePassInput,
): Promise<Buffer> {
  const certificates = getPasskitCertificates();
  const { passTypeIdentifier, teamIdentifier } = getPasskitIdentifiers();

  if (!certificates || !passTypeIdentifier || !teamIdentifier) {
    throw new Error("PassKit certificates or identifiers are not configured");
  }

  const images = await loadPassImages();
  const displayName = input.customerName?.trim() || input.phone;
  const progressLabel = `${input.points}/${CARD_TARGET_POINTS}`;

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier,
    teamIdentifier,
    organizationName: "Bilcleaniken",
    description: "Bilcleaniken lojalitetskort",
    logoText: "Bilcleaniken",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(29, 78, 216)",
    labelColor: "rgb(191, 219, 254)",
    storeCard: {
      headerFields: [
        {
          key: "points",
          label: "POÄNG",
          value: String(input.points),
        },
      ],
      primaryFields: [
        {
          key: "customer",
          label: "KUND",
          value: displayName,
        },
      ],
      auxiliaryFields: [
        {
          key: "goal",
          label: "MÅL",
          value: progressLabel,
        },
      ],
      backFields: [
        {
          key: "phone",
          label: "TELEFON",
          value: input.phone,
        },
        {
          key: "reward",
          label: "BELÖNING",
          value: `${CARD_TARGET_POINTS} poäng ger belöning`,
        },
        {
          key: "ext",
          label: "UTVÄNDIG TVÄTT",
          value: "1 poäng",
        },
        {
          key: "full",
          label: "FULLSERVICE",
          value: "2 poäng",
        },
      ],
    },
  };

  const pass = new PKPass(
    {
      ...images,
      "pass.json": Buffer.from(JSON.stringify(passJson)),
    },
    certificates,
    {
      serialNumber: `bilcleaniken-${input.phone}`,
      description: "Bilcleaniken lojalitetskort",
      ...(process.env.NEXT_PUBLIC_APP_URL
        ? {
            webServiceURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/wallet/apple`,
            authenticationToken:
              process.env.PASSKIT_WEB_SERVICE_AUTH_TOKEN ?? "change-me",
          }
        : {}),
    },
  );

  pass.setBarcodes({
    message: input.phone,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1",
  });

  return pass.getAsBuffer();
}
