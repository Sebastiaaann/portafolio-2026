import React, { useRef, useLayoutEffect, useState } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';

export function MagazineWrap({
  texts,
  imageElement,
  imageWidth = 140,
  imageHeight = 150,
  className = ""
}: {
  texts: React.ReactNode[]; // We'll extract text logically, or pass strings
  imageElement?: React.ReactNode;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{text: string, y: number, x: number}[]>([]);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const [isMobileStack, setIsMobileStack] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // We expect texts to be strings
    const stringTexts = texts.filter(t => typeof t === 'string') as string[];
    
    const measure = () => {
      const styles = window.getComputedStyle(el);
      const fontMetrics = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
      const lh = parseFloat(styles.lineHeight) || parseInt(styles.fontSize) * 1.5;
      
      const maxWidth = el.getBoundingClientRect().width;
      if (maxWidth === 0) return;

      const isMobile = window.innerWidth < 768; // Tailwind md breakpoint
      setIsMobileStack(isMobile);

      let currentLines: {text: string, y: number, x: number}[] = [];
      let y = isMobile ? imageHeight + 32 : 0; // If mobile, stack text below image
      
      const gap = 32; // space around image horizontally
      const imageBottom = imageHeight + 12; // slightly less gap below image
      
      stringTexts.forEach((text) => {
        const prepared = prepareWithSegments(text, fontMetrics);
        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
        
        while (true) {
          // If we are above the image bottom AND floating on the left (and not on mobile):
          const overlapsImage = !isMobile && y < imageBottom;
          
          const width = overlapsImage ? Math.max(0, maxWidth - imageWidth - gap) : maxWidth;
          // Notice we deduct paddingLeft/offset when it overlaps!
          const xOffset = overlapsImage ? imageWidth + gap : 0;
          
          if (width <= 0) break; // Safety
          
          const line = layoutNextLine(prepared, cursor, width);
          if (line === null) break;
          
          currentLines.push({ text: line.text, y, x: xOffset });
          cursor = line.end;
          y += lh;
        }
        y += lh * 0.75; // paragraph spacing
      });

      setLines(currentLines);
      setHeight(Math.max(y, !isMobile ? imageHeight : 0));
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    measure();
    
    return () => ro.disconnect();
  }, [texts, imageWidth, imageHeight]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: height === 'auto' ? undefined : height }}>
      {/* The floating image obstacle */}
      {imageElement && (
        <div className="absolute top-0" style={{ left: isMobileStack ? '50%' : 0, transform: isMobileStack ? 'translateX(-50%)' : 'none' }}>
           {imageElement}
        </div>
      )}
      
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        {lines.map((line, i) => (
          <div key={i} className="absolute whitespace-pre pointer-events-auto transition-all duration-300 ease-out" style={{ top: line.y, left: line.x }}>
            {line.text}
          </div>
        ))}
      </div>
      
      {/* Fallback semántico */}
      {texts.map((t, i) => <p key={i} className="sr-only">{t as string}</p>)}
    </div>
  );
}
