import {useRouterState} from '@tanstack/react-router';

import {HOME_VARIANTS, type HomeVariant} from '../lib/variants';

/**
 * PROTOTYPE variant switcher — REMOVE ME before this template ships.
 *
 * Wayfinder ticket 09 asks for several radically different home layouts that a
 * reviewer can flip between, so the home route reads `?v=hero|magazine|card`
 * and this fixed bar links to each. NONE of this belongs in the template a
 * community owner gets: delete this file, `src/lib/variants.ts`, the
 * `validateSearch` on the home route and the two non-chosen layouts once Sakib
 * picks one.
 *
 * Plain anchors, not `<Link>`: the bar is throwaway and must not need the
 * router's typed search schema.
 */
export function PrototypeVariantBar() {
  const searchStr = useRouterState({select: state => state.location.searchStr});
  const pathname = useRouterState({select: state => state.location.pathname});
  const active = new URLSearchParams(searchStr).get('v') ?? 'hero';

  const hrefFor = (variant: HomeVariant) => {
    // Keep whatever else is in the URL; only `v` is ours.
    const params = new URLSearchParams(searchStr);
    params.set('v', variant);
    return `/?${params.toString()}`;
  };

  return (
    <div className="proto-bar" role="navigation" aria-label="Prototype variants">
      <span className="proto-bar-label">PROTOTYPE</span>
      {HOME_VARIANTS.map(variant => (
        <a
          key={variant}
          href={hrefFor(variant)}
          className={
            pathname === '/' && active === variant
              ? 'proto-bar-link is-active'
              : 'proto-bar-link'
          }>
          {variant}
        </a>
      ))}
    </div>
  );
}
