'use client';

import { useRef, MouseEvent } from 'react';

/**
 * Hook Material ripple asli: bikin lingkaran yang mengembang dari titik sentuh/klik,
 * bukan cuma efek CSS pseudo-element statis. Pasang `ref` dan panggil `onPointerDown`
 * di elemen yang mau dikasih efek ripple.
 */
export function useRipple<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  function onPointerDown(e: MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'currentColor';
    ripple.style.opacity = '0.18';
    ripple.style.transform = 'scale(0)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 550ms cubic-bezier(.22,1,.36,1), opacity 700ms cubic-bezier(.22,1,.36,1)';
    ripple.dataset.ripple = 'true';

    const prevPosition = getComputedStyle(el).position;
    if (prevPosition === 'static') el.style.position = 'relative';
    const prevOverflow = getComputedStyle(el).overflow;
    if (prevOverflow === 'visible') el.style.overflow = 'hidden';

    el.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
    });

    setTimeout(() => {
      ripple.style.opacity = '0';
      setTimeout(() => ripple.remove(), 200);
    }, 350);
  }

  return { ref, onPointerDown };
}
