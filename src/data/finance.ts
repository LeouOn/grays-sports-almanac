export interface FinancialEvent {
  id: string;
  date: string;
  year: number;
  category: 'Market Crash' | 'Commodity' | 'IPO' | 'Currency' | 'Real Estate';
  event: string;
  direction: 'up' | 'down';
  peakPrice?: string;
  troughPrice?: string;
  entrySignal: string;
  exitSignal: string;
  maxLeverage: string;
  notableDetails: string;
  tags?: string[];
}

export const financialAlmanac: FinancialEvent[] = [
  // ── CURRENCY EVENTS ───────────────────────────────────────
  {
    id: 'bretton-woods-end',
    date: '1971-08-15',
    year: 1971,
    category: 'Currency',
    event: 'End of Bretton Woods / Nixon Shock',
    direction: 'up',
    peakPrice: 'Gold: $35 → $183/oz by 1974',
    entrySignal: 'Aug 15, 1971 — Nixon suspends gold convertibility. Buy gold immediately.',
    exitSignal: 'Dec 1974 — gold hits $183. US citizens can own gold again (Jan 1975) — sell into that demand.',
    maxLeverage: 'Buy physical gold coins or open a Swiss bank account pre-1971.',
    notableDetails: 'US dollar delinked from gold. Gold rises 5x in 3 years. This is the foundational trade of the decade.'
  },
  {
    id: 'plaza-accord',
    date: '1985-09-22',
    year: 1985,
    category: 'Currency',
    event: 'Plaza Accord — USD Devaluation',
    direction: 'down',
    peakPrice: 'USD/JPY: 240 → 120 by 1988',
    entrySignal: 'Sept 22, 1985 — G5 nations agree to weaken USD. Short USD, long JPY and DEM.',
    exitSignal: 'Early 1988 — USD/JPY approaches 120. Louvre Accord (Feb 1987) signals policy shift; exit by year end.',
    maxLeverage: 'Currency futures or interbank forex. Position size: no more than 3x annual income.',
    notableDetails: 'USD loses 50% vs Yen in 3 years. Coordinated government action = near-certain directional trade.'
  },

  // ── MARKET CRASHES ────────────────────────────────────────
  {
    id: 'bear-73-74',
    date: '1973-01-11 to 1974-12-06',
    year: 1973,
    category: 'Market Crash',
    event: '1973-74 Bear Market',
    direction: 'down',
    peakPrice: 'DJIA: 1,051 (Jan 1973)',
    troughPrice: 'DJIA: 577 (Dec 1974)',
    entrySignal: 'Jan 1973 — DJIA at all-time high. Short the market via put options or sell short blue chips.',
    exitSignal: 'Dec 6, 1974 — DJIA hits 577. Cover shorts. Begin accumulating for the 1975-76 bull rally (+75% in 2 years).',
    maxLeverage: 'Modest short positions. Bear markets are shorter than bulls — don\'t overstay.',
    notableDetails: 'Oil embargo + Watergate + inflation. Worst bear market since Great Depression. -45% peak to trough.'
  },
  {
    id: 'bull-1982',
    date: '1982-08-12',
    year: 1982,
    category: 'Market Crash',
    event: 'Start of the Great Bull Market (1982-2000)',
    direction: 'up',
    peakPrice: 'DJIA: 776 (Aug 1982) → 2,753 by Jan 1990',
    troughPrice: 'DJIA: 776',
    entrySignal: 'Aug 12, 1982 — Fed cuts rates, market bottoms. Buy index funds, blue chips, anything. Buy and hold.',
    exitSignal: 'Don\'t sell. This bull runs 18 years. If you MUST exit, Oct 1987 crash is a buying opportunity, not a sell signal.',
    maxLeverage: 'Go all-in on equities. Use margin if you understand the risk. Buy LEAPS (long-term options) once they exist (1990).',
    notableDetails: 'Secular bull market begins. Anyone buying the DJIA in Aug 1982 and holding until 2000 sees 1,400%+ gains.'
  },
  {
    id: 'black-monday',
    date: '1987-10-19',
    year: 1987,
    category: 'Market Crash',
    event: 'Black Monday',
    direction: 'down',
    peakPrice: 'DJIA: 2,746 (Aug 25, 1987)',
    troughPrice: 'DJIA: 1,738 (Oct 19, 1987) — single day drop of 22.6%',
    entrySignal: 'Mid-Oct 1987 — market down ~15% from Aug highs, volatility rising. Buy OTM puts expiring late Oct.',
    exitSignal: 'Close of trading Oct 19, 1987. Or hold puts a few more days — market wobbles another week. Then go LONG — market recovers to new highs by Sept 1989.',
    maxLeverage: 'The single-day % drop is the largest in history. A $10,000 put position returns $50,000-$80,000. Don\'t bet the farm.',
    notableDetails: '-22.6% in ONE DAY. Circuit breakers didn\'t exist yet. Program trading blamed. The crash is 100% tradeable if you know the date.'
  },

  // ── COMMODITIES ───────────────────────────────────────────
  {
    id: 'oil-1973',
    date: '1973-10-17 to 1974-03-18',
    year: 1973,
    category: 'Commodity',
    event: 'OPEC Oil Embargo',
    direction: 'up',
    peakPrice: 'Oil: $3 → $12/barrel',
    entrySignal: 'Oct 6, 1973 — Yom Kippur War begins. Oct 17 — OAPEC announces embargo. Buy oil futures immediately.',
    exitSignal: 'March 18, 1974 — embargo lifted. Sell oil positions. Rotate into depressed US auto stocks (they recover through 1976).',
    maxLeverage: 'Oil futures are volatile. Position size: 10-15% of portfolio.',
    notableDetails: 'Oil quadruples in 6 months. Gas lines in the US. Speed limits reduced to 55 mph. Backlash creates Japanese auto import boom.'
  },
  {
    id: 'oil-1979',
    date: '1979-01 to 1980-04',
    year: 1979,
    category: 'Commodity',
    event: '1979 Oil Crisis (Iranian Revolution)',
    direction: 'up',
    peakPrice: 'Oil: $13 → $39.50/barrel (Apr 1980)',
    entrySignal: 'Jan 16, 1979 — Shah leaves Iran. Buy oil futures. Escalate position as refinery strikes spread.',
    exitSignal: 'Apr 1980 — peak at $39.50. Sell. Oil then enters a 20-year bear market (to $10 by 1986).',
    maxLeverage: 'Start with 15% sizing, scale up to 25% as crisis deepens.',
    notableDetails: 'Second oil shock. Lines at gas stations return. "Odd/even" license plate rationing in some states.'
  },
  {
    id: 'gold-1980',
    date: '1979-07 to 1980-01-21',
    year: 1979,
    category: 'Commodity',
    event: 'Gold Mania',
    direction: 'up',
    peakPrice: 'Gold: $300 → $850/oz (Jan 21, 1980)',
    entrySignal: 'July 1979 — gold breaks above $300. Buy gold futures or mining stocks on the breakout.',
    exitSignal: 'Jan 21, 1980 — gold hits $850 intraday. SELL EVERYTHING. Gold then enters a 20-year bear market (to $250 by 1999).',
    maxLeverage: 'Gold is a fear trade. This is a bubble — exit precisely. Do not "hold for the long term."',
    notableDetails: 'Soviet invasion of Afghanistan + Iran hostage crisis + double-digit inflation. Hunt brothers attempt to corner silver market simultaneously.'
  },
  {
    id: 'silver-thursday',
    date: '1979 to 1980-03-27',
    year: 1980,
    category: 'Commodity',
    event: 'Hunt Brothers Silver Corner (Silver Thursday)',
    direction: 'up',
    peakPrice: 'Silver: $6 → $49.45/oz (Jan 18, 1980)',
    entrySignal: 'Mid-1979 — silver above $10. The Hunt brothers are accumulating aggressively. Ride their coattails.',
    exitSignal: 'Jan 21, 1980 — COMEX changes rules ("liquidation only"). Sell immediately. Silver collapses to $11 by late March.',
    maxLeverage: 'This is the most volatile trade of the decade. Size: 5-10% max. The exit window is NARROW.',
    notableDetails: 'Nelson Bunker Hunt and William Herbert Hunt try to corner the global silver market. COMEX changes rules to break the corner on "Silver Thursday" (Mar 27, 1980).'
  },

  // ── KEY IPOs ──────────────────────────────────────────────
  {
    id: 'apple-ipo',
    date: '1980-12-12',
    year: 1980,
    category: 'IPO',
    event: 'Apple Computer IPO',
    direction: 'up',
    peakPrice: 'IPO: $22/share (split-adjusted: $0.10)',
    troughPrice: '1982 dip: ~$12 pre-split',
    entrySignal: 'Buy at IPO ($22). Add more on any pullback. This is a 40-year compounder.',
    exitSignal: 'NEVER sell all of it. Trim 20% after 10-baggers to recoup initial capital. Let the rest ride.',
    maxLeverage: 'Invest 10-20% of net worth. Stock splits: 4-for-1 (1987), 2-for-1 (2000), 2-for-1 (2005), 7-for-1 (2014), 4-for-1 (2020).',
    notableDetails: 'Largest IPO since Ford (1956). Market cap at IPO: $1.8B. By 2024: $3T+. ~150,000x return if held through all splits. The single best investment a time traveler can make.'
  },
  {
    id: 'microsoft-ipo',
    date: '1986-03-13',
    year: 1986,
    category: 'IPO',
    event: 'Microsoft IPO',
    direction: 'up',
    peakPrice: 'IPO: $21/share (split-adjusted: ~$0.07)',
    troughPrice: '1987 crash dip: ~$14 pre-split',
    entrySignal: 'Buy at IPO. Buy more after Black Monday 1987 when it dips.',
    exitSignal: 'Same rule as Apple — never fully exit. Microsoft goes through 9 splits. $10,000 becomes $50M+ by 2024.',
    maxLeverage: 'Invest 10-20% of net worth. Add 5% more on any 20%+ pullback.',
    notableDetails: 'IPO raises $61M. Gates retains 45% stake. Stock splits: 9 times between 1987 and 2003. Windows 1.0 launched 1985 but the big growth comes with Windows 3.0 (1990) and Windows 95.'
  },
  {
    id: 'walmart-1970',
    date: '1970-10-01',
    year: 1970,
    category: 'IPO',
    event: 'Walmart Goes Public',
    direction: 'up',
    peakPrice: 'IPO: $16.50/share (split-adjusted: ~$0.005)',
    entrySignal: 'Buy at IPO and hold forever. Walmart compounds at ~27% annually for 30 years.',
    exitSignal: 'Do not sell. This is a retirement fund in a single stock.',
    maxLeverage: 'Any amount you can afford to forget about for 20+ years.',
    notableDetails: '38 stores at IPO. By 1990: 1,500+ stores. Stock splits 2-for-1 eleven times between 1971 and 1999. $1,000 invested at IPO = $12M+ by 2024.'
  },
  {
    id: 'genentech-ipo',
    date: '1980-10-14',
    year: 1980,
    category: 'IPO',
    event: 'Genentech IPO (First Biotech IPO)',
    direction: 'up',
    peakPrice: 'IPO: $35/share → $89 on first day',
    entrySignal: 'Buy at IPO. The stock rockets 155% on day one.',
    exitSignal: 'Sell half after the first-day spike. Hold the rest — Roche acquires Genentech in 2009 at $95/share.',
    maxLeverage: 'Modest position (5-10%). Biotech is volatile and unpredictable even with foreknowledge.',
    notableDetails: 'First biotech company to go public. Opens the floodgates for biotech investing. The "first day pop" from $35 to $89 is the trade — capture that and redeploy capital.'
  },

  // ── REAL ESTATE ───────────────────────────────────────────
  {
    id: 'prop-13',
    date: '1978-06-06',
    year: 1978,
    category: 'Real Estate',
    event: 'California Proposition 13 Passes',
    direction: 'up',
    entrySignal: '1975-1978 — buy residential real estate in coastal California (LA, SF, SD) before Prop 13 caps property taxes and triggers a price boom.',
    exitSignal: 'Consider selling in 1989-1990 as the S&L crisis hits CA real estate. But long-term... coastal CA real estate never stops going up.',
    maxLeverage: 'Buy with 20% down. Leverage is your friend in real estate. $50K down on a $250K SF house in 1975 = $2M+ by 2024.',
    notableDetails: 'Prop 13 caps property taxes at 1% of assessed value and limits annual increases to 2%. This makes California real estate uniquely attractive. Buy BEFORE it passes.'
  },
  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    id: 'netscape-ipo',
    date: '1995-08-09',
    year: 1995,
    category: 'IPO',
    event: 'Netscape IPO — Dot-com Boom Catalyst',
    direction: 'up',
    peakPrice: 'Stock: $28 → $75 on first day',
    entrySignal: 'Aug 9, 1995 — Netscape goes public. Buy immediately at listing.',
    exitSignal: 'Late 1995 — stock peaks at $171. Sell into the retail hype before competitors (IE) catch up.',
    maxLeverage: 'High-risk position. Short-term momentum trade only.',
    notableDetails: 'This IPO marks the official birth of the Dot-com bubble. Opens at $71 after pricing at $28, valuing a 16-month-old company at $3B.'
  },
  {
    id: 'amazon-ipo',
    date: '1997-05-15',
    year: 1997,
    category: 'IPO',
    event: 'Amazon.com IPO',
    direction: 'up',
    peakPrice: 'Stock: $18 (split-adjusted $0.075) → $170+ by 2024',
    entrySignal: 'May 15, 1997 — Jeff Bezos takes Amazon public at $18/share. Buy and hold.',
    exitSignal: 'Dec 1999 — peaks at ~$100 (pre-bubble burst). Sell half to protect capital, buy back after the crash in 2001.',
    maxLeverage: 'Establish a major long-term position. The ultimate generational wealth builder.',
    notableDetails: 'Amazon goes public as a simple online bookstore. Survive the dot-com crash to capture a trillion-dollar cloud and e-commerce giant.'
  },
  {
    id: 'asian-crisis-97',
    date: '1997-07-02',
    year: 1997,
    category: 'Market Crash',
    event: 'Asian Financial Crisis',
    direction: 'down',
    peakPrice: 'Baht: 25/USD → 56/USD by Jan 1998',
    entrySignal: 'July 2, 1997 — Thailand floats the Baht. Short Asian currencies, buy USD and put options on Asian indices.',
    exitSignal: 'Mid 1998 — currencies stabilize. IMF intervention provides entry opportunities for cheap regional blue-chips.',
    maxLeverage: 'Currency futures and index puts.',
    notableDetails: 'Tigers of Southeast Asia suffer massive flight of hot money. Begins with Thai Baht collapse and cascades to Korea, Indonesia, and Hong Kong.'
  },
  {
    id: 'dotcom-bubble-burst',
    date: '2000-03-10',
    year: 2000,
    category: 'Market Crash',
    event: 'NASDAQ / Dot-com Bubble Peaks',
    direction: 'down',
    peakPrice: 'NASDAQ: 5,048 → 1,114 by Oct 2002',
    entrySignal: 'March 10, 2000 — NASDAQ hits an all-time high of 5,048. Short dot-com stocks, buy puts on QQQ.',
    exitSignal: 'October 2002 — NASDAQ hits trough of 1,114. Exit shorts, buy high-quality survivors (Amazon, Microsoft, eBay) at 90%+ discounts.',
    maxLeverage: 'Index puts and shorts on unprofitable tech companies.',
    notableDetails: 'The largest asset bubble in recent history bursts, vaporizing $5 trillion in market value. Most dot-com companies go completely bankrupt.'
  },
  {
    id: 'enron-collapse',
    date: '2001-12-02',
    year: 2001,
    category: 'Market Crash',
    event: 'Enron Files for Bankruptcy',
    direction: 'down',
    peakPrice: 'Enron: $90/share → $0.26/share',
    entrySignal: 'Early 2001 — Short Enron as whistleblower Sherron Watkins raises red flags about off-balance-sheet partnerships.',
    exitSignal: 'Dec 2, 2001 — Enron officially files for Chapter 11 bankruptcy. Close short position for maximum profit.',
    maxLeverage: 'Put options on ENE.',
    notableDetails: 'One of America\'s largest energy traders collapses due to systematic, fraudulent mark-to-market accounting. Wipes out Arthur Andersen auditing firm.'
  },
];