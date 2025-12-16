import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MathRenderer from '../components/MathRenderer';

describe('MathRenderer Component', () => {
  describe('LaTeX Rendering', () => {
    it('should render inline math expressions', () => {
      const { container } = render(
        <MathRenderer text="The answer is $x = 4$" />
      );
      
      // KaTeX adds specific classes
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBeGreaterThan(0);
    });

    it('should render multiple math expressions in one text', () => {
      const { container } = render(
        <MathRenderer text="Given $a = 5$ and $b = 10$, find $a + b$" />
      );
      
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBeGreaterThan(0);
    });

    it('should render plain text without math notation', () => {
      render(<MathRenderer text="This is plain text without any math" />);
      
      expect(screen.getByText(/This is plain text/i)).toBeInTheDocument();
    });

    it('should handle empty text', () => {
      const { container } = render(<MathRenderer text="" />);
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle complex math expressions', () => {
      const { container } = render(
        <MathRenderer text="Solve: $\\log_2(2^{x+1}) = 5$" />
      );
      
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Text Transformation', () => {
    it('should preserve text before and after math expressions', () => {
      render(
        <MathRenderer text="The solution is $x = 4$ which is correct." />
      );
      
      expect(screen.getByText(/The solution is/i)).toBeInTheDocument();
      expect(screen.getByText(/which is correct/i)).toBeInTheDocument();
    });

    it('should handle special characters outside math mode', () => {
      render(
        <MathRenderer text="Use & operator, but solve $x + 1 = 2$" />
      );
      
      expect(screen.getByText(/Use & operator/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed LaTeX gracefully', () => {
      const { container } = render(
        <MathRenderer text="Incomplete math $x + " />
      );
      
      // Should still render something, even if not perfectly
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle nested dollar signs', () => {
      const { container } = render(
        <MathRenderer text="Price is $$100$$ dollars" />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render escaped dollar signs as plain text', () => {
      render(
        <MathRenderer text="The cost is \\$50, not $50$" />
      );
      
      expect(screen.getByText(/The cost is/i)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render inside a span element', () => {
      const { container } = render(
        <MathRenderer text="Test $x = 1$" />
      );
      
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('should accept and apply className prop', () => {
      const { container } = render(
        <MathRenderer text="Test" className="custom-class" />
      );
      
      const span = container.querySelector('span');
      expect(span).toHaveClass('custom-class');
    });
  });
});
