import { Link } from 'react-router';
import { Menu, Search, Globe, Home, MapPin, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';

interface NavLink {
  to: string;
  label: string;
  icon?: LucideIcon;
}

const navLinks: NavLink[] = [
  { to: '/sports', label: 'Sports' },
  { to: '/finance', label: 'Finance' },
  { to: '/era-guide', label: 'Era' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/blueprints', label: 'Blueprints' },
  { to: '/disasters', label: 'Disasters' },
  { to: '/tech-transfer', label: 'Tech' },
  { to: '/medical', label: 'Medical' },
  { to: '/butterfly', label: 'Risk' },
  { to: '/safety', label: 'Safety' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/progress', label: 'Progress' },
  { to: '/companions', label: 'Companions' },
  { to: '/world-events', label: 'World Events', icon: Globe },
  { to: '/places-to-live', label: 'Places to Live', icon: Home },
  { to: '/places-to-visit', label: 'Places to Visit', icon: MapPin },
  { to: '/engineering', label: 'Engineering', icon: Wrench },
];

interface MobileNavProps {
  activeCompanionAvatar: string;
  activeCompanionName: string;
  onCompanionClick: () => void;
  onSearchClick: () => void;
}

export function MobileNav({
  activeCompanionAvatar,
  activeCompanionName,
  onCompanionClick,
  onSearchClick,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center size-11 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer select-none"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Menu className="size-5" />
      </button>
      <SheetContent side="left" className="bg-neutral-950 border-neutral-800 text-neutral-50 w-72 p-0">
        <SheetHeader className="border-b border-neutral-800 px-4 py-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <SheetClose
              render={
                <button
                  className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
                />
              }
              onClick={() => {
                onCompanionClick();
                setOpen(false);
              }}
            >
              <span className="text-sm">{activeCompanionAvatar}</span>
              <span className="font-semibold">{activeCompanionName}</span>
            </SheetClose>
            <SheetClose
              render={
                <button
                  className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
                />
              }
              onClick={() => {
                onSearchClick();
                setOpen(false);
              }}
            >
              <Search className="size-3.5" />
              <span>Search</span>
            </SheetClose>
          </div>
        </SheetHeader>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Navigate to different sections</SheetDescription>
        <nav className="flex flex-col py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <SheetClose
                key={link.to}
                render={
                  <Link
                    to={link.to}
                    className="px-6 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-colors flex items-center gap-3"
                  />
                }
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                {link.label}
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
