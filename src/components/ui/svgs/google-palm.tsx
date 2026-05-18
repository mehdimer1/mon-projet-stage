import type { SVGProps } from 'react';

export function GooglePaLM(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <circle cx="24" cy="24" r="22" fill="#0f766e" />
      <path d="M18 18h12v12H18z" fill="#fff" opacity="0.9" />
      <circle cx="24" cy="30" r="3" fill="#0f766e" />
    </svg>
  );
}
