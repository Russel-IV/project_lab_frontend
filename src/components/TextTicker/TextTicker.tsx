import React from 'react';

interface TextTickerProps {
  words: string[];
  speed?: number;
}

export const TextTicker: React.FC<TextTickerProps> = ({
  words,
  speed = 20,
}) => {
  // Render the list twice for a seamless infinite loop
  const tickerItems = [...words, ...words];

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...trackStyle,
          animationDuration: `${speed}s`,
        }}
      >
        {tickerItems.map((word, index) => (
          <div key={index} style={itemStyle}>
            <span style={textStyle}>{word}</span>
            <span style={arrowStyle}>&rarr;</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  overflow: 'hidden',
  background: '#000000',
  padding: '2.5rem 0',
  display: 'flex',
  alignItems: 'center',
};

const trackStyle: React.CSSProperties = {
  display: 'flex',
  whiteSpace: 'nowrap',
  willChange: 'transform',
  animationName: 'marquee',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: 'clamp(2rem, 5vw, 4.5rem)',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
};

const textStyle: React.CSSProperties = {
  color: '#FFFFFF',
  padding: '0 2rem',
};

const arrowStyle: React.CSSProperties = {
  color: '#FFB800',
  padding: '0 1rem',
};
