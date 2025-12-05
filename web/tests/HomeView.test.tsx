import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomeView } from '../src/components/HomeView';

describe('HomeView', () => {
    const mockOnSearch = jest.fn();
    const mockOnTabChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the title correctly', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        expect(screen.getByText('Sanskrit.io')).toBeInTheDocument();
    });

    it('renders all tabs', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        expect(screen.getByText('Dictionary')).toBeInTheDocument();
        expect(screen.getByText('Grammar')).toBeInTheDocument();
        expect(screen.getByText('Agent')).toBeInTheDocument();
    });

    it('calls onTabChange when Dictionary tab is clicked', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        fireEvent.click(screen.getByText('Dictionary'));
        expect(mockOnTabChange).toHaveBeenCalledWith('dictionary');
    });

    it('calls onTabChange when Grammar tab is clicked', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        fireEvent.click(screen.getByText('Grammar'));
        expect(mockOnTabChange).toHaveBeenCalledWith('grammar');
    });

    it('calls onSearch when a suggestion is clicked', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        const suggestion = screen.getByText("Mahāvākya: Tat Tvam Asi");
        fireEvent.click(suggestion);
        expect(mockOnSearch).toHaveBeenCalledWith("What is the meaning of 'Tat Tvam Asi' from Chandogya Upanishad?");
    });

    it('updates input value when typing', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        const input = screen.getByPlaceholderText('Ask anything about Sanskrit...');
        fireEvent.change(input, { target: { value: 'test query' } });
        expect(input).toHaveValue('test query');
    });

    it('calls onSearch when form is submitted', () => {
        render(<HomeView onSearch={mockOnSearch} onTabChange={mockOnTabChange} />);
        const input = screen.getByPlaceholderText('Ask anything about Sanskrit...');
        fireEvent.change(input, { target: { value: 'test query' } });

        // Find the submit button (it has the Sparkles icon)
        const submitButton = screen.getByRole('button', { name: '' }); // Sparkles button might not have accessible name
        // Alternatively, submit the form
        // The form is the parent of the input
        // Let's just click the button inside the form
        // We can find it by type="submit"
        // But testing-library recommends accessible queries.
        // Let's try finding by role button and checking if it's the submit one.
        // Or just fire submit on the input.
        fireEvent.submit(input);

        expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });
});
