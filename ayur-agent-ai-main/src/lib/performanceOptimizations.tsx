import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

/**
 * High-performance virtualized list component
 * Only renders visible items in viewport for better performance with large datasets
 * 
 * @example
 * <VirtualizedList
 *   items={foods}
 *   height={600}
 *   estimateSize={100}
 *   renderItem={(food) => <FoodCard food={food} />}
 * />
 */
export function VirtualizedList<T>({
  items,
  height,
  estimateSize,
  renderItem,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ height: `${height}px` }}
      role="list"
      aria-label="Virtualized list"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            role="listitem"
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook for debouncing values (performance optimization)
 * Reduces re-renders when user types quickly
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for memoized filtered/sorted lists
 * Prevents expensive recalculations on every render
 */
export function useFilteredList<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  sortFn?: (a: T, b: T) => number
): T[] {
  return useMemo(() => {
    let result = items.filter(filterFn);
    if (sortFn) {
      result = result.sort(sortFn);
    }
    return result;
  }, [items, filterFn, sortFn]);
}

/**
 * Performance monitoring hook
 * Logs component render times in development
 */
export function useRenderTime(componentName: string) {
  const renderCount = React.useRef(0);
  const startTime = React.useRef(performance.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });
}
