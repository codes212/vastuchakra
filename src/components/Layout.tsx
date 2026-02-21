import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/zones', label: 'Zones' },
  { path: '/entrances', label: 'Entrances' },
  { path: '/devtas', label: 'Devtas' },
  { path: '/objects', label: 'Objects' },
  { path: '/remedies', label: 'Remedies' },
  { path: '/colors', label: 'Colors' },
  { path: '/metals', label: 'Metals' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-4 lg:px-8 gap-6 overflow-x-auto">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary shrink-0">
          <Compass className="w-5 h-5" /> Vastu Chakra
        </Link>
        <div className="flex gap-1 shrink-0">
          {NAV.map(n => (
            <Link key={n.path} to={n.path}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === n.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
