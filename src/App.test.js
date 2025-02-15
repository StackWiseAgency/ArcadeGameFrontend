
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  // Update this line to match the actual text in your component
  const headingElement = screen.getByText(/Welcome to Fling Disc/i);
  expect(headingElement).toBeInTheDocument();
});
