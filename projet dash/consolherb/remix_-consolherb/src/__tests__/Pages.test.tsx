import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortailsPage from '../pages/PortailsPage';
import ModulesPage from '../pages/ModulesPage';
import DashboardPage from '../pages/DashboardPage';
import InfraPage from '../pages/InfraPage';
import LogsPage from '../pages/LogsPage';
import SettingsPage from '../pages/SettingsPage';
import AgroBrainPage from '../pages/AgroBrainPage';
import VisionPage from '../pages/VisionPage';
import FinancePage from '../pages/FinancePage';
import TraceabilityPage from '../pages/TraceabilityPage';
import UpgradePage from '../pages/UpgradePage';
import BillingPage from '../pages/BillingPage';
import TeamPage from '../pages/TeamPage';
import ReportsPage from '../pages/ReportsPage';
import FreeDashboard from '../pages/FreeDashboard';


describe('App pages render checks', () => {
  it('renders PortailsPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <PortailsPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders ModulesPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <ModulesPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders DashboardPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders InfraPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <InfraPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders LogsPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <LogsPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders SettingsPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders AgroBrainPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <AgroBrainPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders VisionPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <VisionPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders FinancePage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <FinancePage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders TraceabilityPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <TraceabilityPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders UpgradePage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <UpgradePage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders BillingPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders TeamPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders ReportsPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <ReportsPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders FreeDashboard without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <FreeDashboard />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
