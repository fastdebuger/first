import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';

interface HeaderBothProps {
  reverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
  color?: [string, string];
}

/**
 * 顶部两边区域
 * @param param
 * @returns 
 */
const HeaderBoth: React.FC<HeaderBothProps> = ({
  reverse = false,
  className,
  style,
  color = ['#00A3E0', '#00E0FF'],
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onResize = useCallback(() => {
    if (domRef.current) {
      setSize({
        width: domRef.current.clientWidth,
        height: domRef.current.clientHeight,
      });
    }
  }, []);

  useLayoutEffect(() => {
    onResize();
    if (typeof ResizeObserver !== 'undefined' && domRef.current) {
      const observer = new ResizeObserver(onResize);
      observer.observe(domRef.current);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  // 2. 坐标计算逻辑
  const { width, height } = size;
  const xPos = useCallback((pos: number) => (!reverse ? pos : width - pos), [reverse, width]);

  const points = useMemo(() => {
    if (width === 0 || height === 0) return { p1: '', p2: '', p3: '' };

    return {
      // 第一段：斜角装饰
      p1: `${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`,
      // 第二段：主框架折线
      p2: `${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`,
      // 第三段：底部水平线
      p3: `${xPos(0)}, ${height - 3}, ${xPos(Math.min(width, 200))}, ${height - 3}`
    };
  }, [xPos, width, height]);

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        ...style,
      }}
    >
      {width > 0 && height > 0 && (
        <svg width={width} height={height} style={{ display: 'block' }}>
          <polyline
            stroke={color[0]}
            strokeWidth="2"
            fill="transparent"
            points={points.p1}
            strokeOpacity="0.7"
          />
          <polyline
            stroke={color[0]}
            strokeWidth="2"
            fill="transparent"
            points={points.p2}
          />
          <polyline
            stroke={color[1]}
            fill="transparent"
            strokeWidth="3"
            points={points.p3}
            strokeDasharray="10, 5"
          />
        </svg>
      )}
    </div>
  );
};

export default HeaderBoth;