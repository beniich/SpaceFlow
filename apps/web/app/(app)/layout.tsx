import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Can fetch server-side initial data here if needed
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
