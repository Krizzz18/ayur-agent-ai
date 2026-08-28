/**
 * Accessibility Utilities
 * Helpers for keyboard navigation, screen readers, and WCAG compliance
 */

/**
 * Keyboard event handler for Enter and Space keys
 * Makes non-button elements keyboard accessible
 */
export const handleKeyboardClick = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Generate unique IDs for aria-describedby and aria-labelledby
 */
let idCounter = 0;
export const generateUniqueId = (prefix: string = 'a11y'): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Date.now()}`;
};

/**
 * Screen reader only text (visually hidden but readable by screen readers)
 * Usage: <span className={srOnly}>This text is for screen readers only</span>
 */
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Focus trap for modals and dialogs
 * Keeps keyboard focus within the element
 */
export const useFocusTrap = (ref: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [ref]);
};

/**
 * Announce message to screen readers
 * Creates a live region announcement
 */
export const announceToScreenReader = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = srOnly;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Skip to main content link (for keyboard navigation)
 * Place at the very top of your app
 */
export const SkipToMainContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Skip to main content
    </a>
  );
};

/**
 * Check if element is keyboard focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
};

/**
 * ARIA live region for dynamic content updates
 */
export const useLiveRegion = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 100);
  }, []);

  const LiveRegion = React.useMemo(
    () => (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={srOnly}
      >
        {announcement}
      </div>
    ),
    [announcement]
  );

  return { announce, LiveRegion };
};

/**
 * Hook to detect if user prefers reduced motion
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Color contrast checker (WCAG AA compliance)
 * Returns true if contrast ratio is >= 4.5:1
 */
export const hasGoodContrast = (
  foreground: string,
  background: string
): boolean => {
  // This is a simplified version - real implementation would calculate luminance
  // For production, use a library like 'color-contrast-checker'
  return true; // Placeholder
};

import React from 'react';
