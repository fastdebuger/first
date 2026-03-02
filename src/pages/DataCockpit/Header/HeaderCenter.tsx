import React, { useMemo, useRef } from "react";
import { useAutoResize } from "../use/useAutoResize"; 

interface DecorationProps {
  className?: string;
  style?: React.CSSProperties;
  dur?: number;
  color?: [string, string];
}

/**
 * 顶部中间区域
 * @param param0
 * @returns 
 */
const HeaderCenter: React.FC<DecorationProps> = ({ 
  className, 
  style, 
  dur = 1.2, 
  color = ['#00A3E0', '#00E0FF'] 
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const { width, height } = useAutoResize(domRef);

  const { line1, line2 } = useMemo(() => {
    const p1 = [
      [0, height * 0.2], [width * 0.18, height * 0.2], [width * 0.2, height * 0.4],
      [width * 0.25, height * 0.4], [width * 0.27, height * 0.6], [width * 0.72, height * 0.6],
      [width * 0.75, height * 0.4], [width * 0.8, height * 0.4], [width * 0.82, height * 0.2], [width, height * 0.2]
    ];
    const p2 = [[width * 0.3, height * 0.8], [width * 0.7, height * 0.8]];

    const getLen = (pts: number[][]) => 
      pts.reduce((acc, cur, i) => {
        if (i === 0) return 0;
        const prev = pts[i - 1];
        return acc + Math.sqrt(Math.pow(cur[0] - prev[0], 2) + Math.pow(cur[1] - prev[1], 2));
      }, 0);

    return {
      line1: { pts: p1.map(p => p.join(',')).join(' '), len: getLen(p1) },
      line2: { pts: p2.map(p => p.join(',')).join(' '), len: getLen(p2) }
    };
  }, [width, height]);

  return (
    <div 
      ref={domRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...style 
      }}
    >
      {width > 0 && height > 0 && (
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* 核心装饰折线 */}
          <polyline
            fill="transparent"
            stroke={color[0]}
            strokeWidth="2"
            points={line1.pts}
          >
            <animate
              attributeName="stroke-dasharray"
              from={`0, ${line1.len / 2}, 0, ${line1.len / 2}`}
              to={`0, 0, ${line1.len}, 0`}
              dur={`${dur}s`}
              fill="freeze"
              repeatCount="1"
              keySplines="0.4,1,0.49,0.98"
              calcMode="spline"
            />
          </polyline>

          <polyline
            fill="transparent"
            stroke={color[1]}
            strokeWidth="2"
            points={line2.pts}
          >
            <animate
              attributeName="stroke-dasharray"
              from={`0, ${line2.len / 2}, 0, ${line2.len / 2}`}
              to={`0, 0, ${line2.len}, 0`}
              dur={`${dur}s`}
              begin="0.1s"
              fill="freeze"
              repeatCount="1"
              keySplines=".4,1,.49,.98"
              calcMode="spline"
            />
          </polyline>
        </svg>
      )}
    </div>
  );
};

export default HeaderCenter;