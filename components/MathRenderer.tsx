import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

/**
 * Parses input string for LaTeX delimiters ($...$) and renders them using KaTeX.
 * We avoid 'react-latex-next' to ensure compatibility without complex bundler setups,
 * using the window/module katex directly.
 */
const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "", block = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text by $ delimiters to find math parts
    // Example: "Solve $x^2$" -> ["Solve ", "x^2", ""]
    const parts = text.split('$');
    
    containerRef.current.innerHTML = '';

    parts.forEach((part, index) => {
      const span = document.createElement('span');
      // If index is odd, it was inside $...$, so render as math
      if (index % 2 === 1) {
        try {
          katex.render(part, span, {
            throwOnError: false,
            displayMode: block, // Inline by default unless block prop is true
          });
        } catch (e) {
          span.innerText = part; // Fallback
        }
      } else {
        // Regular text
        span.innerText = part;
      }
      containerRef.current?.appendChild(span);
    });

  }, [text, block]);

  return <span ref={containerRef} className={className} />;
};

export default MathRenderer;
