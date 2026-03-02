import {
  useMemo,
  forwardRef,
  CSSProperties,
  ReactNode
} from 'react';
import useDomResize from '../use/useDomResize';
import { mergedClass } from '../options';

// --- 类型定义 ---
interface BorderBoxProps {
  children?: ReactNode;      // 容器内嵌套的子组件
  className?: string;        // 自定义样式类名
  style?: CSSProperties;     // 自定义行内样式
  color?: string[];          // 边框颜色数组 [主色, 辅色]
  backgroundColor?: string;  // 容器背景颜色
}


// 定义四个角落的名称，用于循环渲染和样式定位
const borderNames = ['left-top', 'right-top', 'left-bottom', 'right-bottom'] as const;
// 默认科技感配色：[浅青色, 深蓝色]
const defaultColor = ['#4fd2dd', '#235fa7'];

/**
 * 数据驾驶舱边框
 */
const CardBox = forwardRef<HTMLDivElement, BorderBoxProps>(
  ({ children, className, style, color = [], backgroundColor = 'transparent' }, ref) => {
    // 监听 DOM 尺寸变化，获取容器的实时宽高以适配 SVG
    const { width, height, domRef } = useDomResize(ref);

    // 颜色合并逻辑：如果外部未传入 color，则使用默认的科技感配色
    const mergedColor = useMemo(() => {
      const newColor = [...defaultColor];
      if (color[0]) newColor[0] = color[0];
      if (color[1]) newColor[1] = color[1];
      return newColor;
    }, [color]);

    // 计算边角的旋转和位置样式：通过 transform 镜像翻转实现四个角落的装饰
    const getBorderStyle = (name: typeof borderNames[number]): CSSProperties => {
      const baseStyle: CSSProperties = { position: 'absolute', display: 'block' };
      switch (name) {
        case 'left-top': return { ...baseStyle, top: 0, left: 0 };
        case 'right-top': return { ...baseStyle, top: 0, right: 0, transform: 'rotateY(180deg)' };
        case 'left-bottom': return { ...baseStyle, bottom: 0, left: 0, transform: 'rotateX(180deg)' };
        case 'right-bottom': return { ...baseStyle, bottom: 0, right: 0, transform: 'rotate(180deg)' };
        default: return baseStyle;
      }
    };

    return (
      <div
        className={mergedClass('dv-border-box-1', className)}
        ref={domRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
        {/* 背景及边框主形状：使用 polygon 绘制带有切角的科技感底形 */}
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
        >
          <polygon
            fill={backgroundColor}
            points={`
              10, 27 10, ${height - 27} 13, ${height - 24} 13, ${height - 21} 24, ${height - 11}
              38, ${height - 11} 41, ${height - 8} 73, ${height - 8} 75, ${height - 10} 81, ${height - 10}
              85, ${height - 6} ${width - 85}, ${height - 6} ${width - 81}, ${height - 10} ${width - 75}, ${height - 10}
              ${width - 73}, ${height - 8} ${width - 41}, ${height - 8} ${width - 38}, ${height - 11}
              ${width - 24}, ${height - 11} ${width - 13}, ${height - 21} ${width - 13}, ${height - 24}
              ${width - 10}, ${height - 27} ${width - 10}, 27 ${width - 13}, 25 ${width - 13}, 21
              ${width - 24}, 11 ${width - 38}, 11 ${width - 41}, 8 ${width - 73}, 8 ${width - 75}, 10
              ${width - 81}, 10 ${width - 85}, 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24
            `}
          />
        </svg>

        {/* 四个角落的装饰 SVG：每个边角包含三段带有动画效果的折线 */}
        {borderNames.map((name) => (
          <svg
            width="150px"
            height="150px"
            key={name}
            style={getBorderStyle(name)}
          >
            {/* 装饰件 1：主色调边角折线，带有呼吸闪烁动画 */}
            <polygon
              fill={mergedColor[0]}
              points="6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
            >
              <animate
                attributeName="fill"
                values={`${mergedColor[0]};${mergedColor[1]};${mergedColor[0]}`}
                dur="0.5s"
                repeatCount="indefinite"
              />
            </polygon>
            {/* 装饰件 2：辅助色调小方块，快速闪烁 */}
            <polygon
              fill={mergedColor[1]}
              points="27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
            >
              <animate
                attributeName="fill"
                values={`${mergedColor[1]};${mergedColor[0]};${mergedColor[1]}`}
                dur="0.5s"
                repeatCount="indefinite"
              />
            </polygon>
            {/* 装饰件 3：边缘流光线条，带有从主色到透明的循环渐变动画 */}
            <polygon
              fill={mergedColor[0]}
              points="9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
            >
              <animate
                attributeName="fill"
                values={`${mergedColor[0]};${mergedColor[1]};transparent`}
                dur="1s"
                repeatCount="indefinite"
              />
            </polygon>
          </svg>
        ))}

        {/* 内容插槽：用于放置实际的图表、文字或业务内容 */}
        <div
          className="border-box-content"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default CardBox;