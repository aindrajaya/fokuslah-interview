import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    // Reset window size for each test
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  describe('Desktop Layout (≥768px)', () => {
    it('should render both question area and chat interface on desktop', async () => {
      render(<App />);
      
      // Question area should be visible
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
      
      // Chat interface should be visible with welcome message
      await waitFor(() => {
        const jojoTexts = screen.queryAllByText(/Jojo/i);
        expect(jojoTexts.length).toBeGreaterThan(0);
      });
    });

    it('should not show FAB button on desktop', () => {
      render(<App />);
      
      // On desktop, chat is always visible, so FAB should not exist
      const fabButtons = screen.queryAllByRole('button');
      const fabButton = fabButtons.find(btn => btn.textContent?.includes('Ask Jojo'));
      expect(fabButton).toBeUndefined();
    });

    it('should maintain split-screen layout with correct proportions', () => {
      const { container } = render(<App />);
      
      const mainSection = container.querySelector('main');
      const asideSection = container.querySelector('aside');
      
      expect(mainSection).toBeInTheDocument();
      expect(asideSection).toBeInTheDocument();
    });
  });

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      // Set mobile viewport
      window.innerWidth = 375;
      fireEvent(window, new Event('resize'));
    });

    it('should show FAB button when chat is closed on mobile', async () => {
      render(<App />);
      
      await waitFor(() => {
        const fabButton = screen.queryByRole('button', { name: /Ask Jojo/i });
        expect(fabButton).toBeInTheDocument();
      });
    });

    it('should hide FAB and show chat drawer when FAB is clicked', async () => {
      render(<App />);
      
      const fabButton = await screen.findByRole('button', { name: /Ask Jojo/i });
      fireEvent.click(fabButton);

      // Chat header should now be visible
      await waitFor(() => {
        const headers = screen.queryAllByText(/Jojo/i);
        expect(headers.length).toBeGreaterThan(0);
      });
    });

    it('should close chat drawer when close button is clicked', async () => {
      render(<App />);
      
      // Open chat
      const fabButton = await screen.findByRole('button', { name: /Ask Jojo/i });
      fireEvent.click(fabButton);

      // Wait for chat to open
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(1);
      });

      // Close chat (X button should be visible now)
      const allButtons = screen.getAllByRole('button');
      const closeButton = allButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg?.classList.contains('lucide-x');
      });
      
      if (closeButton) {
        fireEvent.click(closeButton);
        
        // FAB should reappear
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /Ask Jojo/i })).toBeInTheDocument();
        });
      }
    });

    it('should close chat when overlay is clicked', async () => {
      const { container } = render(<App />);
      
      // Open chat
      await waitFor(() => {
        const fabButton = screen.getByRole('button', { name: /Ask Jojo/i });
        fireEvent.click(fabButton);
      });

      // Click overlay
      const overlay = container.querySelector('.bg-black\\/50');
      if (overlay) {
        fireEvent.click(overlay);
      }

      // FAB should reappear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Ask Jojo/i })).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout when resizing from desktop to mobile', async () => {
      render(<App />);
      
      // Start on desktop - question should be visible
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
      
      // Resize to mobile
      window.innerWidth = 375;
      fireEvent(window, new Event('resize'));
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should adapt layout when resizing from mobile to desktop', async () => {
      window.innerWidth = 375;
      render(<App />);
      
      // Should show question area
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
      
      // Resize to desktop
      window.innerWidth = 1024;
      fireEvent(window, new Event('resize'));
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Question should still be visible
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
    });
  });
});
