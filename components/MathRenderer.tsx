import React, { useMemo, memo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

// Helper: Parse markdown bold (**text**) - moved outside component for performance
const parseMarkdown = (str: string): React.ReactNode[] => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(str)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : [str];
};

/**
 * Parses input string for LaTeX delimiters ($...$) and markdown formatting.
 * Supports: **bold**, newlines, and LaTeX math expressions.
 * Optimized with useMemo to prevent re-parsing on every render.
 */
const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "", block = false }) => {
  // Memoize the parsing and rendering to prevent expensive re-computation
  const renderedContent = useMemo(() => {
    // Split text by $ delimiters to find math parts
    // Example: "Solve $x^2$" -> ["Solve ", "x^2", ""]
    const parts = text.split('$');
    
    // Pre-select the math component to avoid conditional logic in map
    const MathComponent = block ? BlockMath : InlineMath;

    return parts.map((part, index) => {
      // If index is odd, it was inside $...$, so render as math
      if (index % 2 === 1) {
        // Skip empty math expressions
        if (!part.trim()) return null;
        
        try {
          return (
            <MathComponent key={index} math={part} />
          );
        } catch (e) {
          // Fallback to text if parsing fails
          return <span key={index}>{part}</span>;
        }
      } else {
        // Regular text - parse for markdown and preserve line breaks
        if (!part) return null;
        
        // Split by newlines to preserve formatting
        const lines = part.split('\n');
        return (
          <span key={index}>
            {lines.map((line, lineIdx) => (
              <React.Fragment key={`${index}-${lineIdx}`}>
                {lineIdx > 0 && <br />}
                {parseMarkdown(line)}
              </React.Fragment>
            ))}
          </span>
        );
      }
    });
  }, [text, block]); // Only re-compute when text or block changes

  return (
    <span className={className}>
      {renderedContent}
    </span>
  );
};

// Memoize with custom comparison - only re-render if text or block actually changed
export default memo(MathRenderer, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text && 
         prevProps.block === nextProps.block &&
         prevProps.className === nextProps.className;
});
