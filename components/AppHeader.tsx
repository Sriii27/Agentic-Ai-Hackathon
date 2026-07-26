'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, type BadgeTone } from './ui/Badge';
import { useCase } from '@/lib/case-context';
import { useAuth } from '@/lib/auth-context';

export function AppHeader({
  tone,
}: {
  role?: string;
  tone?: BadgeTone;
}) {
  const { caseData } = useCase();
  const { user } = useAuth();
  const pathname = usePathname();

  const isHomeActive = pathname === '/';

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        
        {/* Brand & Active Case */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg py-1 text-slate-900 focus-visible:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 font-bold text-xs text-white shadow-2xs">
              CM
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">Care Mediator</span>
          </Link>

          {caseData && (
            <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs">
              <span className="font-mono font-bold text-slate-700">{caseData.caseId}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-800 truncate max-w-[120px]">{caseData.patientName}</span>
            </div>
          )}
        </div>

        {/* Navigation Bar — ONLY Home Button as requested */}
        <nav className="flex items-center">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold transition-all ${
              isHomeActive
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
        </nav>

        {/* Active User / Login Link */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs hover:bg-slate-100 transition-colors"
              title="Click to view user profile / switch role"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-bold text-slate-800 text-[11px] truncate max-w-[100px]">
                {user.name}
              </span>
              <Badge tone={tone || 'slate'} className="py-0 px-1.5 text-[9px]">
                {user.role}
              </Badge>
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-bold text-white hover:bg-teal-700"
            >
              Log In →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
