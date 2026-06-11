import { Children, ReactNode } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({
  children,
  itemClassName = '',
}: {
  children: ReactNode;
  itemClassName?: string;
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  baseScale = 0.85,
  scaleEndPosition: _scaleEndPosition = '10%',
  scaleDuration: _scaleDuration = 0.5,
  rotationAmount: _rotationAmount = 0,
  blurAmount: _blurAmount = 0,
  useWindowScroll: _useWindowScroll = false,
  onStackComplete: _onStackComplete,
}: ScrollStackProps) => {
  const items = Children.toArray(children);

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      style={
        {
          '--stack-top': stackPosition,
          '--stack-gap': `${itemStackDistance}px`,
          '--stack-distance': `${itemDistance}px`,
          '--stack-base-scale': baseScale,
          '--stack-item-scale': itemScale,
        } as React.CSSProperties
      }
    >
      <div className="scroll-stack-inner">
        {items.map((child, index) => (
          <div
            className="scroll-stack-card-wrapper"
            key={index}
            style={{ '--stack-index': index } as React.CSSProperties}
          >
            {child}
          </div>
        ))}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
