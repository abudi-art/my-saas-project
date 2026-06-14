/** BilCleaniken official brand palette (bilcleaniken.se). */
export const BILCLEANIKEN_COLORS = {
  navy: "#003E7E",
  navyMid: "#003B6F",
  navyDark: "#002A55",
  pageBg: "#F8FAFC",
  textDark: "#1E293B",
  textLight: "#FFFFFF",
  radius: "1rem",
  radiusLg: "1.25rem",
} as const;

export const BILCLEANIKEN_GRADIENT = `linear-gradient(135deg, ${BILCLEANIKEN_COLORS.navy} 0%, ${BILCLEANIKEN_COLORS.navyMid} 52%, ${BILCLEANIKEN_COLORS.navyDark} 100%)` as const;
