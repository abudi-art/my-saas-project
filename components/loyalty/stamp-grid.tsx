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

function CarRewardIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

export function StampGrid({ points, copy, animatingIndex }: StampGridProps) {
  const filled = getStampsOnCard(points);
  const complete = isCardComplete(points);

  return (
    <div className="loyalty-stamp-card relative overflow-hidden rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,62,126,0.15)]">
      <div className="loyalty-card-notch" aria-hidden />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            {copy.stampCard}
          </p>
          {complete && (
            <span className="stamp-badge-complete mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
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
                  <CarRewardIcon />
                ) : (
                  <CheckIcon />
                )
              ) : isRewardSlot ? (
                <CarRewardIcon />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
