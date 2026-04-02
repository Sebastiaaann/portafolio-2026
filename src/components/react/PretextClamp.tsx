import React, { useState, useRef, useLayoutEffect } from 'react';
import { prepareWithSegments, layoutWithLines, layoutNextLine } from '@chenglou/pretext';

export function PretextClamp({ 
  text, 
  maxLines = 3, 
  action, 
  actionWidth = 80,
  className = ""
}: { 
  text: string;
  maxLines?: number;
  action: React.ReactNode;
  actionWidth?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayLines, setDisplayLines] = useState<{text: string, y: number, width: number}[]>([]);
  const [isClamped, setIsClamped] = useState(false);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const [lineHeight, setLineHeight] = useState<number>(24);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const measure = () => {
      // 1. Obtención de Metrics CSS calculados reales
      const styles = window.getComputedStyle(el);
      const fontMetrics = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
      const lh = parseFloat(styles.lineHeight) || parseInt(styles.fontSize) * 1.5;
      setLineHeight(lh);
      
      const elWidth = el.getBoundingClientRect().width;
      if (elWidth === 0) return;

      // 2. Setup de Pretext (O(1) cached computation)
      const prepared = prepareWithSegments(text, fontMetrics);
      const res = layoutWithLines(prepared, elWidth, lh);
      
      // 3. Lógica de Truncación Inteligente
      if (res.lines.length > maxLines) {
        setIsClamped(true);
        // Rescatamos las líneas previas a la última permitida
        let validLines = res.lines.slice(0, maxLines - 1);
        
        // El cursor (start/end) donde terminó la línea anterior a la última
        const lastLineStart = validLines.length > 0 
            ? validLines[validLines.length - 1].end 
            : { segmentIndex: 0, graphemeIndex: 0 };
        
        // Re-mapeamos SOLO la última línea con un ancho reducido para alojar el "Read more"
        const gapForEllipsis = 14; 
        const lastLineClamped = layoutNextLine(prepared, lastLineStart, elWidth - actionWidth - gapForEllipsis);
        
        let finalLines = [...validLines];
        if (lastLineClamped) {
           finalLines.push(lastLineClamped);
        }
        
        setDisplayLines(finalLines.map((l, i) => ({ 
           text: i === finalLines.length - 1 ? l.text + "..." : l.text, 
           y: i * lh, 
           width: l.width 
        })));
        setHeight(maxLines * lh);
        
      } else {
        setIsClamped(false);
        setDisplayLines(res.lines.map((l, i) => ({ text: l.text, y: i * lh, width: l.width })));
        setHeight(res.lines.length * lh + 28 /* space below text for readmore */);
      }
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    measure();
    
    return () => ro.disconnect();
  }, [text, maxLines, actionWidth]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: height === 'auto' ? undefined : height }}>
      {/* Fallback semántico para SEO y Screen Readers */}
      <p className="sr-only">{text}</p>
      
      {/* Render Visual con "Absolute Positioning Mathematics" */}
      <div aria-hidden="true" className="absolute inset-0 overflow-visible z-0 pointer-events-none">
        {displayLines.map((line, i) => (
          <div key={i} className="absolute left-0 whitespace-pre pointer-events-auto" style={{ top: line.y }}>
            {line.text}
          </div>
        ))}
      </div>
      
      {/* Inyección del Botón "Read More" posicionado matemáticamente */}
      {displayLines.length > 0 && (
         <div 
           className="z-10 absolute pointer-events-auto flex items-center" 
           style={{ 
             top: isClamped ? displayLines[displayLines.length - 1].y : displayLines.length * (lineHeight || 24) + 4, 
             left: isClamped 
               ? displayLines[displayLines.length - 1].width + 10 // Puesto al final de la última palabra exacto
               : 0
           }}
         >
           {action}
         </div>
      )}
    </div>
  );
}
