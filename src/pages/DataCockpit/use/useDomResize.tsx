import { useState, useLayoutEffect, useRef } from 'react';

interface DomSize {
  width: number;
  height: number;
  domRef: React.RefObject<HTMLDivElement>;
}

/**
 * 监听容器宽高
 * @param customRef 
 * @returns 
 */
const useDomResize = (customRef: React.ForwardedRef<HTMLDivElement>): DomSize => {
  const domRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const target = (customRef && 'current' in customRef ? customRef.current : null) || domRef.current;
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [customRef]);

  return { ...size, domRef };
};


export default useDomResize;