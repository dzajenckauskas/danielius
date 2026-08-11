"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ActiveIndexObserverOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export function useActiveIndexObserver<T extends HTMLElement>(
  count: number,
  { rootMargin = "-38% 0px -48%", threshold = 0 }: ActiveIndexObserverOptions = {},
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const elementsRef = useRef<(T | null)[]>([]);

  const setObservedElement = useCallback((index: number, element: T | null) => {
    elementsRef.current[index] = element;
  }, []);

  useEffect(() => {
    const elements = elementsRef.current.slice(0, count);
    const observers = elements.map((element, index) => {
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin, threshold },
      );
      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, [count, rootMargin, threshold]);

  return { activeIndex, setObservedElement };
}
