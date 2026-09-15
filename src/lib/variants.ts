/** PROTOTYPE ONLY — REMOVE ME with `components/prototype-variant-bar.tsx`. */

export const HOME_VARIANTS = ['hero', 'magazine', 'card'] as const;

export type HomeVariant = (typeof HOME_VARIANTS)[number];

export function parseVariant(value: unknown): HomeVariant {
  return HOME_VARIANTS.includes(value as HomeVariant)
    ? (value as HomeVariant)
    : 'hero';
}
