'use client';

import React, { useState } from 'react';
import { LazyMotion, m, AnimatePresence, domAnimation } from 'framer-motion';
import { Tabs } from '@heroui/react';
import { cn } from '@heroui/styles';
import { Icon } from '@iconify/react';

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeClassName?: string;
}

export interface MorphingDiscoveryBarProps {
  categories: Category[];
  className?: string;
}

const transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
} as const;

const blurTransition = {
  duration: 0.18,
} as const;

export function MorphingDiscoveryBar({ categories, className = '' }: MorphingDiscoveryBarProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const [searchValue, setSearchValue] = useState('');

  const focusOnMount = (node: HTMLInputElement | null) => {
    node?.focus();
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn('flex flex-col items-center justify-start bg-transparent', className)}>
        <div className="flex w-full items-center justify-start">
          {/*
           * Bar: total flex width = icon(2.5rem) + content-slot(17rem) + gap(0.5rem) + close(2.5rem)
           * This never changes → justify-center never shifts → icon stays perfectly fixed.
           */}
          <div className="relative flex items-center rounded-[32px] p-1.5 backdrop-blur-md">
            {/* ── Expanding pill background ──────────────────────────────────
             * Position absolute from left-1.5 (the p-1.5 inset).
             * Animates width only — left edge is locked, right edge grows.
             * No clip, no crop: the border-radius naturally follows the width.
             */}
            <m.div
              initial={{ width: '2.5rem' }}
              animate={{ width: isSearching ? 'calc(2.5rem + 0.5rem + 17rem)' : '2.5rem' }}
              transition={transition}
              className="border-border bg-surface absolute left-1.5 h-10 rounded-full border shadow-sm"
            />

            {/* ── Search icon ────────────────────────────────────────────────
             * Fixed w-10 flex slot — never moves regardless of state.
             * Sits above the background pill via z-10.
             */}
            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center">
              <Icon
                icon="gravity-ui:magnifier"
                width={18}
                height={18}
                className="text-foreground"
              />
            </div>

            {/* ── Content slot ───────────────────────────────────────────────
             * Fixed w-[17rem] with ml-2 gap from the icon.
             * Tabs and input crossfade simultaneously via popLayout.
             */}
            <div className="relative z-10 ml-2 h-10 w-68 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {isSearching ? (
                  <m.input
                    key="input"
                    ref={focusOnMount}
                    initial={{ opacity: 0, filter: 'blur(6px)', x: 6 }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                      x: 0,
                      transition: { duration: 0.18, delay: 0.22 },
                    }}
                    exit={{ opacity: 0, filter: 'blur(6px)', x: 6, transition: { duration: 0.12 } }}
                    placeholder="Search"
                    className="text-foreground placeholder:text-muted absolute inset-0 bg-transparent pr-3 text-sm font-medium outline-none"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                ) : (
                  <m.div
                    key="tabs"
                    initial={{ opacity: 0, filter: 'blur(6px)', x: -6 }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                      x: 0,
                      transition: { duration: 0.18, delay: 0.22 },
                    }}
                    exit={{
                      opacity: 0,
                      filter: 'blur(6px)',
                      x: -6,
                      transition: { duration: 0.12 },
                    }}
                    className="absolute inset-0 flex items-center"
                  >
                    <Tabs
                      selectedKey={activeTab}
                      onSelectionChange={(key) => setActiveTab(key as string)}
                    >
                      <Tabs.ListContainer>
                        <Tabs.List aria-label="Discovery categories">
                          {categories.map((cat, i) => (
                            <Tabs.Tab key={cat.id} id={cat.id}>
                              {i > 0 && <Tabs.Separator />}
                              <span
                                className={cn(
                                  'shrink-0 [&_svg]:fill-current',
                                  activeTab === cat.id && cat.activeClassName
                                )}
                              >
                                {cat.icon}
                              </span>
                              <span
                                className={cn(
                                  'ml-1.5',
                                  activeTab === cat.id && cat.activeClassName
                                )}
                              >
                                {cat.label}
                              </span>
                              <Tabs.Indicator />
                            </Tabs.Tab>
                          ))}
                        </Tabs.List>
                      </Tabs.ListContainer>
                    </Tabs>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Invisible click target covering the icon circle when closed */}
            {!isSearching && (
              <button
                aria-label="Open search"
                className="absolute left-1.5 z-20 size-10 rounded-full"
                onClick={() => setIsSearching(true)}
              />
            )}

            {/* ── Close button ───────────────────────────────────────────────
             * Always in layout (w-10 + gap = 2.5rem + 0.5rem) so total bar
             * width stays constant. Invisible and non-interactive when closed.
             */}
            <div className="ml-2 w-10 shrink-0">
              <m.button
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
                animate={{
                  opacity: isSearching ? 1 : 0,
                  scale: isSearching ? 1 : 0.85,
                  filter: isSearching ? 'blur(0px)' : 'blur(6px)',
                }}
                transition={{
                  ...blurTransition,
                  delay: isSearching ? 0.28 : 0,
                }}
                aria-label="Close search"
                aria-hidden={!isSearching}
                tabIndex={isSearching ? 0 : -1}
                style={{ pointerEvents: isSearching ? 'auto' : 'none' }}
                onClick={() => {
                  setIsSearching(false);
                  setSearchValue('');
                }}
                className="border-border bg-surface text-foreground flex size-10 items-center justify-center rounded-full border shadow-sm"
              >
                <Icon icon="gravity-ui:xmark" width={18} height={18} />
              </m.button>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
