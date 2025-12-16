import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatMessage from '../components/ChatMessage';
import { MessageSender } from '../types';

describe('ChatMessage Component', () => {
  const mockUserMessage = {
    id: '1',
    text: 'How do I solve this?',
    sender: MessageSender.USER,
    timestamp: new Date('2025-01-01T10:00:00'),
  };

  const mockAiMessage = {
    id: '2',
    text: 'Let me help you with that. Try $x = 4$.',
    sender: MessageSender.AI,
    timestamp: new Date('2025-01-01T10:00:30'),
  };

  describe('Message Rendering', () => {
    it('should render user message text', () => {
      render(<ChatMessage message={mockUserMessage} />);
      
      expect(screen.getByText(mockUserMessage.text)).toBeInTheDocument();
    });

    it('should render AI message text', () => {
      render(<ChatMessage message={mockAiMessage} />);
      
      expect(screen.getByText(/Let me help you/i)).toBeInTheDocument();
    });

    it('should render message timestamp', () => {
      render(<ChatMessage message={mockUserMessage} />);
      
      // Check if timestamp is displayed (format may vary)
      expect(screen.getByText(/10:00/i)).toBeInTheDocument();
    });
  });

  describe('Message Styling', () => {
    it('should apply different styles for user messages', () => {
      const { container } = render(<ChatMessage message={mockUserMessage} />);
      
      // User messages should be aligned to the right
      const messageContainer = container.querySelector('[class*="justify-end"]');
      expect(messageContainer).toBeInTheDocument();
    });

    it('should apply different styles for AI messages', () => {
      const { container } = render(<ChatMessage message={mockAiMessage} />);
      
      // AI messages should be aligned to the left
      const messageContainer = container.querySelector('[class*="justify-start"]');
      expect(messageContainer).toBeInTheDocument();
    });

    it('should use different background colors for user vs AI', () => {
      const { container: userContainer } = render(
        <ChatMessage message={mockUserMessage} />
      );
      const { container: aiContainer } = render(
        <ChatMessage message={mockAiMessage} />
      );
      
      // Check that styling is different
      expect(userContainer.innerHTML).not.toBe(aiContainer.innerHTML);
    });
  });

  describe('Math Rendering in Messages', () => {
    it('should render LaTeX in AI messages', () => {
      const messageWithMath = {
        ...mockAiMessage,
        text: 'The solution is $x = 4$ and $y = 2$',
      };
      
      const { container } = render(<ChatMessage message={messageWithMath} />);
      
      // KaTeX should render math
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBeGreaterThan(0);
    });

    it('should render LaTeX in user messages', () => {
      const messageWithMath = {
        ...mockUserMessage,
        text: 'Is the answer $x = 4$?',
      };
      
      const { container } = render(<ChatMessage message={messageWithMath} />);
      
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Message Types', () => {
    it('should handle long messages', () => {
      const longMessage = {
        ...mockAiMessage,
        text: 'This is a very long message that should wrap properly and maintain good readability. '.repeat(10),
      };
      
      render(<ChatMessage message={longMessage} />);
      
      expect(screen.getByText(/This is a very long message/i)).toBeInTheDocument();
    });

    it('should handle messages with line breaks', () => {
      const multilineMessage = {
        ...mockAiMessage,
        text: 'Step 1: Convert to exponential form\nStep 2: Simplify\nStep 3: Solve',
      };
      
      render(<ChatMessage message={multilineMessage} />);
      
      expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    });

    it('should handle empty messages gracefully', () => {
      const emptyMessage = {
        ...mockUserMessage,
        text: '',
      };
      
      const { container } = render(<ChatMessage message={emptyMessage} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic markup', () => {
      const { container } = render(<ChatMessage message={mockUserMessage} />);
      
      // Messages should be in article or div elements
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should indicate message sender', () => {
      render(<ChatMessage message={mockUserMessage} />);
      
      // The component should visually distinguish senders
      const { container } = render(<ChatMessage message={mockUserMessage} />);
      expect(container.querySelector('[class*="bg-"]')).toBeInTheDocument();
    });
  });
});
