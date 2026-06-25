export interface RelocationDestination {
  id: string;
  city: string;
  country: string;
  decade: '1970s' | '1980s' | '1990s' | '2000s';
  costOfLivingIndex: number; // 1-100, lower = cheaper
  qualityOfLifeScore: number; // 1-100, higher = better
  politicalStability: 'Stable' | 'Turbulent' | 'Authoritarian' | 'Transitional';
  highlights: string[]; // 2-3 pros
  cautions: string[]; // 1-2 cons
  bestFor: string[]; // e.g., ['Tech workers', 'Artists', 'Families']
  tags?: string[];
}

export const relocationDestinations: RelocationDestination[] = [
  // ── SAN FRANCISCO — silicon arc from counter-culture to dot-com ────
  {
    id: 'san-francisco-1970s', city: 'San Francisco', country: 'United States', decade: '1970s',
    costOfLivingIndex: 45, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['Counter-culture and arts scene', 'Emerging electronics industry in nearby Silicon Valley', 'Mild climate and bay setting'],
    cautions: ['Rising housing costs', 'Earthquake risk'],
    bestFor: ['Artists', 'Engineers', 'Counterculture seekers'],
    tags: ['tech', 'culture', 'coastal'],
  },
  {
    id: 'san-francisco-1980s', city: 'San Francisco', country: 'United States', decade: '1980s',
    costOfLivingIndex: 55, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Personal-computer revolution underway', 'Strong venture-capital network', 'Vibrant LGBTQ+ community'],
    cautions: ['Housing affordability declining', 'AIDS crisis impacting the city'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Artists'],
    tags: ['tech', 'culture', 'coastal'],
  },
  {
    id: 'san-francisco-1990s', city: 'San Francisco', country: 'United States', decade: '1990s',
    costOfLivingIndex: 65, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['Dot-com boom creating wealth and jobs', 'World-leading internet and software firms', 'Cosmopolitan dining and culture'],
    cautions: ['Severe housing-cost inflation', 'Growing income inequality'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Investors'],
    tags: ['tech', 'dotcom', 'coastal'],
  },
  {
    id: 'san-francisco-2000s', city: 'San Francisco', country: 'United States', decade: '2000s',
    costOfLivingIndex: 75, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Recovery and Web 2.0 growth after the dot-com bust', 'Concentration of top-tier tech employers', 'Strong cultural and outdoor amenities'],
    cautions: ['Among the highest housing costs in the US', 'Traffic and congestion'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Investors'],
    tags: ['tech', 'web2', 'coastal'],
  },

  // ── TOKYO — miracle economy, bubble, and aftermath ────
  {
    id: 'tokyo-1970s', city: 'Tokyo', country: 'Japan', decade: '1970s',
    costOfLivingIndex: 50, qualityOfLifeScore: 75, politicalStability: 'Stable',
    highlights: ['High-speed Shinkansen and infrastructure', 'Booming electronics and auto exports', 'Exceptional public safety'],
    cautions: ['Dense living conditions', 'Language barrier for newcomers'],
    bestFor: ['Corporate professionals', 'Engineers', 'Families'],
    tags: ['asia', 'economic-miracle', 'metropolis'],
  },
  {
    id: 'tokyo-1980s', city: 'Tokyo', country: 'Japan', decade: '1980s',
    costOfLivingIndex: 75, qualityOfLifeScore: 82, politicalStability: 'Stable',
    highlights: ['Asset-price boom and rising global influence', 'Cutting-edge consumer technology', 'World-class transit and cuisine'],
    cautions: ['Among the most expensive cities on earth', 'Intense corporate work culture'],
    bestFor: ['Corporate professionals', 'Finance workers', 'Engineers'],
    tags: ['asia', 'bubble-economy', 'metropolis'],
  },
  {
    id: 'tokyo-1990s', city: 'Tokyo', country: 'Japan', decade: '1990s',
    costOfLivingIndex: 80, qualityOfLifeScore: 80, politicalStability: 'Stable',
    highlights: ['Still among the safest and cleanest cities globally', 'High-quality healthcare and education', 'Cultural exports gaining global fans'],
    cautions: ['Post-bubble economic stagnation ("Lost Decade")', 'Persistently high cost of living'],
    bestFor: ['Families', 'Corporate professionals', 'Artists'],
    tags: ['asia', 'lost-decade', 'metropolis'],
  },
  {
    id: 'tokyo-2000s', city: 'Tokyo', country: 'Japan', decade: '2000s',
    costOfLivingIndex: 82, qualityOfLifeScore: 81, politicalStability: 'Stable',
    highlights: ['Mobile and gaming technology leadership', 'Rich pop-culture and design scene', 'Reliable infrastructure and safety'],
    cautions: ['High cost of living', 'Aging population pressures'],
    bestFor: ['Tech workers', 'Families', 'Artists'],
    tags: ['asia', 'metropolis', 'pop-culture'],
  },

  // ── MUNICH — Wirtschaftswunder stability ────
  {
    id: 'munich-1970s', city: 'Munich', country: 'West Germany', decade: '1970s',
    costOfLivingIndex: 50, qualityOfLifeScore: 78, politicalStability: 'Stable',
    highlights: ['Strong industrial and engineering base (BMW, Siemens)', 'Olympic-modernized infrastructure', 'Proximity to Alps and recreation'],
    cautions: ['High taxes relative to peers', 'Cold winters'],
    bestFor: ['Engineers', 'Families', 'Corporate professionals'],
    tags: ['europe', 'engineering', 'stable'],
  },
  {
    id: 'munich-1980s', city: 'Munich', country: 'West Germany', decade: '1980s',
    costOfLivingIndex: 55, qualityOfLifeScore: 80, politicalStability: 'Stable',
    highlights: ['Thriving high-tech and precision-engineering sector', 'Strong social safety net', 'Cultural richness and beer-hall tradition'],
    cautions: ['Expensive housing market', 'Bureaucracy for expats'],
    bestFor: ['Engineers', 'Families', 'Researchers'],
    tags: ['europe', 'engineering', 'stable'],
  },
  {
    id: 'munich-1990s', city: 'Munich', country: 'Germany', decade: '1990s',
    costOfLivingIndex: 60, qualityOfLifeScore: 82, politicalStability: 'Stable',
    highlights: ['Gateway to newly open Eastern European markets', 'Top-ranked universities and research institutes', 'High environmental and civic standards'],
    cautions: ['Post-reunification economic adjustment', 'High cost of living'],
    bestFor: ['Engineers', 'Families', 'Entrepreneurs'],
    tags: ['europe', 'engineering', 'stable'],
  },
  {
    id: 'munich-2000s', city: 'Munich', country: 'Germany', decade: '2000s',
    costOfLivingIndex: 62, qualityOfLifeScore: 83, politicalStability: 'Stable',
    highlights: ['Europe\'s strong tech and biotech cluster', 'Excellent public services and healthcare', 'High disposable safety and quality'],
    cautions: ['Tight rental housing market', 'High taxes'],
    bestFor: ['Engineers', 'Families', 'Researchers'],
    tags: ['europe', 'engineering', 'stable'],
  },

  // ── SINGAPORE — Asian tiger city-state ────
  {
    id: 'singapore-1970s', city: 'Singapore', country: 'Singapore', decade: '1970s',
    costOfLivingIndex: 35, qualityOfLifeScore: 65, politicalStability: 'Stable',
    highlights: ['Rapid industrialization and foreign investment', 'Strategic port and trade hub', 'Public housing (HDB) roll-out improving living standards'],
    cautions: ['Strict laws and social controls', 'Hot, humid climate'],
    bestFor: ['Entrepreneurs', 'Trade professionals', 'Families'],
    tags: ['asia', 'tiger-economy', 'port'],
  },
  {
    id: 'singapore-1980s', city: 'Singapore', country: 'Singapore', decade: '1980s',
    costOfLivingIndex: 50, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['Finance and electronics manufacturing surging', 'Clean, efficient, and safe urban environment', 'English widely used in business'],
    cautions: ['Cost of living rising quickly', 'Controlled political environment'],
    bestFor: ['Finance workers', 'Engineers', 'Families'],
    tags: ['asia', 'tiger-economy', 'finance'],
  },
  {
    id: 'singapore-1990s', city: 'Singapore', country: 'Singapore', decade: '1990s',
    costOfLivingIndex: 60, qualityOfLifeScore: 80, politicalStability: 'Stable',
    highlights: ['Premier regional financial and logistics hub', 'World-class Changi Airport and transit', 'Strong schools and healthcare'],
    cautions: ['High cost of housing and cars', 'Restrictive social regulations'],
    bestFor: ['Finance workers', 'Corporate professionals', 'Families'],
    tags: ['asia', 'finance', 'hub'],
  },
  {
    id: 'singapore-2000s', city: 'Singapore', country: 'Singapore', decade: '2000s',
    costOfLivingIndex: 65, qualityOfLifeScore: 82, politicalStability: 'Stable',
    highlights: ['Biomedical and tech diversification', 'Open, low-corruption business environment', 'Excellent safety and public services'],
    cautions: ['One of the most expensive cities worldwide', 'Dependent on foreign labor and trade'],
    bestFor: ['Entrepreneurs', 'Finance workers', 'Families'],
    tags: ['asia', 'finance', 'hub'],
  },

  // ── BANGALORE — India's IT emergence and boom ────
  {
    id: 'bangalore-1980s', city: 'Bangalore', country: 'India', decade: '1980s',
    costOfLivingIndex: 20, qualityOfLifeScore: 48, politicalStability: 'Stable',
    highlights: ['Texas Instruments and early software firms arriving', 'Pleasant plateau climate', 'Low cost of living'],
    cautions: ['Limited modern infrastructure', 'Power and telecom shortages'],
    bestFor: ['Engineers', 'Entrepreneurs', 'Researchers'],
    tags: ['asia', 'it-emergence', 'low-cost'],
  },
  {
    id: 'bangalore-1990s', city: 'Bangalore', country: 'India', decade: '1990s',
    costOfLivingIndex: 25, qualityOfLifeScore: 55, politicalStability: 'Stable',
    highlights: ['Y2K outsourcing boom fueling IT services growth', 'Affordable skilled technical workforce', 'Education hub with strong engineering colleges'],
    cautions: ['Traffic and inadequate roads', 'Pollution rising'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Engineers'],
    tags: ['asia', 'it-boom', 'outsourcing'],
  },
  {
    id: 'bangalore-2000s', city: 'Bangalore', country: 'India', decade: '2000s',
    costOfLivingIndex: 30, qualityOfLifeScore: 60, politicalStability: 'Stable',
    highlights: ['"India\'s Silicon Valley" with global tech campuses', 'Low cost relative to Western hubs', 'Young, cosmopolitan workforce'],
    cautions: ['Severe traffic congestion', 'Strain on water and power infrastructure'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Engineers'],
    tags: ['asia', 'it-boom', 'silicon-valley-of-india'],
  },

  // ── HONG KONG — handover era ────
  {
    id: 'hong-kong-1980s', city: 'Hong Kong', country: 'Hong Kong (UK)', decade: '1980s',
    costOfLivingIndex: 55, qualityOfLifeScore: 68, politicalStability: 'Transitional',
    highlights: ['Booming manufacturing and financial services', 'Low taxes and free-port trade', 'Gateway to mainland China'],
    cautions: ['1984 Sino-British Joint Declaration creating uncertainty', 'Extremely dense housing'],
    bestFor: ['Finance workers', 'Entrepreneurs', 'Trade professionals'],
    tags: ['asia', 'finance', 'handover'],
  },
  {
    id: 'hong-kong-1990s', city: 'Hong Kong', country: 'Hong Kong (UK/PRC)', decade: '1990s',
    costOfLivingIndex: 70, qualityOfLifeScore: 72, politicalStability: 'Transitional',
    highlights: ['Major global financial center', '1997 handover under "one country, two systems"', 'Low crime and efficient transit'],
    cautions: ['1997 Asian financial crisis hit markets', 'High cost of housing'],
    bestFor: ['Finance workers', 'Corporate professionals', 'Entrepreneurs'],
    tags: ['asia', 'finance', 'handover'],
  },
  {
    id: 'hong-kong-2000s', city: 'Hong Kong', country: 'Hong Kong (PRC)', decade: '2000s',
    costOfLivingIndex: 75, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['Asian financial and logistics hub', 'Low taxation and business-friendly regime', 'Vibrant culinary and retail scene'],
    cautions: ['Very expensive real estate', 'Air quality concerns'],
    bestFor: ['Finance workers', 'Entrepreneurs', 'Corporate professionals'],
    tags: ['asia', 'finance', 'hub'],
  },

  // ── DUBAI — construction and trade boom ────
  {
    id: 'dubai-1980s', city: 'Dubai', country: 'United Arab Emirates', decade: '1980s',
    costOfLivingIndex: 45, qualityOfLifeScore: 58, politicalStability: 'Stable',
    highlights: ['Jebel Ali free zone driving trade', 'Tax-free earnings for expatriates', 'Emerging modern infrastructure'],
    cautions: ['Harsh summer heat', 'Limited pathways to citizenship'],
    bestFor: ['Trade professionals', 'Construction workers', 'Entrepreneurs'],
    tags: ['middle-east', 'trade', 'tax-free'],
  },
  {
    id: 'dubai-1990s', city: 'Dubai', country: 'United Arab Emirates', decade: '1990s',
    costOfLivingIndex: 55, qualityOfLifeScore: 66, politicalStability: 'Stable',
    highlights: ['Diversification into tourism and logistics', 'Tax-free income and luxury lifestyle', 'Safe, low-crime environment'],
    cautions: ['Dependent on expatriate labor', 'Authoritarian governance with limited political voice'],
    bestFor: ['Entrepreneurs', 'Corporate professionals', 'Trade professionals'],
    tags: ['middle-east', 'diversification', 'tax-free'],
  },
  {
    id: 'dubai-2000s', city: 'Dubai', country: 'United Arab Emirates', decade: '2000s',
    costOfLivingIndex: 60, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Iconic construction boom (Burj Al Arab, Palm Jumeirah)', 'Zero income tax and global connectivity', 'Cosmopolitan expatriate community'],
    cautions: ['High cost of housing and schooling', 'Debt-fueled property market vulnerability'],
    bestFor: ['Entrepreneurs', 'Finance workers', 'Construction professionals'],
    tags: ['middle-east', 'construction-boom', 'tax-free'],
  },

  // ── PRAGUE — post-communist boom ────
  {
    id: 'prague-1990s', city: 'Prague', country: 'Czech Republic', decade: '1990s',
    costOfLivingIndex: 30, qualityOfLifeScore: 68, politicalStability: 'Transitional',
    highlights: ['Velvet Revolution opening markets and culture', 'Beautiful historic architecture attracting tourism', 'Affordable living in a European capital'],
    cautions: ['Privatization and economic restructuring pains', '1993 Czechoslovakia split causing uncertainty'],
    bestFor: ['Artists', 'Entrepreneurs', 'Writers'],
    tags: ['europe', 'post-communist', 'affordable'],
  },
  {
    id: 'prague-2000s', city: 'Prague', country: 'Czech Republic', decade: '2000s',
    costOfLivingIndex: 40, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['2004 EU accession opening trade and travel', 'Growing tech and services sector', 'High safety and cultural richness'],
    cautions: ['Wages still below Western European levels', 'Rising cost of living in the center'],
    bestFor: ['Artists', 'Entrepreneurs', 'Tech workers'],
    tags: ['europe', 'eu-member', 'culture'],
  },

  // ── SÃO PAULO — Brazilian miracle and cycles ────
  {
    id: 'sao-paulo-1970s', city: 'São Paulo', country: 'Brazil', decade: '1970s',
    costOfLivingIndex: 30, qualityOfLifeScore: 55, politicalStability: 'Authoritarian',
    highlights: ['"Brazilian Miracle" double-digit growth', 'Industrial and financial powerhouse of Latin America', 'Dynamic cultural and culinary scene'],
    cautions: ['Military dictatorship limiting civil liberties', 'High inequality and crime'],
    bestFor: ['Entrepreneurs', 'Industrial workers', 'Corporate professionals'],
    tags: ['south-america', 'economic-miracle', 'industry'],
  },
  {
    id: 'sao-paulo-1980s', city: 'São Paulo', country: 'Brazil', decade: '1980s',
    costOfLivingIndex: 45, qualityOfLifeScore: 50, politicalStability: 'Transitional',
    highlights: ['Abertura democratic opening underway', 'Largest business hub in South America', 'Rich diversity and nightlife'],
    cautions: ['Hyperinflation eroding living standards', 'Rising crime and inequality'],
    bestFor: ['Entrepreneurs', 'Artists', 'Corporate professionals'],
    tags: ['south-america', 'democratization', 'inflation'],
  },
  {
    id: 'sao-paulo-1990s', city: 'São Paulo', country: 'Brazil', decade: '1990s',
    costOfLivingIndex: 40, qualityOfLifeScore: 58, politicalStability: 'Stable',
    highlights: ['1994 Plano Real taming inflation', 'Modernizing financial and services sectors', 'Democratic stability restored'],
    cautions: ['Persistent wealth inequality', 'Traffic and pollution'],
    bestFor: ['Entrepreneurs', 'Finance workers', 'Corporate professionals'],
    tags: ['south-america', 'stabilization', 'finance'],
  },
  {
    id: 'sao-paulo-2000s', city: 'São Paulo', country: 'Brazil', decade: '2000s',
    costOfLivingIndex: 45, qualityOfLifeScore: 64, politicalStability: 'Stable',
    highlights: ['Commodity boom lifting incomes and investment', 'Expanding middle class', 'Vibrant arts, food, and business culture'],
    cautions: ['High crime in parts of the metro', 'Infrastructure lagging growth'],
    bestFor: ['Entrepreneurs', 'Finance workers', 'Corporate professionals'],
    tags: ['south-america', 'commodity-boom', 'finance'],
  },

  // ── SHANGHAI — WTO-era takeoff ────
  {
    id: 'shanghai-1990s', city: 'Shanghai', country: 'China', decade: '1990s',
    costOfLivingIndex: 25, qualityOfLifeScore: 55, politicalStability: 'Authoritarian',
    highlights: ['Pudong development zone transforming the city', 'Foreign investment and joint ventures expanding', 'Low cost of living for expatriates'],
    cautions: ['One-party state with restricted freedoms', 'Pollution and rapid urban strain'],
    bestFor: ['Entrepreneurs', 'Manufacturing professionals', 'Adventurous expatriates'],
    tags: ['asia', 'reform-era', 'manufacturing'],
  },
  {
    id: 'shanghai-2000s', city: 'Shanghai', country: 'China', decade: '2000s',
    costOfLivingIndex: 35, qualityOfLifeScore: 64, politicalStability: 'Authoritarian',
    highlights: ['2001 WTO entry accelerating export growth', 'Skyscraper and infrastructure boom', 'Rising financial-services sector'],
    cautions: ['Internet censorship and speech restrictions', 'Air and water pollution'],
    bestFor: ['Entrepreneurs', 'Corporate professionals', 'Manufacturing professionals'],
    tags: ['asia', 'wto-era', 'finance'],
  },

  // ── SEOUL — Korean miracle to hallyu ────
  {
    id: 'seoul-1970s', city: 'Seoul', country: 'South Korea', decade: '1970s',
    costOfLivingIndex: 25, qualityOfLifeScore: 52, politicalStability: 'Authoritarian',
    highlights: ['Export-led industrialization ("Miracle on the Han River")', 'Rapid urban modernization', 'Strong education system'],
    cautions: ['Authoritarian military rule', 'Poverty still widespread in places'],
    bestFor: ['Industrial workers', 'Engineers', 'Entrepreneurs'],
    tags: ['asia', 'economic-miracle', 'industrialization'],
  },
  {
    id: 'seoul-1980s', city: 'Seoul', country: 'South Korea', decade: '1980s',
    costOfLivingIndex: 35, qualityOfLifeScore: 60, politicalStability: 'Transitional',
    highlights: ['1987 democratization opening society', 'Rising electronics and auto industries', '1988 Olympics boosting global profile'],
    cautions: ['Political unrest during transition', 'Intense education and work pressure'],
    bestFor: ['Engineers', 'Entrepreneurs', 'Students'],
    tags: ['asia', 'democratization', 'olympics'],
  },
  {
    id: 'seoul-1990s', city: 'Seoul', country: 'South Korea', decade: '1990s',
    costOfLivingIndex: 50, qualityOfLifeScore: 68, politicalStability: 'Stable',
    highlights: ['High-speed internet and broadband leadership', 'Joining the OECD advanced-economy ranks', 'Dynamic pop culture and design'],
    cautions: ['1997 Asian financial crisis shock', 'High cost of housing'],
    bestFor: ['Tech workers', 'Engineers', 'Entrepreneurs'],
    tags: ['asia', 'broadband', 'oecd'],
  },
  {
    id: 'seoul-2000s', city: 'Seoul', country: 'South Korea', decade: '2000s',
    costOfLivingIndex: 55, qualityOfLifeScore: 73, politicalStability: 'Stable',
    highlights: ['Korean Wave (hallyu) exporting music, drama, and film', 'Advanced digital infrastructure', 'World-class transit and safety'],
    cautions: ['Competitive job and housing markets', 'Aging population beginning'],
    bestFor: ['Tech workers', 'Artists', 'Entrepreneurs'],
    tags: ['asia', 'hallyu', 'digital'],
  },

  // ── DUBLIN — Celtic Tiger arc ────
  {
    id: 'dublin-1980s', city: 'Dublin', country: 'Ireland', decade: '1980s',
    costOfLivingIndex: 45, qualityOfLifeScore: 55, politicalStability: 'Stable',
    highlights: ['English-speaking EU member', 'Rich literary and musical heritage', 'Low corporate tax beginning to attract FDI'],
    cautions: ['High unemployment and emigration', 'Economic recession'],
    bestFor: ['Writers', 'Artists', 'Entrepreneurs'],
    tags: ['europe', 'pre-celtic-tiger', 'english-speaking'],
  },
  {
    id: 'dublin-1990s', city: 'Dublin', country: 'Ireland', decade: '1990s',
    costOfLivingIndex: 55, qualityOfLifeScore: 68, politicalStability: 'Stable',
    highlights: ['Celtic Tiger boom in software and pharma', 'Low corporate tax drawing multinationals', 'Young, educated workforce'],
    cautions: ['Cost of living rising fast', 'Infrastructure catching up to growth'],
    bestFor: ['Tech workers', 'Pharma professionals', 'Entrepreneurs'],
    tags: ['europe', 'celtic-tiger', 'fdi'],
  },
  {
    id: 'dublin-2000s', city: 'Dublin', country: 'Ireland', decade: '2000s',
    costOfLivingIndex: 60, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['European headquarters hub for US tech giants', 'Eurozone membership easing trade', 'Vibrant startup scene'],
    cautions: ['Housing affordability crisis', 'Property bubble risks'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Finance workers'],
    tags: ['europe', 'celtic-tiger', 'tech-hub'],
  },

  // ── TALLINN — digital-first post-Soviet success ────
  {
    id: 'tallinn-1990s', city: 'Tallinn', country: 'Estonia', decade: '1990s',
    costOfLivingIndex: 25, qualityOfLifeScore: 58, politicalStability: 'Transitional',
    highlights: ['1991 independence and rapid market reforms', 'Early internet and digital-government adoption', 'Affordable medieval-meets-modern capital'],
    cautions: ['Post-Soviet economic restructuring', 'Limited domestic industry'],
    bestFor: ['Entrepreneurs', 'Tech workers', 'Adventurous expatriates'],
    tags: ['europe', 'post-soviet', 'digital'],
  },
  {
    id: 'tallinn-2000s', city: 'Tallinn', country: 'Estonia', decade: '2000s',
    costOfLivingIndex: 30, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['Skype born here; e-residency and e-government pioneers', '2004 EU and NATO membership', 'Low bureaucracy and flat tax'],
    cautions: ['Small domestic market', 'Wages below Western European average'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Digital nomads'],
    tags: ['europe', 'eu-member', 'digital'],
  },

  // ── TEHRAN — pre-revolution prosperity ────
  {
    id: 'tehran-1970s', city: 'Tehran', country: 'Iran', decade: '1970s',
    costOfLivingIndex: 30, qualityOfLifeScore: 60, politicalStability: 'Turbulent',
    highlights: ['Oil-revenue-fueled modernization and growth', 'Cosmopolitan middle-class culture', 'Expanding universities and industry'],
    cautions: ['1979 revolution ending the Pahlavi era', 'Political unrest escalating through the decade'],
    bestFor: ['Oil-industry professionals', 'Entrepreneurs', 'Students'],
    tags: ['middle-east', 'oil-boom', 'pre-revolution'],
  },

  // ── BERLIN — divided, then reunified ────
  {
    id: 'berlin-1970s', city: 'Berlin', country: 'West Germany', decade: '1970s',
    costOfLivingIndex: 50, qualityOfLifeScore: 66, politicalStability: 'Stable',
    highlights: ['West Berlin subsidized island of freedom behind the Wall', 'Vibrant arts and counterculture scene', 'Generous public support for residents'],
    cautions: ['Physically divided city; Cold War tension', 'Isolated location and restricted movement'],
    bestFor: ['Artists', 'Students', 'Counterculture seekers'],
    tags: ['europe', 'cold-war', 'divided-city'],
  },
  {
    id: 'berlin-1990s', city: 'Berlin', country: 'Germany', decade: '1990s',
    costOfLivingIndex: 48, qualityOfLifeScore: 72, politicalStability: 'Transitional',
    highlights: ['1989 Wall fall and 1990 reunification reopening the city', 'Bohemian and techno-cultural explosion', 'Cheap rents drawing artists and startups'],
    cautions: ['Massive costs of reunification', 'High unemployment in former East Berlin'],
    bestFor: ['Artists', 'Entrepreneurs', 'Students'],
    tags: ['europe', 'reunification', 'culture'],
  },
  {
    id: 'berlin-2000s', city: 'Berlin', country: 'Germany', decade: '2000s',
    costOfLivingIndex: 50, qualityOfLifeScore: 76, politicalStability: 'Stable',
    highlights: ['Growing startup and creative-tech ecosystem', 'Capital restored as seat of government', 'Affordable living among major European capitals'],
    cautions: ['Public debt and slow wage growth', 'Gentrification displacing long-time residents'],
    bestFor: ['Artists', 'Entrepreneurs', 'Tech workers'],
    tags: ['europe', 'startup', 'creative'],
  },

  // ── BARCELONA — Olympics-led boom ────
  {
    id: 'barcelona-1990s', city: 'Barcelona', country: 'Spain', decade: '1990s',
    costOfLivingIndex: 40, qualityOfLifeScore: 75, politicalStability: 'Stable',
    highlights: ['1992 Olympics transforming waterfront and infrastructure', 'Mediterranean climate and beachside living', 'Design, food, and architectural renaissance'],
    cautions: ['Rising tourism pressure', 'Post-Olympic economic adjustment'],
    bestFor: ['Artists', 'Entrepreneurs', 'Families'],
    tags: ['europe', 'olympics', 'mediterranean'],
  },
];
