import { useState, useLayoutEffect, useCallback } from 'react';

/**
 * 宽高监听
 * @param domRef 监听的 DOM 引用
 */
export const useAutoResize = (domRef: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onResize = useCallback(() => {
    if (domRef.current) {
      const { clientWidth, clientHeight } = domRef.current;
      setSize({ width: clientWidth, height: clientHeight });
    }
  }, [domRef]);

  useLayoutEffect(() => {
    onResize(); // 初始化获取一次宽高

    if (typeof ResizeObserver !== 'undefined' && domRef.current) {
      const observer = new ResizeObserver(onResize);
      observer.observe(domRef.current);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [domRef, onResize]);

  return size;
};