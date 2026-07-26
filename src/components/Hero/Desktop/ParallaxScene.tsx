import React, { useEffect, useRef } from 'react';

interface ParallaxLayer {
  src: string;
  /** Max translation as a fraction of the container size; higher = closer to the viewer. */
  reach: number;
}

// Every layer is pre-rendered with ~10% bleed (110% of the visible frame) so it
// can pan under the cursor without exposing its edge. Keep BASE_SCALE and each
// layer's reach inside that 5%-per-side margin, and never scale layers
// individually — they're one aligned illustration split into depth layers, and
// per-layer scaling would pull them out of registration with each other.
const BASE_SCALE = 1.1;

const LAYERS: ParallaxLayer[] = [
  { src: '/heroparallax/8.png', reach: 0.005 },
  { src: '/heroparallax/7.png', reach: 0.008 },
  { src: '/heroparallax/6.png', reach: 0.012 },
  { src: '/heroparallax/5.png', reach: 0.015 },
  { src: '/heroparallax/4.png', reach: 0.018 },
  { src: '/heroparallax/3.png', reach: 0.023 },
  { src: '/heroparallax/2.png', reach: 0.03 },
  { src: '/heroparallax/1.png', reach: 0.038 },
];

export const ParallaxScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const containerSize = useRef({ width: 0, height: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applyTransforms = () => {
      const { x, y } = target.current;
      const { width, height } = containerSize.current;
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const { reach } = LAYERS[i];
        const tx = x * reach * width;
        const ty = y * reach * height;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${BASE_SCALE})`;
      });
      frameRef.current = null;
    };

    const scheduleUpdate = () => {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(applyTransforms);
      }
    };

    const rect = container.getBoundingClientRect();
    containerSize.current = { width: rect.width, height: rect.height };
    applyTransforms();

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      containerSize.current = { width: bounds.width, height: bounds.height };
      target.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
      };
      scheduleUpdate();
    };

    const handlePointerLeave = () => {
      target.current = { x: 0, y: 0 };
      scheduleUpdate();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[600px] mx-auto select-none overflow-hidden rounded-[24px] shadow-lg"
    >
      {LAYERS.map((layer, i) => (
        <img
          key={layer.src}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          src={layer.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-out will-change-transform"
          style={{ zIndex: i }}
        />
      ))}
    </div>
  );
};

export default ParallaxScene;
