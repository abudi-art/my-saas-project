type PasskitCertificates = {
  wwdr: string;
  signerCert: string;
  signerKey: string;
  signerKeyPassphrase?: string;
};

export function getPasskitCertificates(): PasskitCertificates | null {
  const wwdr = process.env.PASSKIT_WWDR_CERT_PEM;
  const signerCert = process.env.PASSKIT_SIGNER_CERT_PEM;
  const signerKey = process.env.PASSKIT_SIGNER_KEY_PEM;
  const signerKeyPassphrase = process.env.PASSKIT_SIGNER_KEY_PASSPHRASE;

  if (!wwdr || !signerCert || !signerKey) {
    return null;
  }

  return {
    wwdr,
    signerCert,
    signerKey,
    signerKeyPassphrase,
  };
}

export function getPasskitIdentifiers() {
  return {
    passTypeIdentifier: process.env.PASSKIT_PASS_TYPE_IDENTIFIER,
    teamIdentifier: process.env.PASSKIT_TEAM_IDENTIFIER,
  };
}

export function isPasskitConfigured(): boolean {
  const certs = getPasskitCertificates();
  const { passTypeIdentifier, teamIdentifier } = getPasskitIdentifiers();
  return Boolean(certs && passTypeIdentifier && teamIdentifier);
}
