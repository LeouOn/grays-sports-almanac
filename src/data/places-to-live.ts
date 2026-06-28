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

  // ── KUALA LUMPUR — tiger-cub emerging market ────
  {
    id: 'kuala-lumpur-1990s', city: 'Kuala Lumpur', country: 'Malaysia', decade: '1990s',
    costOfLivingIndex: 28, qualityOfLifeScore: 60, politicalStability: 'Stable',
    highlights: ['Petronas Twins under construction, signaling national ambition', 'Multicultural Malay-Chinese-Indian culture', 'English widely spoken'],
    cautions: ['Tropical heat and humidity year-round', 'Restricted press freedoms'],
    bestFor: ['Entrepreneurs', 'Corporate professionals', 'Oil and gas workers'],
    tags: ['asia', 'emerging-market', 'multicultural'],
  },
  {
    id: 'kuala-lumpur-2000s', city: 'Kuala Lumpur', country: 'Malaysia', decade: '2000s',
    costOfLivingIndex: 35, qualityOfLifeScore: 66, politicalStability: 'Stable',
    highlights: ['Modern transit (LRT, KLIA Ekspres) and infrastructure', 'Low cost of living relative to income', 'Booming Islamic finance and halal hub'],
    cautions: ['Uneven air quality and haze from regional fires', 'Relatively low wage levels for skilled work'],
    bestFor: ['Entrepreneurs', 'Corporate professionals', 'Families'],
    tags: ['asia', 'infrastructure', 'islamic-finance'],
  },

  // ── BANGKOK — Southeast Asian hub ────
  {
    id: 'bangkok-1980s', city: 'Bangkok', country: 'Thailand', decade: '1980s',
    costOfLivingIndex: 25, qualityOfLifeScore: 52, politicalStability: 'Stable',
    highlights: ['Booming tourism and manufacturing base', 'Very low cost of living', 'Cosmopolitan expatriate scene forming'],
    cautions: ['Traffic and pollution already severe', 'Occasional military coups'],
    bestFor: ['Entrepreneurs', 'English teachers', 'Hospitality workers'],
    tags: ['asia', 'asean', 'low-cost'],
  },
  {
    id: 'bangkok-1990s', city: 'Bangkok', country: 'Thailand', decade: '1990s',
    costOfLivingIndex: 30, qualityOfLifeScore: 60, politicalStability: 'Stable',
    highlights: ['Asian-boom financial and manufacturing hub', 'World-class street food at low prices', '1997 crisis creating distressed-asset opportunities'],
    cautions: ['1997 Asian financial crisis severe disruption', 'Notorious traffic and flooding'],
    bestFor: ['Entrepreneurs', 'Investors', 'Hospitality workers'],
    tags: ['asia', 'financial-hub', 'crisis-recovery'],
  },

  // ── MUMBAI/BOMBAY — India commercial capital ────
  {
    id: 'mumbai-1990s', city: 'Mumbai (Bombay)', country: 'India', decade: '1990s',
    costOfLivingIndex: 25, qualityOfLifeScore: 50, politicalStability: 'Stable',
    highlights: ['1991 liberalization sparking financial-services growth', 'Bollywood and media industries expanding', 'Stock exchange and corporate HQs'],
    cautions: ['Extreme density and infrastructure strain', 'Communal tensions occasionally flaring'],
    bestFor: ['Finance workers', 'Media professionals', 'Entrepreneurs'],
    tags: ['asia', 'liberalization', 'finance'],
  },
  {
    id: 'mumbai-2000s', city: 'Mumbai', country: 'India', decade: '2000s',
    costOfLivingIndex: 35, qualityOfLifeScore: 58, politicalStability: 'Stable',
    highlights: ['Outsourcing and financial-services boom', 'New suburban metro rail easing commutes', 'Global capital flowing into real estate'],
    cautions: ['Among the most expensive real estate in Asia', 'Severe traffic and 2008 terror attacks'],
    bestFor: ['Finance workers', 'Entrepreneurs', 'Tech workers'],
    tags: ['asia', 'finance', 'outsourcing'],
  },

  // ── TAIPEI — Taiwanese tiger ────
  {
    id: 'taipei-1980s', city: 'Taipei', country: 'Taiwan', decade: '1980s',
    costOfLivingIndex: 35, qualityOfLifeScore: 62, politicalStability: 'Transitional',
    highlights: ['Martial law lifted in 1987, opening politics', 'Surging electronics and PC manufacturing', 'Affordable, safe city with strong food scene'],
    cautions: ['Air quality declining from rapid industrial growth', 'Cross-strait tensions with Beijing'],
    bestFor: ['Engineers', 'Manufacturing professionals', 'Entrepreneurs'],
    tags: ['asia', 'tiger-economy', 'democratization'],
  },
  {
    id: 'taipei-1990s', city: 'Taipei', country: 'Taiwan', decade: '1990s',
    costOfLivingIndex: 45, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['First direct presidential election in 1996', 'World-leading semiconductor and PC industries', 'Modern metro (MRT) under construction'],
    cautions: ['High cost of housing', 'Traffic congestion in older districts'],
    bestFor: ['Engineers', 'Entrepreneurs', 'Tech workers'],
    tags: ['asia', 'semiconductor', 'democracy'],
  },

  // ── LISBON — Carnation Revolution aftermath ────
  {
    id: 'lisbon-1970s', city: 'Lisbon', country: 'Portugal', decade: '1970s',
    costOfLivingIndex: 25, qualityOfLifeScore: 52, politicalStability: 'Turbulent',
    highlights: ['1974 Carnation Revolution ending dictatorship', 'Decolonization opening new cultural ties', 'Cheap, sun-drenched, Atlantic capital'],
    cautions: ['Revolutionary upheaval and land-reform chaos', 'Economic dislocation and high emigration'],
    bestFor: ['Writers', 'Artists', 'Adventurous expatriates'],
    tags: ['europe', 'post-revolution', 'affordable'],
  },
  {
    id: 'lisbon-1990s', city: 'Lisbon', country: 'Portugal', decade: '1990s',
    costOfLivingIndex: 35, qualityOfLifeScore: 65, politicalStability: 'Stable',
    highlights: ['EU membership funding infrastructure modernization', '1998 Expo bringing urban renewal', 'Mild climate, low costs, and safety'],
    cautions: ['Economy growing more slowly than northern Europe', 'Limited domestic job market'],
    bestFor: ['Retirees', 'Artists', 'Families'],
    tags: ['europe', 'eu-member', 'expo-renewal'],
  },

  // ── WARSAW — post-communist transformation ────
  {
    id: 'warsaw-1990s', city: 'Warsaw', country: 'Poland', decade: '1990s',
    costOfLivingIndex: 25, qualityOfLifeScore: 55, politicalStability: 'Transitional',
    highlights: ['Shock-therapy market reforms underway', 'Rebuilt Old Town gaining cultural energy', 'Very low cost of living for a European capital'],
    cautions: ['High unemployment during transition', 'Heavy pollution from legacy industry'],
    bestFor: ['Entrepreneurs', 'Investors', 'Adventurous expatriates'],
    tags: ['europe', 'post-communist', 'transition'],
  },
  {
    id: 'warsaw-2000s', city: 'Warsaw', country: 'Poland', decade: '2000s',
    costOfLivingIndex: 35, qualityOfLifeScore: 66, politicalStability: 'Stable',
    highlights: ['2004 EU accession accelerating growth', 'Becoming a major BPO and shared-services hub', 'Modern shopping, dining, and transport infrastructure'],
    cautions: ['Wages still below Western European levels', 'Brain drain of young professionals'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Corporate professionals'],
    tags: ['europe', 'eu-member', 'bpo'],
  },

  // ── BUDAPEST — Danube metropolis ────
  {
    id: 'budapest-1990s', city: 'Budapest', country: 'Hungary', decade: '1990s',
    costOfLivingIndex: 28, qualityOfLifeScore: 58, politicalStability: 'Transitional',
    highlights: ['Post-Communist privatization creating opportunities', 'Stunning architecture along the Danube', 'Thermal baths and café culture'],
    cautions: ['Inflation during economic transition', 'Corruption in early privatization'],
    bestFor: ['Entrepreneurs', 'Artists', 'Investors'],
    tags: ['europe', 'post-communist', 'thermal-baths'],
  },
  {
    id: 'budapest-2000s', city: 'Budapest', country: 'Hungary', decade: '2000s',
    costOfLivingIndex: 38, qualityOfLifeScore: 68, politicalStability: 'Stable',
    highlights: ['2004 EU membership opening markets', 'Growing automotive and IT sectors', 'Affordable European lifestyle with strong culture'],
    cautions: ['Political polarization', 'Wages lagging behind cost of living'],
    bestFor: ['Entrepreneurs', 'Tech workers', 'Artists'],
    tags: ['europe', 'eu-member', 'automotive'],
  },

  // ── VIENNA — imperial stability ────
  {
    id: 'vienna-1970s', city: 'Vienna', country: 'Austria', decade: '1970s',
    costOfLivingIndex: 48, qualityOfLifeScore: 76, politicalStability: 'Stable',
    highlights: ['UN and OPEC agencies making it a diplomatic hub', 'Outstanding classical music and opera', 'High-quality public housing and transit'],
    cautions: ['Conservative social atmosphere', 'High taxes'],
    bestFor: ['Diplomats', 'Families', 'Musicians'],
    tags: ['europe', 'diplomacy', 'culture'],
  },
  {
    id: 'vienna-1980s', city: 'Vienna', country: 'Austria', decade: '1980s',
    costOfLivingIndex: 52, qualityOfLifeScore: 80, politicalStability: 'Stable',
    highlights: ['Vienna UN headquarters expanding international presence', 'Neutral ground bridging East and West', 'World-class healthcare and education'],
    cautions: ['Expensive relative to southern Europe', 'Restrictive shopping hours and bureaucracy'],
    bestFor: ['Diplomats', 'Families', 'Corporate professionals'],
    tags: ['europe', 'neutrality', 'diplomacy'],
  },

  // ── ZURICH — Alpine finance ────
  {
    id: 'zurich-1980s', city: 'Zurich', country: 'Switzerland', decade: '1980s',
    costOfLivingIndex: 70, qualityOfLifeScore: 82, politicalStability: 'Stable',
    highlights: ['Global private-banking capital', 'Lake and Alps within commuting distance', 'High wages and impeccable infrastructure'],
    cautions: ['Among the most expensive cities on Earth', 'Strict foreign-residency regulations'],
    bestFor: ['Finance workers', 'Corporate professionals', 'Families'],
    tags: ['europe', 'finance', 'alpine'],
  },
  {
    id: 'zurich-1990s', city: 'Zurich', country: 'Switzerland', decade: '1990s',
    costOfLivingIndex: 75, qualityOfLifeScore: 85, politicalStability: 'Stable',
    highlights: ['Swiss banking attracting global capital', 'Highest quality-of-life rankings worldwide', 'Multilingual, well-connected European location'],
    cautions: ['Cost of living exceptionally high', 'Difficulty integrating for outsiders'],
    bestFor: ['Finance workers', 'Researchers', 'Corporate professionals'],
    tags: ['europe', 'banking', 'high-qol'],
  },

  // ── COPENHAGEN — Scandinavian welfare model ────
  {
    id: 'copenhagen-1970s', city: 'Copenhagen', country: 'Denmark', decade: '1970s',
    costOfLivingIndex: 50, qualityOfLifeScore: 75, politicalStability: 'Stable',
    highlights: ['Strong welfare state and workers\' rights', 'Bicycle-first urban planning pioneering', 'Design, architecture, and food culture'],
    cautions: ['High taxes', 'Cold, dark winters'],
    bestFor: ['Designers', 'Families', 'Writers'],
    tags: ['europe', 'welfare-state', 'cycling'],
  },
  {
    id: 'copenhagen-1990s', city: 'Copenhagen', country: 'Denmark', decade: '1990s',
    costOfLivingIndex: 60, qualityOfLifeScore: 82, politicalStability: 'Stable',
    highlights: ['Øresund Bridge under construction, linking to Sweden', 'Cutting-edge clean-tech and pharma cluster', 'Renowned New Nordic food movement forming'],
    cautions: ['High cost of living', 'Strict immigration rules'],
    bestFor: ['Designers', 'Pharma professionals', 'Families'],
    tags: ['europe', 'clean-tech', 'design'],
  },

  // ── STOCKHOLM — Nordic telecom and welfare ────
  {
    id: 'stockholm-1980s', city: 'Stockholm', country: 'Sweden', decade: '1980s',
    costOfLivingIndex: 55, qualityOfLifeScore: 78, politicalStability: 'Stable',
    highlights: ['Ericsson and early telecom leadership', 'Strong gender equality in the workforce', 'Clean, safe, family-friendly environment'],
    cautions: ['High marginal tax rates', 'Long, dark winters'],
    bestFor: ['Engineers', 'Families', 'Researchers'],
    tags: ['europe', 'telecom', 'welfare-state'],
  },

  // ── ATHENS — EU accession era ────
  {
    id: 'athens-1980s', city: 'Athens', country: 'Greece', decade: '1980s',
    costOfLivingIndex: 35, qualityOfLifeScore: 60, politicalStability: 'Stable',
    highlights: ['1981 EU membership raising living standards', 'Mediterranean climate and cuisine', 'Rich ancient and Byzantine heritage'],
    cautions: ['Bureaucracy and inflation', 'Earthquake risk'],
    bestFor: ['Retirees', 'Writers', 'Self-employed expatriates'],
    tags: ['europe', 'eu-member', 'mediterranean'],
  },

  // ── ISTANBUL — bridge between continents ────
  {
    id: 'istanbul-1990s', city: 'Istanbul', country: 'Turkey', decade: '1990s',
    costOfLivingIndex: 30, qualityOfLifeScore: 55, politicalStability: 'Transitional',
    highlights: ['Bridge between European and Asian markets', 'Vibrant bazaar and food culture', 'Very affordable for visitors from the West'],
    cautions: ['Political instability and 1999 earthquake', 'Inflation eroding purchasing power'],
    bestFor: ['Entrepreneurs', 'Trade professionals', 'Adventurous expatriates'],
    tags: ['eurasia', 'emerging-market', 'bazaar'],
  },

  // ── BUENOS AIRES — dictatorship to democracy ────
  {
    id: 'buenos-aires-1980s', city: 'Buenos Aires', country: 'Argentina', decade: '1980s',
    costOfLivingIndex: 30, qualityOfLifeScore: 55, politicalStability: 'Transitional',
    highlights: ['1983 return to democracy restoring freedoms', 'Rich literary and tango culture', 'European-style architecture at low cost'],
    cautions: ['Hyperinflation eroding wages', 'Memories of the dictatorship still raw'],
    bestFor: ['Writers', 'Artists', 'Adventurous expatriates'],
    tags: ['south-america', 'democratization', 'tango'],
  },
  {
    id: 'buenos-aires-1990s', city: 'Buenos Aires', country: 'Argentina', decade: '1990s',
    costOfLivingIndex: 35, qualityOfLifeScore: 65, politicalStability: 'Stable',
    highlights: ['Convertibility plan stabilizing the economy', 'Privatization drawing foreign investment', 'Bohemian café and arts scene'],
    cautions: ['Growing unemployment from reforms', 'Economic vulnerability to currency peg'],
    bestFor: ['Entrepreneurs', 'Artists', 'Investors'],
    tags: ['south-america', 'stabilization', 'culture'],
  },

  // ── SANTIAGO — post-Pinochet transition ────
  {
    id: 'santiago-1990s', city: 'Santiago', country: 'Chile', decade: '1990s',
    costOfLivingIndex: 32, qualityOfLifeScore: 64, politicalStability: 'Stable',
    highlights: ['1990 democratic transition peaceful and steady', 'Economic growth averaging 6%+', 'Andes backdrop and wine country'],
    cautions: ['Pinochet-era constitution still in force', 'Inequality persisting'],
    bestFor: ['Entrepreneurs', 'Mining professionals', 'Corporate professionals'],
    tags: ['south-america', 'transition', 'mining'],
  },

  // ── MEXICO CITY — capital of a corporatist state ────
  {
    id: 'mexico-city-1970s', city: 'Mexico City', country: 'Mexico', decade: '1970s',
    costOfLivingIndex: 28, qualityOfLifeScore: 52, politicalStability: 'Authoritarian',
    highlights: ['Oil boom funding urban expansion', 'World-class museums and Aztec heritage', 'Affordable, vibrant cultural life'],
    cautions: ['One-party (PRI) rule limiting dissent', 'Severe air pollution'],
    bestFor: ['Artists', 'Writers', 'Adventurous expatriates'],
    tags: ['north-america', 'oil-boom', 'culture'],
  },
  {
    id: 'mexico-city-1990s', city: 'Mexico City', country: 'Mexico', decade: '1990s',
    costOfLivingIndex: 30, qualityOfLifeScore: 60, politicalStability: 'Transitional',
    highlights: ['NAFTA driving manufacturing growth', 'Democratic reforms ending PRI monopoly', 'Booming culinary and design scene'],
    cautions: ['1994 peso crisis severe shock', 'Crime and air-quality issues'],
    bestFor: ['Entrepreneurs', 'Artists', 'Corporate professionals'],
    tags: ['north-america', 'nafta', 'democratization'],
  },

  // ── VANCOUVER — Pacific gateway ────
  {
    id: 'vancouver-1980s', city: 'Vancouver', country: 'Canada', decade: '1980s',
    costOfLivingIndex: 45, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Expo 86 launching the city onto the world stage', 'Spectacular ocean-and-mountain setting', 'Diverse, multicultural population'],
    cautions: ['Rising housing costs as foreign investment grows', 'Rainy winters'],
    bestFor: ['Entrepreneurs', 'Families', 'Film-industry workers'],
    tags: ['north-america', 'pacific', 'expo'],
  },
  {
    id: 'vancouver-1990s', city: 'Vancouver', country: 'Canada', decade: '1990s',
    costOfLivingIndex: 55, qualityOfLifeScore: 78, politicalStability: 'Stable',
    highlights: ['Hong Kong handover driving immigration and capital', 'Hollywood North film industry booming', 'Clean, safe, outdoor-oriented lifestyle'],
    cautions: ['Housing affordability worsening', 'Limited high-wage job market outside film'],
    bestFor: ['Film-industry workers', 'Entrepreneurs', 'Families'],
    tags: ['north-america', 'immigration', 'film'],
  },

  // ── TORONTO — Canadian metropolis ────
  {
    id: 'toronto-1970s', city: 'Toronto', country: 'Canada', decade: '1970s',
    costOfLivingIndex: 42, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['CN Tower (1976) signaling modern ambitions', 'Strong banking and manufacturing base', 'Multicultural, English-speaking'],
    cautions: ['Cold winters', 'Provincial-federal political tensions'],
    bestFor: ['Finance workers', 'Families', 'Engineers'],
    tags: ['north-america', 'finance', 'multicultural'],
  },
  {
    id: 'toronto-1980s', city: 'Toronto', country: 'Canada', decade: '1980s',
    costOfLivingIndex: 50, qualityOfLifeScore: 76, politicalStability: 'Stable',
    highlights: ['Canada\'s financial capital consolidating', 'SkyDome and waterfront redevelopment', 'Strong South Asian and Caribbean communities'],
    cautions: ['Housing affordability declining', 'Racial tensions occasionally flaring'],
    bestFor: ['Finance workers', 'Entrepreneurs', 'Families'],
    tags: ['north-america', 'finance', 'multicultural'],
  },

  // ── MONTREAL — francophone cultural capital ────
  {
    id: 'montreal-1970s', city: 'Montreal', country: 'Canada', decade: '1970s',
    costOfLivingIndex: 40, qualityOfLifeScore: 68, politicalStability: 'Turbulent',
    highlights: ['Olympics 1976 modernizing the city', 'North American francophone culture capital', 'Affordable, cosmopolitan, artistic'],
    cautions: ['Quebec sovereignty movement and language laws', 'Corporate HQs departing for Toronto'],
    bestFor: ['Artists', 'Writers', 'Bilingual professionals'],
    tags: ['north-america', 'francophone', 'sovereignty'],
  },

  // ── AUSTIN — Texas tech and music ────
  {
    id: 'austin-1990s', city: 'Austin', country: 'United States', decade: '1990s',
    costOfLivingIndex: 38, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Dell and semiconductor cluster expanding rapidly', 'SXSW music and tech festival growing', 'University town with live-music scene'],
    cautions: ['Heat and allergies', 'Smaller airport and transit network'],
    bestFor: ['Tech workers', 'Musicians', 'Entrepreneurs'],
    tags: ['north-america', 'tech', 'music'],
  },

  // ── PORTLAND — pre-hipster cheap living ────
  {
    id: 'portland-1990s', city: 'Portland', country: 'United States', decade: '1990s',
    costOfLivingIndex: 40, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['Remarkably cheap housing for a West Coast city', 'Indie music, zine, and craft culture forming', 'Outdoor access to mountains and coast'],
    cautions: ['Job market thinner than Seattle or SF', 'Rainy winters'],
    bestFor: ['Artists', 'Writers', 'Slackers'],
    tags: ['north-america', 'indie', 'affordable'],
  },

  // ── CHARLOTTE — New South banking capital ────
  {
    id: 'charlotte-1990s', city: 'Charlotte', country: 'United States', decade: '1990s',
    costOfLivingIndex: 35, qualityOfLifeScore: 68, politicalStability: 'Stable',
    highlights: ['Bank of America and Wachovia headquarters', 'Low cost of living for a financial center', 'Mild four-season climate'],
    cautions: ['Culture less cosmopolitan than coastal hubs', 'Suburban sprawl'],
    bestFor: ['Finance workers', 'Families', 'Corporate professionals'],
    tags: ['north-america', 'finance', 'banking'],
  },

  // ── DENVER — mile-high growth ────
  {
    id: 'denver-1990s', city: 'Denver', country: 'United States', decade: '1990s',
    costOfLivingIndex: 38, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['New airport (1995) and Coors Field revitalizing downtown', 'Mountain-West tech and telecom growth', 'Outdoor lifestyle with Rockies access'],
    cautions: ['Ozone and brown cloud at times', 'Dry climate and altitude adjustment'],
    bestFor: ['Tech workers', 'Outdoor enthusiasts', 'Families'],
    tags: ['north-america', 'rockies', 'outdoor'],
  },

  // ── SALT LAKE CITY — Wasatch Front boom ────
  {
    id: 'salt-lake-city-2000s', city: 'Salt Lake City', country: 'United States', decade: '2000s',
    costOfLivingIndex: 40, qualityOfLifeScore: 74, politicalStability: 'Stable',
    highlights: ['2002 Winter Olympics boosting infrastructure', 'Tech and finance corridor expanding', 'World-class skiing within 30 minutes'],
    cautions: ['LDS cultural dominance', 'Winter inversion trapping smog'],
    bestFor: ['Tech workers', 'Outdoor enthusiasts', 'Families'],
    tags: ['north-america', 'olympics', 'skiing'],
  },

  // ── SAN DIEGO — navy and biotech ────
  {
    id: 'san-diego-1990s', city: 'San Diego', country: 'United States', decade: '1990s',
    costOfLivingIndex: 50, qualityOfLifeScore: 76, politicalStability: 'Stable',
    highlights: ['Biotech and telecom cluster (Qualcomm) expanding', 'Best weather of any major US city', 'Mexican cultural crossroads'],
    cautions: ['Defense-dependent economy', 'Limited public transit'],
    bestFor: ['Biotech professionals', 'Engineers', 'Families'],
    tags: ['north-america', 'biotech', 'coastal'],
  },

  // ── AUCKLAND — South Pacific gateway ────
  {
    id: 'auckland-1980s', city: 'Auckland', country: 'New Zealand', decade: '1980s',
    costOfLivingIndex: 45, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['Largest Polynesian city in the world', 'Sailing capital of the Southern Hemisphere', 'Safe, clean, English-speaking'],
    cautions: ['Geographic isolation from major markets', 'Limited job-market depth'],
    bestFor: ['Families', 'Sailors', 'Adventurous expatriates'],
    tags: ['oceania', 'polynesian', 'sailing'],
  },

  // ── MELBOURNE — cultural capital ────
  {
    id: 'melbourne-1990s', city: 'Melbourne', country: 'Australia', decade: '1990s',
    costOfLivingIndex: 50, qualityOfLifeScore: 78, politicalStability: 'Stable',
    highlights: ['World-leading livability rankings', 'Multicultural food and arts scene', 'Sporting capital of Australia'],
    cautions: ['Expensive housing', 'Variable "four-seasons-in-a-day" weather'],
    bestFor: ['Families', 'Artists', 'Corporate professionals'],
    tags: ['oceania', 'livability', 'culture'],
  },

  // ── BRISBANE — sunbelt growth ────
  {
    id: 'brisbane-1990s', city: 'Brisbane', country: 'Australia', decade: '1990s',
    costOfLivingIndex: 42, qualityOfLifeScore: 72, politicalStability: 'Stable',
    highlights: ['Sunbelt migration driving growth', 'Warm climate and outdoor lifestyle', 'Affordable relative to Sydney and Melbourne'],
    cautions: ['Subtropical humidity', 'Distance from global markets'],
    bestFor: ['Families', 'Retirees', 'Hospitality workers'],
    tags: ['oceania', 'sunbelt', 'warm-climate'],
  },

  // ── TEL AVIV — Mediterranean tech hub ────
  {
    id: 'tel-aviv-1990s', city: 'Tel Aviv', country: 'Israel', decade: '1990s',
    costOfLivingIndex: 50, qualityOfLifeScore: 70, politicalStability: 'Stable',
    highlights: ['Soviet Jewish immigration expanding tech talent', 'Mediterranean beach culture and Bauhaus architecture', 'Start-up nation beginnings'],
    cautions: ['Regional security concerns', 'High cost of housing'],
    bestFor: ['Tech workers', 'Entrepreneurs', 'Researchers'],
    tags: ['middle-east', 'startup-nation', 'mediterranean'],
  },
];
