import { render, screen } from '@testing-library/react';
import App from './App';

// Until Firebase auth resolves, the auth provider renders the Loading state.
// This smoke test just verifies the app mounts without crashing.
test('renders without crashing and shows the loading state', () => {
  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
