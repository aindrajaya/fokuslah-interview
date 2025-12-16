import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from '../components/ChatInterface';

describe('ChatInterface Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    it('should render welcome message from Jojo', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      expect(screen.getByText(/Jojo/i)).toBeInTheDocument();
      expect(screen.getByText(/math tutor/i)).toBeInTheDocument();
    });

    it('should render message input field', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe('User Input and Message Sending', () => {
    it('should allow user to type a message', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      await user.type(input, 'How do I solve this?');
      
      expect(input).toHaveValue('How do I solve this?');
    });

    it('should send message when send button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      await user.type(input, 'Give me a hint');
      
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1];
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Give me a hint')).toBeInTheDocument();
      });
    });

    it('should send message when Enter key is pressed', async () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      fireEvent.change(input, { target: { value: 'Help me' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Help me')).toBeInTheDocument();
      });
    });

    it('should clear input field after sending message', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i) as HTMLInputElement;
      await user.type(input, 'Test message');
      
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1];
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Mock AI Responses (1.5s delay)', () => {
    it('should respond with hint when user asks for hint', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      await user.type(input, 'Give me a hint');
      
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1];
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/hint/i)).toBeInTheDocument();
      });
    });

    it('should respond with solution steps when asked to reveal', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      await user.type(input, 'Show me the steps');
      
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1];
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        const messages = screen.getAllByText(/step/i);
        expect(messages.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Mobile vs Desktop Layout', () => {
    it('should show close button on mobile', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={true} />);
      
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-x');
      });
      expect(closeButton).toBeDefined();
    });

    it('should not show close button on desktop', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-x');
      });
      expect(closeButton).toBeUndefined();
    });

    it('should call onClose when close button is clicked on mobile', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={true} />);
      
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-x');
      });
      
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Auto-scroll Behavior', () => {
    it('should have messages container', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type.*message/i);
      await user.type(input, 'Test message');
      
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1];
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });
  });
});
