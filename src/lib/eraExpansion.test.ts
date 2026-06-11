import { describe, it, expect } from 'vitest';
import { calculateInflation } from './inflation';
import { sportsAlmanac } from '../data/sports';
import { financialAlmanac } from '../data/finance';
import { disasterAlmanac } from '../data/disasters';
import { medicalInterventions } from '../data/medical';
import { techTransferTargets } from '../data/tech-transfer';

describe('Era Expansion Data and Inflation (1990–2001)', () => {
  describe('CPI Inflation Calculations (1991–2001)', () => {
    it('correctly calculates inflation for 1995', () => {
      // 1970 CPI is 38.8, 1995 CPI is 152.4
      // 100 * (152.4 / 38.8) = 392.7835...
      const result = calculateInflation(100, 1970, 1995);
      expect(result).toBeCloseTo(392.78, 2);
    });

    it('correctly calculates inflation for 2001', () => {
      // 1970 CPI is 38.8, 2001 CPI is 177.1
      // 100 * (177.1 / 38.8) = 456.4432...
      const result = calculateInflation(100, 1970, 2001);
      expect(result).toBeCloseTo(456.44, 2);
    });

    it('correctly calculates inflation between 1995 and 2001', () => {
      // 1995 CPI is 152.4, 2001 CPI is 177.1
      // 100 * (177.1 / 152.4) = 116.2073...
      const result = calculateInflation(100, 1995, 2001);
      expect(result).toBeCloseTo(116.21, 2);
    });
  });

  describe('Historical Events Integration (1990–2001)', () => {
    it('contains 1990-2001 sports entries', () => {
      const y2k2SuperBowl = sportsAlmanac.find(s => s.id === 'sb-xxxvi');
      expect(y2k2SuperBowl).toBeDefined();
      expect(y2k2SuperBowl?.year).toBe(2002); // played in 2002 for 2001 season
      expect(y2k2SuperBowl?.winner).toBe('New England Patriots');

      const ws2001 = sportsAlmanac.find(s => s.id === 'ws-2001');
      expect(ws2001).toBeDefined();
      expect(ws2001?.year).toBe(2001);
      expect(ws2001?.winner).toBe('Arizona Diamondbacks');
      expect(ws2001?.loser).toBe('New York Yankees');

      const nba1998 = sportsAlmanac.find(s => s.id === 'nba-1998');
      expect(nba1998).toBeDefined();
      expect(nba1998?.year).toBe(1998);
      expect(nba1998?.winner).toBe('Chicago Bulls');
    });

    it('contains 1990-2001 financial entries', () => {
      const amazon = financialAlmanac.find(f => f.id === 'amazon-ipo');
      expect(amazon).toBeDefined();
      expect(amazon?.year).toBe(1997);
      expect(amazon?.event).toContain('Amazon.com');

      const netscape = financialAlmanac.find(f => f.id === 'netscape-ipo');
      expect(netscape).toBeDefined();
      expect(netscape?.year).toBe(1995);

      const hasDotcom = financialAlmanac.some(f => f.year === 2000 && f.event.toLowerCase().includes('dot-com'));
      expect(hasDotcom).toBe(true);
    });

    it('contains 1990-2001 disasters', () => {
      const y2k = disasterAlmanac.find(d => d.id === 'y2k-bug');
      expect(y2k).toBeDefined();
      expect(y2k?.year).toBe(2000);

      const wtc = disasterAlmanac.find(d => d.id === 'wtc-1993');
      expect(wtc).toBeDefined();
      expect(wtc?.year).toBe(1993);

      const sep11 = disasterAlmanac.find(d => d.id === 'sept-11-attacks');
      expect(sep11).toBeDefined();
      expect(sep11?.year).toBe(2001);
    });

    it('contains 1990-2001 medical innovations', () => {
      const hivTherapy = medicalInterventions.find(m => m.id === 'hiv-haart');
      expect(hivTherapy).toBeDefined();
      expect(hivTherapy?.optimalYear).toBe(1995);

      const genomeProject = medicalInterventions.find(m => m.id === 'human-genome-hgp');
      expect(genomeProject).toBeDefined();
      expect(genomeProject?.optimalYear).toBe(1990);
    });

    it('contains 1990-2001 technology transfers', () => {
      const www = techTransferTargets.find(t => t.id === 'world-wide-web');
      expect(www).toBeDefined();
      expect(www?.optimalYear).toBe(1990);

      const pagerank = techTransferTargets.find(t => t.id === 'google-pagerank');
      expect(pagerank).toBeDefined();
      expect(pagerank?.optimalYear).toBe(1998);
    });
  });
});
