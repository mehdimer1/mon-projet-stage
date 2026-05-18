import { tv, type VariantProps } from 'tailwind-variants';
import React, { type ElementType } from 'react';

// ---------------------------------------------------------------------------
// 1. Variant definition — single source of truth for every typography style
// ---------------------------------------------------------------------------

const typography = tv({
  base: '',
  variants: {
    variant: {
      h1: 'scroll-m-20 text-foreground text-4xl font-semibold tracking-tight leading-[1.1] text-balance hyphens-none lg:text-5xl',
      h2: 'scroll-m-20 text-foreground text-3xl font-semibold tracking-tight leading-[1.15] text-balance hyphens-none lg:text-4xl',
      h3: 'scroll-m-20 text-foreground text-2xl font-medium leading-snug text-balance hyphens-none lg:text-3xl',
      h4: 'scroll-m-20 text-foreground text-lg font-medium leading-snug text-balance hyphens-none',
      lead: 'text-foreground/75 text-lg leading-[1.45] text-pretty',
      p: 'text-foreground/80 leading-[1.45] text-pretty',
      large: 'text-foreground/80 text-lg font-medium leading-snug',
      small: 'text-foreground/80 text-sm font-medium leading-normal',
      muted: 'text-muted text-sm leading-normal',
      code: 'bg-default text-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
      quote:
        'border-accent text-foreground/85 mt-6 border-l-2 pl-8 italic leading-[1.45] text-pretty',
      price: 'text-foreground text-lg font-semibold tracking-tight tabular-nums',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

// Default HTML element for each variant
const defaultElements: Record<NonNullable<TypographyVariants['variant']>, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  p: 'p',
  large: 'div',
  small: 'small',
  muted: 'span',
  code: 'code',
  quote: 'blockquote',
  price: 'span',
};

// ---------------------------------------------------------------------------
// 2. Types
// ---------------------------------------------------------------------------

type TypographyVariants = VariantProps<typeof typography>;

type TypographyProps<T extends ElementType = 'p'> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & TypographyVariants &
  Omit<React.ComponentPropsWithoutRef<T>, 'className' | 'children'>;

// ---------------------------------------------------------------------------
// 3. Core polymorphic component
// ---------------------------------------------------------------------------

function TypographyRoot<T extends ElementType = 'p'>({
  as,
  variant = 'p',
  className,
  children,
  ...props
}: TypographyProps<T>) {
  const Component = as || defaultElements[variant!] || 'p';

  return (
    <Component className={typography({ variant, className })} {...props}>
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// 4. Explicit variant components (composition > boolean props)
//    Each is a thin wrapper that locks the variant and default element.
// ---------------------------------------------------------------------------

function H1<T extends ElementType = 'h1'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="h1" {...(props as TypographyProps)} />;
}

function H2<T extends ElementType = 'h2'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="h2" {...(props as TypographyProps)} />;
}

function H3<T extends ElementType = 'h3'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="h3" {...(props as TypographyProps)} />;
}

function H4<T extends ElementType = 'h4'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="h4" {...(props as TypographyProps)} />;
}

function Lead<T extends ElementType = 'p'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="lead" {...(props as TypographyProps)} />;
}

function P<T extends ElementType = 'p'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="p" {...(props as TypographyProps)} />;
}

function Large<T extends ElementType = 'div'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="large" {...(props as TypographyProps)} />;
}

function Small<T extends ElementType = 'small'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="small" {...(props as TypographyProps)} />;
}

function Muted<T extends ElementType = 'span'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="muted" {...(props as TypographyProps)} />;
}

function InlineCode<T extends ElementType = 'code'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="code" {...(props as TypographyProps)} />;
}

function Quote<T extends ElementType = 'blockquote'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="quote" {...(props as TypographyProps)} />;
}

function Price<T extends ElementType = 'span'>(props: Omit<TypographyProps<T>, 'variant'>) {
  return <TypographyRoot variant="price" {...(props as TypographyProps)} />;
}

// ---------------------------------------------------------------------------
// 5. Compound component export — Typography.H1, Typography.Lead, etc.
// ---------------------------------------------------------------------------

export const Typography = Object.assign(TypographyRoot, {
  H1,
  H2,
  H3,
  H4,
  Lead,
  P,
  Large,
  Small,
  Muted,
  InlineCode,
  Quote,
  Price,
});

// Named exports for direct imports
export { H1, H2, H3, H4, Lead, P, Large, Small, Muted, InlineCode, Quote, Price };

// Export the tv recipe for advanced use (e.g., extending in other components)
export { typography };
