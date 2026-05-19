import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

export default function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1 className="font-bricolage text-3xl font-bold text-white">Rota nao encontrada</h1>
      <p className="mt-2 text-sm text-neutral-400">Essa tela ainda nao existe no workspace Kivo.</p>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Voltar ao inicio</Link>
    </Card>
  );
}
