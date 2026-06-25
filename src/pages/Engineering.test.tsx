import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Engineering } from './Engineering';
import { loadEngineering } from '@/data/loader';
import type { EngineeringSpec } from '@/data/engineering';

vi.mock('@/data/loader', () => ({
  loadEngineering: vi.fn(),
}));

const mockSpecs = [
  {
    id: 'cnc_mit_1952',
    era: '1950s',
    subDomain: 'cnc_machining',
    conceptName: 'MIT Servomechanisms Lab CNC Milling Machine (1952)',
    description: 'The first numerically controlled (NC) machine tool, developed under USAF funding.',
    keySpecs: {
      'Axis Control': '3-axis',
      'Resolution': '0.0005-inch (0.5 mil)',
    },
    provenance: {
      sourceUrl: 'https://cms.it',
      sourceSite: 'CMS / MIT',
      confidence: 'high',
      extractedAt: '2024-01-01T00:00:00Z',
    },
    tags: ['cnc', 'machining', 'numerical-control'],
  },
  {
    id: 'semi_intel_4004_1971',
    era: '1970s',
    subDomain: 'semiconductors',
    conceptName: 'Intel 4004 Microprocessor (1971)',
    description: 'The first commercially produced microprocessor, designed by Intel for Busicom calculators.',
    keySpecs: {
      'Transistor Count': '2,300',
      'Process Node': '10 μm',
      'Clock Speed': '740 kHz',
    },
    provenance: {
      sourceUrl: 'https://intel.com',
      sourceSite: 'Intel',
      confidence: 'high',
      extractedAt: '2024-01-01T00:00:00Z',
    },
    tags: ['semiconductor', 'silicon', 'integrated-circuit'],
  },
  {
    id: 'met_bos_1952',
    era: '1950s',
    subDomain: 'metallurgy',
    conceptName: 'Basic Oxygen Steelmaking (BOS) Process (1952)',
    description: 'A primary steelmaking method that converts molten pig iron into steel.',
    keySpecs: {
      'Efficiency': 'Cycle lasts 20-45 minutes',
      'Innovation': 'Pure supersonic oxygen via water-cooled lance',
    },
    provenance: {
      sourceUrl: 'https://wikipedia.org',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: '2024-01-01T00:00:00Z',
    },
    tags: ['metallurgy', 'steel', 'alloy'],
  },
  {
    id: 'aero_agc_1966',
    era: '1960s',
    subDomain: 'aerospace',
    conceptName: 'Apollo Guidance Computer (AGC) Block II (1966)',
    description: 'The first computer to use silicon integrated circuits.',
    keySpecs: {
      'Word Length': '16 bits',
      'Clock Speed': '2.048 MHz',
      'Memory': '2,048 words RAM',
    },
    provenance: {
      sourceUrl: 'https://computer.org',
      sourceSite: 'IEEE Computer Society',
      confidence: 'high',
      extractedAt: '2024-01-01T00:00:00Z',
    },
    tags: ['aerospace', 'aviation', 'rocketry'],
  },
  {
    id: 'telecom_fiber_1977',
    era: '1970s',
    subDomain: 'telecommunications',
    conceptName: 'First Commercial Fiber Optic Network (1977)',
    description: 'AT&T installed the first commercial telecommunications fiber optic link.',
    keySpecs: {
      'Data Rate': '45 Mbps',
      'Wavelength': '850 nm',
    },
    provenance: {
      sourceUrl: 'https://thefoa.org',
      sourceSite: 'The FOA',
      confidence: 'high',
      extractedAt: '2024-01-01T00:00:00Z',
    },
    tags: ['telecom', 'communication', 'radio'],
  },
];

describe('Engineering page', () => {
  beforeEach(() => {
    vi.mocked(loadEngineering).mockResolvedValue(mockSpecs as unknown as EngineeringSpec[]);
  });

  it('renders page heading', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /engineering specs/i })).toBeTruthy();
    });
  });

  it('renders all entries after load', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/MIT Servomechanisms Lab CNC/i)).toBeTruthy();
      expect(screen.getByText(/Intel 4004 Microprocessor/i)).toBeTruthy();
      expect(screen.getByText(/Basic Oxygen Steelmaking/i)).toBeTruthy();
      expect(screen.getByText(/Apollo Guidance Computer/i)).toBeTruthy();
      expect(screen.getByText(/First Commercial Fiber Optic Network/i)).toBeTruthy();
    });
  });

  it('shows the total count', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/showing 5 of 5/i)).toBeTruthy();
    });
  });

  it('filters by subDomain when select changes', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText(/MIT Servomechanisms Lab CNC/i));

    const subdomainSelect = screen.getByLabelText(/sub-domain/i);
    fireEvent.change(subdomainSelect, { target: { value: 'semiconductors' } });

    await waitFor(() => {
      expect(screen.getByText(/Intel 4004 Microprocessor/i)).toBeTruthy();
    });
    expect(screen.queryByText(/MIT Servomechanisms Lab CNC/i)).toBeNull();
    expect(screen.queryByText(/Basic Oxygen Steelmaking/i)).toBeNull();
    expect(screen.queryByText(/Apollo Guidance Computer/i)).toBeNull();
    expect(screen.queryByText(/First Commercial Fiber Optic Network/i)).toBeNull();
  });

  it('filters by era when select changes', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText(/MIT Servomechanisms Lab CNC/i));

    const eraSelect = screen.getByLabelText(/^era:/i);
    fireEvent.change(eraSelect, { target: { value: '1960s' } });

    await waitFor(() => {
      expect(screen.getByText(/Apollo Guidance Computer/i)).toBeTruthy();
    });
    expect(screen.queryByText(/MIT Servomechanisms Lab CNC/i)).toBeNull();
    expect(screen.queryByText(/Intel 4004 Microprocessor/i)).toBeNull();
  });

  it('shows empty state when no matches', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText(/MIT Servomechanisms Lab CNC/i));

    const subdomainSelect = screen.getByLabelText(/sub-domain/i);
    // 'metallurgy' has no 1960s/1970s entry in our mocks
    fireEvent.change(subdomainSelect, { target: { value: 'metallurgy' } });

    const eraSelect = screen.getByLabelText(/^era:/i);
    fireEvent.change(eraSelect, { target: { value: '1970s' } });

    await waitFor(() => {
      expect(screen.getByText(/no engineering specs match/i)).toBeTruthy();
    });
  });

  it('text search filters results', async () => {
    render(
      <BrowserRouter>
        <Engineering />
      </BrowserRouter>
    );
    await waitFor(() => screen.getByText(/MIT Servomechanisms Lab CNC/i));

    const searchInput = screen.getByLabelText(/search engineering specs/i);
    fireEvent.change(searchInput, { target: { value: 'microprocessor' } });

    await waitFor(() => {
      expect(screen.getByText(/Intel 4004 Microprocessor/i)).toBeTruthy();
    });
    expect(screen.queryByText(/MIT Servomechanisms Lab CNC/i)).toBeNull();
    expect(screen.queryByText(/Basic Oxygen Steelmaking/i)).toBeNull();
  });
});