import AgroMaitreSuite from '../components/AgroMaitreSuite';
import { useStore } from '../store/useStore';

export default function PortailsPage() {
  const addLog = useStore((s) => s.addLog);

  return <AgroMaitreSuite onAddLog={addLog} />;
}
