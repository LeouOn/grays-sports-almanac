import { useState } from 'react';
import { sportsAlmanac, type SportsEvent } from '@/data/sports';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';

export function SportsAlmanac() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);

  const filteredSports = sportsAlmanac.filter(event => 
    event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.winner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.year.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">The Sports Almanac</h2>
        <p className="text-neutral-400 mt-2">Historical sporting outcomes curated for optimal capital generation.</p>
      </div>

      <div className="max-w-sm">
        <Input 
          type="text" 
          placeholder="Search by year, sport, or event..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-indigo-500"
        />
      </div>

      <div className="rounded-md border border-neutral-800 overflow-hidden bg-neutral-900/30">
        <Table>
          <TableHeader className="bg-neutral-900/50 hover:bg-neutral-900/50">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-300">Year</TableHead>
              <TableHead className="text-neutral-300">Sport</TableHead>
              <TableHead className="text-neutral-300">Event</TableHead>
              <TableHead className="text-neutral-300">Winner</TableHead>
              <TableHead className="text-neutral-300">Score & Details</TableHead>
              <TableHead className="text-neutral-300">Odds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSports.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-neutral-500 py-8">No records found matching your search.</TableCell>
              </TableRow>
            ) : (
              filteredSports.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  title="Click for details & companion thoughts"
                >
                  <TableCell className="font-medium text-neutral-300">{event.year}</TableCell>
                  <TableCell>{event.sport}</TableCell>
                  <TableCell className="text-neutral-300">{event.event}</TableCell>
                  <TableCell className="text-green-400 font-semibold">{event.winner}</TableCell>
                  <TableCell>
                    {event.score && <div className="font-bold text-neutral-200">{event.score}</div>}
                    <div className="text-xs text-neutral-400 mt-1">{event.notableDetails}</div>
                  </TableCell>
                  <TableCell className="text-amber-400/90 font-medium">{event.odds || 'N/A'}</TableCell>
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
                <span>🏆</span> {selectedEvent.year} {selectedEvent.event}
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
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Sport</span>
                  <span className="text-sm font-semibold text-neutral-200">{selectedEvent.sport}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Odds</span>
                  <span className="text-sm font-semibold text-amber-400">{selectedEvent.odds || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">Winner</span>
                  <span className="text-lg font-bold text-green-400">{selectedEvent.winner}</span>
                </div>
                {selectedEvent.score && (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">Final Score</span>
                    <span className="text-sm font-semibold text-neutral-200">{selectedEvent.score}</span>
                  </div>
                )}
                {selectedEvent.notableDetails && (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">Details & Key Upsets</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">{selectedEvent.notableDetails}</p>
                  </div>
                )}
              </div>

              <PalaceHook routeId={selectedEvent.id} />
              <AthenaCommentary entryId={selectedEvent.id} />
              <ChatAboutThis entryId={selectedEvent.id} module="sports" fields={{ event: selectedEvent.event, year: selectedEvent.year }} />
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <PalaceLink tags={selectedEvent.tags} contextItem={`Sports: ${selectedEvent.event} (${selectedEvent.year})`} excludeId={selectedEvent.id} />
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
