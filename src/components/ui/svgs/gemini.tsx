import type { SVGProps } from 'react';

export function Gemini(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <circle cx="24" cy="24" r="22" fill="#7c3aed" />
      <path d="M17 20h14M17 24h14M17 28h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
