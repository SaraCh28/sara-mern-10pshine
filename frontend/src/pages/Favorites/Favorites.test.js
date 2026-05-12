import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorites from './Favorites';
import { notesService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  notesService: {
    getAllNotes: jest.fn(),
  },
}));

const mockNotes = [
  { id: '1', title: 'Pinned Note', content: 'This is pinned', is_pinned: true },
  { id: '2', title: 'Regular Note', content: 'This is regular', is_pinned: false },
];

describe('Favorites Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    notesService.getAllNotes.mockImplementation(() => new Promise(() => {}));
    const { container } = render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );
    expect(container.getElementsByClassName('loading')).toBeTruthy();
  });

  it('displays only pinned notes', async () => {
    notesService.getAllNotes.mockResolvedValue({ data: mockNotes });
    
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pinned Note')).toBeInTheDocument();
      expect(screen.queryByText('Regular Note')).not.toBeInTheDocument();
    });
  });

  it('displays empty state if no pinned notes', async () => {
    notesService.getAllNotes.mockResolvedValue({ data: [{ id: '3', title: 'Regular Note 2', is_pinned: false }] });
    
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    });
  });
});
