import { Link } from 'react-router';
import { Menu, Search, Globe, Home, MapPin, Wrench, Brain, Bookmark } from 'lucide-react';
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

interface NavGroup {
  label: string;
  icon: LucideIcon;
  links: NavLink[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Knowledge',
    icon: Brain,
    links: [
      { to: '/sports', label: 'Sports' },
      { to: '/finance', label: 'Finance' },
      { to: '/era-guide', label: 'Era' },
      { to: '/timeline', label: 'Timeline' },
      { to: '/blueprints', label: 'Blueprints' },
      { to: '/disasters', label: 'Disasters' },
      { to: '/tech-transfer', label: 'Tech' },
      { to: '/medical', label: 'Medical' },
      { to: '/safety', label: 'Safety' },
      { to: '/world-events', label: 'World Events', icon: Globe },
      { to: '/places-to-live', label: 'Places to Live', icon: Home },
      { to: '/places-to-visit', label: 'Places to Visit', icon: MapPin },
      { to: '/engineering', label: 'Engineering', icon: Wrench },
    ],
  },
  {
    label: 'AI Tools',
    icon: Brain,
    links: [
      { to: '/quiz', label: 'Quiz' },
      { to: '/butterfly', label: 'Risk' },
      { to: '/companions', label: 'Companions' },
    ],
  },
  {
    label: 'Personal',
    icon: Bookmark,
    links: [
      { to: '/bookmarks', label: 'Bookmarks' },
      { to: '/progress', label: 'Progress' },
    ],
  },
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
        <nav className="flex flex-col py-2 overflow-y-auto" aria-label="Navigation">
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.label} className="mb-2">
                <div className="px-6 py-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  <GroupIcon className="size-3.5" />
                  {group.label}
                </div>
                {group.links.map((link) => {
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
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
