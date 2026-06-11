import { useState } from 'react';
import { financialAlmanac, type FinancialEvent } from '@/data/finance';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';

const categoryColors: Record<FinancialEvent['category'], string> = {
  'Market Crash': 'text-red-400',
  'Commodity': 'text-amber-400',
  'IPO': 'text-green-400',
  'Currency': 'text-blue-400',
  'Real Estate': 'text-purple-400',
};

export function FinancialAlmanac() {
  const [selectedEvent, setSelectedEvent] = useState<FinancialEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const renderChart = (id: string) => {
    let path: string;
    let startX: string;
    let endX: string;
    let startY: string;
    let endY: string;
    let markerType: 'up' | 'down';
    let entryPoint: { x: number; y: number } | null;
    let exitPoint: { x: number; y: number } | null = null;

    switch (id) {
      case 'bretton-woods-end':
        path = "M 30 85 L 60 78 L 90 68 L 130 50 L 170 15";
        startX = "1971"; endX = "1974";
        startY = "$35"; endY = "$183";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        exitPoint = { x: 170, y: 15 };
        break;
      case 'plaza-accord':
        path = "M 30 15 L 70 25 L 110 50 L 140 70 L 170 85";
        startX = "1985"; endX = "1988";
        startY = "¥240"; endY = "¥120";
        markerType = 'down';
        entryPoint = { x: 30, y: 15 };
        exitPoint = { x: 170, y: 85 };
        break;
      case 'bear-73-74':
        path = "M 30 15 L 65 30 L 100 50 L 135 80 L 170 85";
        startX = "Jan 73"; endX = "Dec 74";
        startY = "1051"; endY = "577";
        markerType = 'down';
        entryPoint = { x: 30, y: 15 };
        exitPoint = { x: 170, y: 85 };
        break;
      case 'bull-1982':
        path = "M 30 85 L 65 72 L 100 52 L 135 32 L 170 15";
        startX = "1982"; endX = "1990";
        startY = "776"; endY = "2753";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        exitPoint = { x: 170, y: 15 };
        break;
      case 'black-monday':
        path = "M 30 45 L 70 35 L 100 20 L 115 85 L 170 75";
        startX = "Aug 87"; endX = "Nov 87";
        startY = "2746"; endY = "1738";
        markerType = 'down';
        entryPoint = { x: 100, y: 20 };
        exitPoint = { x: 115, y: 85 };
        break;
      case 'oil-1973':
        path = "M 30 80 L 80 80 L 110 20 L 170 20";
        startX = "Oct 73"; endX = "Mar 74";
        startY = "$3"; endY = "$12";
        markerType = 'up';
        entryPoint = { x: 80, y: 80 };
        exitPoint = { x: 110, y: 20 };
        break;
      case 'oil-1979':
        path = "M 30 80 L 75 80 L 115 20 L 170 20";
        startX = "Jan 79"; endX = "Apr 80";
        startY = "$13"; endY = "$39.50";
        markerType = 'up';
        entryPoint = { x: 75, y: 80 };
        exitPoint = { x: 115, y: 20 };
        break;
      case 'gold-1980':
        path = "M 30 85 L 70 75 L 110 50 L 140 25 L 170 15";
        startX = "Jul 79"; endX = "Jan 80";
        startY = "$300"; endY = "$850";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        exitPoint = { x: 170, y: 15 };
        break;
      case 'silver-thursday':
        path = "M 30 85 L 70 75 L 110 40 L 140 15 L 170 80";
        startX = "Mid 79"; endX = "Mar 80";
        startY = "$6"; endY = "$49";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        exitPoint = { x: 140, y: 15 };
        break;
      case 'apple-ipo':
        path = "M 30 85 C 70 85, 120 70, 170 15";
        startX = "1980"; endX = "1990+";
        startY = "$0.10"; endY = "$1.00+";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        break;
      case 'microsoft-ipo':
        path = "M 30 85 C 70 85, 110 60, 170 15";
        startX = "1986"; endX = "1990+";
        startY = "$0.07"; endY = "$1.50+";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        break;
      case 'walmart-1970':
        path = "M 30 85 L 60 78 L 95 65 L 130 40 L 170 15";
        startX = "1970"; endX = "1990";
        startY = "$0.005"; endY = "$0.50";
        markerType = 'up';
        entryPoint = { x: 30, y: 85 };
        break;
      default:
        return null;
    }

    const strokeColor = markerType === 'up' ? '#10b981' : '#ef4444';
    const glowId = `glow-${id}`;

    return (
      <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
        <span className="text-[10px] font-bold text-neutral-500 uppercase block">Interactive Trend Visualization</span>
        <div className="flex gap-4 items-center">
          <div className="flex-1 bg-black/60 rounded p-2 border border-neutral-900 flex justify-center relative overflow-hidden h-[130px]">
            <div className="absolute left-1.5 top-1 bottom-1 flex flex-col justify-between text-[8px] font-mono text-neutral-600 select-none">
              <span>{endY}</span>
              <span>{startY}</span>
            </div>
            
            <div className="absolute bottom-1 left-7 right-7 flex justify-between text-[8px] font-mono text-neutral-600 select-none">
              <span>{startX}</span>
              <span>{endX}</span>
            </div>

            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              <defs>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <line x1="28" y1="15" x2="172" y2="15" stroke="#121212" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="28" y1="50" x2="172" y2="50" stroke="#121212" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="28" y1="85" x2="172" y2="85" stroke="#121212" strokeWidth="1" strokeDasharray="2 2" />

              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="250"
                strokeDashoffset="250"
                filter={`url(#${glowId})`}
                className="animate-[draw_1.5s_ease-out_forwards]"
              />

              {entryPoint && (
                <g className="animate-in fade-in zoom-in duration-500 delay-1000">
                  <circle cx={entryPoint.x} cy={entryPoint.y} r="5" fill="#4f46e5" filter="drop-shadow(0 0 3px #4f46e5)" />
                  <circle cx={entryPoint.x} cy={entryPoint.y} r="2" fill="#ffffff" />
                  <text x={entryPoint.x + 8} y={entryPoint.y + 3} className="fill-indigo-300 text-[7px] font-bold font-mono">ENTRY</text>
                </g>
              )}

              {exitPoint && (
                <g className="animate-in fade-in zoom-in duration-500 delay-1000">
                  <circle cx={exitPoint.x} cy={exitPoint.y} r="5" fill="#f59e0b" filter="drop-shadow(0 0 3px #f59e0b)" />
                  <circle cx={exitPoint.x} cy={exitPoint.y} r="2" fill="#ffffff" />
                  <text x={exitPoint.x - 26} y={exitPoint.y + 3} className="fill-amber-300 text-[7px] font-bold font-mono">EXIT</text>
                </g>
              )}
            </svg>
          </div>
          <div className="w-1/3 text-xs space-y-1 text-neutral-400 leading-relaxed font-sans">
            <div className="font-bold text-neutral-300 mb-1">Dossier Note</div>
            <div className="text-[10px]">
              {markerType === 'up' 
                ? "This asset climbs significantly. Use leveraged longs near entry." 
                : "This asset collapses. Prepare to short or exit holdings rapidly."}
            </div>
            <div className="text-[10px] text-neutral-500 mt-1.5">
              * entry/exit markers represent optimal timeline windows.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filtered = financialAlmanac.filter(e =>
    e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.notableDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.year.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Almanac</h2>
        <p className="text-neutral-400 mt-2">Market crashes, commodity spikes, IPOs, and currency events — curated for maximum capital generation with minimal attention.</p>
      </div>

      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search by year, event, or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-indigo-500"
        />
      </div>

      <div className="rounded-md border border-neutral-800 overflow-hidden bg-neutral-900/30">
        <Table>
          <TableHeader className="bg-neutral-900/50 hover:bg-neutral-900/50">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-300">Date</TableHead>
              <TableHead className="text-neutral-300">Category</TableHead>
              <TableHead className="text-neutral-300">Event</TableHead>
              <TableHead className="text-neutral-300">Direction</TableHead>
              <TableHead className="text-neutral-300">Entry Signal</TableHead>
              <TableHead className="text-neutral-300">Exit Signal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-neutral-500 py-8">No records matching your search.</TableCell>
              </TableRow>
            ) : (
              filtered.map(e => (
                <TableRow
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className="border-neutral-800 hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                  title="Click for details & companion thoughts"
                >
                  <TableCell className="font-medium text-neutral-300 whitespace-nowrap">{e.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${categoryColors[e.category]}`}>{e.category}</span>
                  </TableCell>
                  <TableCell className="text-neutral-200 max-w-48">
                    <div className="font-semibold">{e.event}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{e.notableDetails}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${e.direction === 'up' ? 'bg-green-950/50 text-green-400' : 'bg-red-950/50 text-red-400'}`}>
                      {e.direction === 'up' ? '▲ LONG' : '▼ SHORT'}
                    </span>
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm max-w-56">{e.entrySignal}</TableCell>
                  <TableCell className="text-neutral-400 text-sm max-w-56">{e.exitSignal}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📈</span> {selectedEvent.date}: {selectedEvent.event}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Category</span>
                  <span className={`text-xs font-semibold ${categoryColors[selectedEvent.category]}`}>{selectedEvent.category}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Trade Direction</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedEvent.direction === 'up' ? 'bg-green-950/50 text-green-400' : 'bg-red-950/50 text-red-400'}`}>
                    {selectedEvent.direction === 'up' ? '▲ LONG' : '▼ SHORT'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 space-y-3">
                {selectedEvent.notableDetails && (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">Details & Impact</span>
                    <p className="text-xs leading-relaxed text-neutral-300">{selectedEvent.notableDetails}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-900">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-550 uppercase block mb-0.5">Entry Signal</span>
                    <span className="text-xs text-neutral-200">{selectedEvent.entrySignal}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-550 uppercase block mb-0.5">Exit Signal</span>
                    <span className="text-xs text-neutral-200">{selectedEvent.exitSignal}</span>
                  </div>
                </div>
              </div>

              {renderChart(selectedEvent.id)}

              <PalaceHook routeId={selectedEvent.id} />
              <AthenaCommentary entryId={selectedEvent.id} />
              <ChatAboutThis entryId={selectedEvent.id} module="finance" fields={{ event: selectedEvent.event, date: selectedEvent.date }} />
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <PalaceLink tags={selectedEvent.tags} contextItem={`Finance: ${selectedEvent.event} (${selectedEvent.date})`} excludeId={selectedEvent.id} />
              )}
            </div>

            <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/20 flex justify-end">
              <Button
                onClick={() => setSelectedEvent(null)}
                variant="secondary"
                className="text-xs"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
