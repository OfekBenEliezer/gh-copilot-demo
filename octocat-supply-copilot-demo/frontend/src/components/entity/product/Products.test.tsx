import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import Products from './Products';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('axios');

vi.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

vi.mock('../../../api/config', () => ({
  api: {
    baseURL: 'http://test',
    endpoints: { products: '/api/products' },
  },
}));

// ---------------------------------------------------------------------------
// Test data – three products whose prices are intentionally out of order so
// sorting produces a clearly different sequence.
// ---------------------------------------------------------------------------
const mockProducts = [
  {
    productId: 1,
    name: 'Alpha',
    description: 'Alpha description',
    price: 99.99,
    imgName: 'alpha.png',
    sku: 'SKU-1',
    unit: 'piece',
    supplierId: 1,
  },
  {
    productId: 2,
    name: 'Beta',
    description: 'Beta description',
    price: 29.99,
    imgName: 'beta.png',
    sku: 'SKU-2',
    unit: 'piece',
    supplierId: 2,
  },
  {
    productId: 3,
    name: 'Gamma',
    description: 'Gamma description',
    price: 149.99,
    imgName: 'gamma.png',
    sku: 'SKU-3',
    unit: 'piece',
    supplierId: 3,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderProducts() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Products />
    </QueryClientProvider>
  );
}

/** Returns the text content of every <h3> in document order. */
function getProductNameOrder(): string[] {
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((el) => el.textContent ?? '');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Products – price sorting', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });
  });

  it('renders all three sort buttons', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    expect(screen.getByRole('button', { name: 'Default' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Low \u2192 High' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'High \u2192 Low' })).toBeInTheDocument();
  });

  it('"Default" button is aria-pressed=true on initial render', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Low \u2192 High' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'High \u2192 Low' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('preserves original server order when "Default" is selected', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    expect(getProductNameOrder()).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('sorts products low-to-high when "Low → High" is clicked', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    fireEvent.click(screen.getByRole('button', { name: 'Low \u2192 High' }));

    // 29.99 → 99.99 → 149.99
    expect(getProductNameOrder()).toEqual(['Beta', 'Alpha', 'Gamma']);
  });

  it('sorts products high-to-low when "High → Low" is clicked', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    fireEvent.click(screen.getByRole('button', { name: 'High \u2192 Low' }));

    // 149.99 → 99.99 → 29.99
    expect(getProductNameOrder()).toEqual(['Gamma', 'Alpha', 'Beta']);
  });

  it('restores original order after sorting when "Default" is clicked', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    fireEvent.click(screen.getByRole('button', { name: 'Low \u2192 High' }));
    expect(getProductNameOrder()).toEqual(['Beta', 'Alpha', 'Gamma']);

    fireEvent.click(screen.getByRole('button', { name: 'Default' }));
    expect(getProductNameOrder()).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('active sort button updates aria-pressed correctly', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    fireEvent.click(screen.getByRole('button', { name: 'High \u2192 Low' }));

    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Low \u2192 High' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'High \u2192 Low' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sorting and search filters compose correctly', async () => {
    renderProducts();
    await waitFor(() => screen.getByText('Alpha'));

    // Sort ascending first
    fireEvent.click(screen.getByRole('button', { name: 'Low \u2192 High' }));

    // Search narrows to names containing 'a' → matches Alpha (99.99) and Gamma (149.99)
    fireEvent.change(screen.getByPlaceholderText('Search products...'), {
      target: { value: 'a' },
    });

    // Beta is filtered out; remaining two should still be sorted asc
    expect(getProductNameOrder()).toEqual(['Alpha', 'Gamma']);
  });
});
