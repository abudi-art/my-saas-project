"use client";

import { CARD_TARGET_POINTS } from "@/lib/i18n/loyalty";
import type { LoyaltyCopy } from "@/lib/i18n/loyalty";
import { getStampsOnCard, isCardComplete } from "@/lib/loyalty/stamps";

type StampGridProps = {
  points: number;
  copy: LoyaltyCopy;
  animatingIndex?: number | null;
};

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m16 0H4m16 0-2-9a2 2 0 0 0-2-2h-1.5a2 2 0 0 0-1.5 1.5V3m0 0H9m3 9h6M9 3v1.5M9 3H6.5A2.5 2.5 0 0 0 4 5.5"
      />
    </svg>
  );
}

export function StampGrid({ points, copy, animatingIndex }: StampGridProps) {
  const filled = getStampsOnCard(points);
  const complete = isCardComplete(points);

  return (
    <div className="loyalty-stamp-card relative overflow-hidden rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,74,128,0.15)]">
      <div className="loyalty-card-notch" aria-hidden />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            {copy.stampCard}
          </p>
          {complete && (
            <span className="stamp-badge-complete mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {copy.cardComplete}
            </span>
          )}
        </div>
        <div className="text-end">
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            {copy.stampsLabel}
          </p>
          <p className="text-2xl font-bold tabular-nums text-white">
            {filled}/{CARD_TARGET_POINTS}
          </p>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-xs text-white/70">
        {complete ? copy.rewardUnlocked : copy.collectStamps}
      </p>

      <div
        className="relative z-10 mt-5 grid grid-cols-6 gap-2.5"
        role="list"
        aria-label={copy.stampsLabel}
      >
        {Array.from({ length: CARD_TARGET_POINTS }, (_, index) => {
          const isFilled = index < filled;
          const isRewardSlot = index === CARD_TARGET_POINTS - 1;
          const isAnimating = animatingIndex === index;

          return (
            <div
              key={index}
              role="listitem"
              aria-label={`${index + 1}`}
              className={`stamp-slot flex aspect-square items-center justify-center rounded-full border-2 transition-colors ${
                isFilled
                  ? isRewardSlot
                    ? "stamp-slot-reward border-emerald-400 bg-emerald-500 text-white"
                    : "stamp-slot-filled border-slate-600 bg-slate-700 text-white"
                  : "stamp-slot-empty border-slate-700 bg-slate-800/60 text-slate-600"
              } ${isAnimating ? "stamp-pop" : ""}`}
            >
              {isFilled ? (
                isRewardSlot ? (
                  <GiftIcon />
                ) : (
                  <CheckIcon />
                )
              ) : isRewardSlot ? (
                <GiftIcon />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
