import OperationsMatrix from '../components/OperationsMatrix';
import { useStore } from '../store/useStore';

export default function ModulesPage() {
  const addLog = useStore((s) => s.addLog);
  const logs = useStore((s) => s.logs);

  return <OperationsMatrix onAddLog={addLog} mainLogs={logs} />;
}
