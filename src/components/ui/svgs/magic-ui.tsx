import type { SVGProps } from 'react';

export function MagicUI(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <rect x="6" y="6" width="36" height="36" rx="10" fill="#0ea5e9" />
      <path d="M24 12l4 10h10l-8 6 4 10-8-6-8 6 4-10-8-6h10l4-10Z" fill="#fff" />
    </svg>
  );
}
