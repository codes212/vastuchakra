import { Link, useLocation } from 'react-router-dom';
import { Compass, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/map', label: 'Map' },
  { path: '/zones', label: 'Zones' },
  { path: '/entrances', label: 'Entrances' },
  { path: '/devtas', label: 'Devtas' },
  { path: '/activation', label: 'Activation' },
  { path: '/objects', label: 'Objects' },
  { path: '/remedies', label: 'Remedies' },
  { path: '/colors', label: 'Colors' },
  { path: '/metals', label: 'Metals' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center px-4 lg:px-8 gap-4 overflow-x-auto">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary shrink-0">
          <Compass className="w-5 h-5" /> Vastu Chakra
        </Link>
        <div className="flex gap-1 shrink-0 flex-1">
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
        <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9" onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </nav>
      <main>{children}</main>
    </div>
  );
}
