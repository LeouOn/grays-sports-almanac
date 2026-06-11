export interface TechTransferTarget {
  id: string;
  concept: string;
  description: string;
  optimalYear: number;
  targetRecipient: string;
  recipientContext: string;
  deliveryMethod: string;
  estimatedImpact: string;
  butterflyRisk: 'Low' | 'Medium' | 'High';
  infrastructureReadiness: string;
  tags?: string[];
}

export const techTransferTargets: TechTransferTarget[] = [
  {
    id: 'tcp-ip',
    concept: 'TCP/IP & Internet Architecture',
    tags: ['tcp-ip', 'internet', 'packet-switching', 'dns', 'smtp', 'http', 'xerox-parc', 'darpa', 'arpanet', 'ethernet', 'vint-cerf', 'bob-metcalfe'],
    description: 'The modern internet protocol stack — packet switching, TCP/IP, DNS, email (SMTP), and the web (HTTP/HTML) as a layered architecture.',
    optimalYear: 1975,
    targetRecipient: 'Xerox PARC (Palo Alto Research Center) or DARPA',
    recipientContext: 'Xerox PARC already had Ethernet (1973), the Alto personal computer, and laser printers. DARPA was funding ARPANET. Both had the talent and resources to implement TCP/IP a decade early.',
    deliveryMethod: 'Send a technical paper describing the TCP/IP stack and DNS to Bob Metcalfe (Ethernet inventor) at Xerox PARC, or Vint Cerf at Stanford. Include RFC-style specifications. The concepts would be immediately understandable to them.',
    estimatedImpact: 'Accelerates the internet by 10-15 years. Commercial internet arrives in the early 1980s instead of mid-1990s. The web could exist by 1983.',
    butterflyRisk: 'High',
    infrastructureReadiness: 'ARPANET exists. Ethernet just invented (1973). Microprocessors emerging. All the building blocks are there — just needs the protocol vision.'
  },
  {
    id: 'li-ion',
    concept: 'Lithium-Ion Battery Prioritization',
    tags: ['li-ion', 'battery', 'lithium', 'cobalt-oxide', 'graphite-anode', 'exxon', 'whittingham', 'goodenough', 'electrochemistry', 'ev', 'energy-storage'],
    description: 'Modern rechargeable battery chemistry (lithium cobalt oxide cathode, graphite anode). Enables portable electronics, EVs, and grid storage decades earlier.',
    optimalYear: 1976,
    targetRecipient: 'Stanley Whittingham at Exxon Research',
    recipientContext: 'Whittingham was ALREADY working on lithium batteries at Exxon! He invented the first rechargeable lithium battery (TiS₂ cathode) in 1976. He just didn\'t have the right cathode material for commercial viability.',
    deliveryMethod: 'Send Whittingham a research memo describing the lithium cobalt oxide cathode (Goodenough\'s 1980 discovery) and the graphite anode. He has the lab and the funding — just needs the materials insight.',
    estimatedImpact: 'Commercial Li-ion batteries by ~1985 instead of 1991. EVs become viable in the 1990s. Laptops and mobile phones have vastly better batteries. Climate impact: accelerates electrification by 20+ years.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'Whittingham\'s Exxon lab is fully equipped. The materials science is the only missing piece. No fundamental manufacturing barriers.'
  },
  {
    id: 'cfc-ozone',
    concept: 'CFC / Ozone Depletion Warning',
    tags: ['cfc', 'ozone', 'chlorofluorocarbons', 'atmospheric-chemistry', 'molina', 'rowland', 'montreal-protocol', 'dupont', 'stratosphere', 'uv-radiation'],
    description: 'Chlorofluorocarbons destroy stratospheric ozone. The mechanism was published by Molina & Rowland in 1974, but was ignored for years. Accelerating the response prevents massive ozone loss.',
    optimalYear: 1972,
    targetRecipient: 'Mario Molina and F. Sherwood Rowland at UC Irvine',
    recipientContext: 'Molina and Rowland were about to discover the mechanism independently. Giving them the answer in 1972 accelerates their 1974 Nature paper by 2 years.',
    deliveryMethod: 'Anonymous mailing to Molina\'s UC Irvine office: a typed paper describing the CFC catalytic ozone destruction mechanism with the key reaction chain. Include a note: "Publish this. The DuPont legal team will fight you. Persist."',
    estimatedImpact: 'Montreal Protocol potentially signed in ~1982 instead of 1987. The ozone hole is significantly smaller. Millions fewer skin cancer cases.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'The chemistry was already known. CFCs were widely used. The science needed to be proven and publicized — which Molina & Rowland were perfectly positioned to do.'
  },
  {
    id: 'h-pylori',
    concept: 'H. Pylori & Peptic Ulcers',
    tags: ['h-pylori', 'ulcers', 'bacteria', 'antibiotics', 'marshall', 'warren', 'gastroenterology', 'bismuth', 'metronidazole', 'tetracycline', 'nobel-prize'],
    description: 'The bacterium Helicobacter pylori causes most peptic ulcers and is treatable with antibiotics. This replaced the dogma that ulcers were caused by stress and acid.',
    optimalYear: 1979,
    targetRecipient: 'Barry Marshall and Robin Warren, Royal Perth Hospital, Australia',
    recipientContext: 'Warren first observed the bacteria in 1979. Marshall later drank a culture to prove the link (1984). Their Lancet paper was published in 1983 but widely dismissed until the 1990s.',
    deliveryMethod: 'Send a case file to Warren in 1979 with clinical correlation data and a recommendation to use bismuth + metronidazole + tetracycline for eradication. Include before/after endoscopy photos.',
    estimatedImpact: 'Accelerates acceptance by 5-8 years. Millions spared unnecessary surgery and lifelong antacid medication. Marshall and Warren won the 2005 Nobel Prize — accelerating their work doesn\'t change that, it just brings relief sooner.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Antibiotics exist. Endoscopy exists. All that\'s missing is the hypothesis and the courage to test it on humans (which Marshall did himself!).'
  },
  {
    id: 'recombinant-dna',
    concept: 'Recombinant DNA / Genetic Engineering Acceleration',
    tags: ['recombinant-dna', 'genetic-engineering', 'biotech', 'boyer', 'cohen', 'genentech', 'insulin', 'patents', 'plasmids', 'restriction-enzymes'],
    description: 'Gene splicing and recombinant DNA technology — the foundation of modern biotech. First successful recombinant DNA experiment was Boyer & Cohen (1973). Accelerating the technique and commercialization.',
    optimalYear: 1974,
    targetRecipient: 'Herb Boyer (UCSF) and Stanley Cohen (Stanford)',
    recipientContext: 'Boyer and Cohen just published their landmark 1973 paper. They founded Genentech in 1976. They\'re at the exact inflection point where additional funding and patent strategy advice would compound.',
    deliveryMethod: 'Send a business plan to Boyer in 1975 outlining the commercial applications: synthetic human insulin (achieved 1978), human growth hormone, Factor VIII, tissue plasminogen activator (tPA). Include patent filing strategy.',
    estimatedImpact: 'Biotech industry accelerates by ~3-5 years. Insulin becomes widely available sooner. The patent landscape is cleaner if Boyer/Cohen file earlier and broader.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'All the lab techniques exist. Venture capital exists (Kleiner Perkins funded Genentech). The bottleneck is vision + patents, not science.'
  },
  {
    id: 'cryptography',
    concept: 'Public-Key Cryptography',
    tags: ['cryptography', 'rsa', 'diffie-hellman', 'public-key', 'encryption', 'ssl', 'tls', 'pgp', 'nsa', 'stanford', 'mit', 'number-theory'],
    description: 'RSA encryption and Diffie-Hellman key exchange — the mathematical foundation of all secure online communication.',
    optimalYear: 1975,
    targetRecipient: 'Whitfield Diffie and Martin Hellman at Stanford, or Ronald Rivest at MIT',
    recipientContext: 'Diffie and Hellman published their key exchange paper in 1976. Rivest, Shamir, and Adleman published RSA in 1977. All were working on the problem simultaneously.',
    deliveryMethod: 'Deliver a paper to Diffie at Stanford in 1974 describing the Diffie-Hellman key exchange and RSA algorithm. It would accelerate their work by ~2 years, which in crypto terms is enormous.',
    estimatedImpact: 'Public-key crypto becomes available in 1975 instead of 1977-78. PGP email encryption could exist by the early 1980s. SSL/TLS could arrive with the early web. NSA\'s export controls would still be a barrier.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'The math was ready. Computers were ready. The idea just needed to be articulated. Diffie described his "Eureka!" moment as driving home from work — a nudge in 1974 could accelerate everything.'
  },
  {
    id: 'wind-turbine',
    concept: 'Advanced Wind Turbine Aerodynamics',
    tags: ['wind-turbine', 'aerodynamics', 'renewable-energy', 'nasa', 'denmark', 'fiberglass', 'pitch-control', 'grid-integration', 'climate', 'energy'],
    description: 'Modern 3-blade horizontal-axis wind turbine design with aerodynamic profiles, pitch control, and grid integration — the Danish concept that became the global standard.',
    optimalYear: 1978,
    targetRecipient: 'NASA Lewis Research Center (Cleveland) or Risø National Laboratory (Denmark)',
    recipientContext: 'Both were researching wind turbines after the 1973 oil crisis. NASA\'s MOD-series turbines were experimenting with designs. Denmark was building the Tvind turbine (1975-78).',
    deliveryMethod: 'Send a technical report to Risø in 1978 summarizing modern turbine design: 3-blade upwind configuration, pitch regulation, variable-speed generators, and aerodynamic blade profiles. Include levelized cost of energy projections.',
    estimatedImpact: 'Wind energy cost-competitive by ~1990 instead of ~2005. Installed capacity in 2024 could be 3-5x higher. Climate impact: massive cumulative CO₂ reduction.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'Fiberglass manufacturing exists. Generators exist. Electronics for grid connection are rudimentary but improving. The 1970s energy crisis created political will for alternatives — the window is open.'
  },
  {
    id: 'smoking-lung-cancer',
    concept: 'Smoking-Cancer Causal Link Strengthening',
    tags: ['smoking', 'lung-cancer', 'tobacco', 'epidemiology', 'public-health', 'surgeon-general', 'carcinogens', 'litigation'],
    description: 'The causal link between smoking and lung cancer was suspected by the 1950s but the tobacco industry successfully created doubt for decades. Delivering the definitive epidemiological data to the right people accelerates regulation.',
    optimalYear: 1972,
    targetRecipient: 'Surgeon General\'s office or the American Cancer Society',
    recipientContext: 'The 1964 Surgeon General\'s report already linked smoking to cancer. What\'s missing is the long-term cohort data (the British Doctors Study and CPS-II) that was still accumulating.',
    deliveryMethod: 'A "meta-analysis" mailed to the ACS in 1973 showing the projected results of ongoing cohort studies, plus the tobacco industry\'s internal documents (which won\'t become public until the 1990s lawsuits).',
    estimatedImpact: 'Accelerates smoking bans, warning labels, and public health campaigns by 10-15 years. Millions of lives saved. The tobacco industry settlement ($206B, 1998) happens earlier.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'The science is solid. The data exists. The only barrier is the tobacco industry\'s disinformation campaign, which can be countered with foreknowledge of their tactics.'
  },
  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    id: 'world-wide-web',
    concept: 'World Wide Web Protocols (HTML/HTTP)',
    description: 'A global hypertext system running on top of the internet. Defines HTML for document structure, HTTP for document transfers, and URLs for addressing.',
    optimalYear: 1990,
    targetRecipient: 'Tim Berners-Lee / Robert Cailliau at CERN, Switzerland',
    recipientContext: 'Berners-Lee proposed the system in 1989. By late 1990, he had written the client and server software but was struggling to get funding and administrative support at CERN.',
    deliveryMethod: 'Mailed package containing detailed software architecture guidelines and a formal draft RFC demonstrating multi-platform browser protocols and link styling.',
    estimatedImpact: 'Accelerates public adoption of the web by 2-3 years. Promotes early standardization, preventing early corporate protocol fragmentation.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'Internet routing and TCP/IP exist. NeXT workstations are in use at CERN. All technical primitives are ready.'
  },
  {
    id: 'mp3-compression',
    concept: 'MP3 Audio Coding Standard',
    description: 'Perceptual audio coding format designed by the ISO/IEC MPEG group. Compresses raw CD audio by 12x with negligible loss in quality, enabling internet music sharing.',
    optimalYear: 1993,
    targetRecipient: 'Karlheinz Brandenburg at Fraunhofer Society, Germany',
    recipientContext: 'Karlheinz Brandenburg and the MPEG group were developing perceptual audio coding in the early 90s, finalizing the standard in 1993, but adoption was slow.',
    deliveryMethod: 'Send a mathematical memo describing the psychoacoustic masking threshold models and modified discrete cosine transform (MDCT) optimizations.',
    estimatedImpact: 'Brings digital audio distribution forward by 3 years. Enables early hardware MP3 players and digital distribution models pre-1996.',
    butterflyRisk: 'Medium',
    infrastructureReadiness: 'DSP microprocessors are mature. Personal computers have 16-bit soundcards (Sound Blaster 16 released 1992). Broadband/dial-up speeds are ready for compressed transfer.'
  },
  {
    id: 'dvd-standard',
    concept: 'Unified DVD Optical Storage Format',
    description: 'A standardized high-capacity digital optical disc format for video, audio, and data storage. Merges competing SD and MMCD formats.',
    optimalYear: 1995,
    targetRecipient: 'Sony, Philips, Toshiba, and Panasonic Consortium',
    recipientContext: 'In early 1995, a format war loomed between Sony/Philips (MMCD) and Toshiba/Panasonic (SD). This threat of fragmentation was holding back production.',
    deliveryMethod: 'Deliver a technical proposal outlining a unified physical and logical format standard (combining SD\'s storage layout with MMCD\'s EFMPlus modulation).',
    estimatedImpact: 'Saves years of format war friction. DVD launches globally in 1995 instead of late 1996/1997. Speeds up the decline of VHS.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Red-laser diode technology and MPEG-2 video compression are fully mature. Production plants are ready — they just need one unified specification.'
  },
  {
    id: 'google-pagerank',
    concept: 'PageRank Search Engine Algorithm',
    description: 'An algorithm that ranks web pages based on the quantity and quality of incoming links (treating a link as a vote of confidence). Enormously outperforms keyword indexing.',
    optimalYear: 1998,
    targetRecipient: 'Larry Page and Sergey Brin at Stanford University, USA',
    recipientContext: 'Page and Brin were developing BackRub/Google in 1996–1998. They were considering licensing the technology rather than forming a company.',
    deliveryMethod: 'Send an anonymous technical document proposing the PageRank matrix mathematics alongside an early business outline describing the AdWords keyword bidding revenue model.',
    estimatedImpact: 'Solidifies the Google search search quality 18 months ahead of schedule. Prevents the search space from being monopolized by proprietary, low-quality directories (Yahoo, Excite).',
    butterflyRisk: 'High',
    infrastructureReadiness: 'The web contains millions of indexed pages. Crawler infrastructure is cheap. VC funding (Andy Bechtolsheim) is active in Silicon Valley.'
  },

  // ── 1950s / 1960s EXPANSIONS ─────────────────────────────
  {
    id: 'polio-vaccine',
    concept: 'Polio Vaccine Acceleration (Salk Inactivated)',
    tags: ['polio', 'vaccine', 'salk', 'ipv', 'inactivated-virus', 'public-health', 'epidemiology', 'iron-lung', 'march-of-dimes', 'virology'],
    description: 'Jonas Salk\'s inactivated poliovirus vaccine (IPV) was proven effective in the 1954 field trial and licensed April 12, 1955. Polio paralyzed ~15,000 Americans per year in the early 1950s. Accelerating the trial by even 2 years prevents ~30,000 cases of paralysis.',
    optimalYear: 1951,
    targetRecipient: 'Jonas Salk at the University of Pittsburgh',
    recipientContext: 'Salk began working on polio in 1947 at the University of Pittsburgh. By 1951 he had the basic inactivated virus approach but needed funding for the massive field trial. The National Foundation for Infantile Paralysis (March of Dimes) was the funder.',
    deliveryMethod: 'Send Salk a research memo in early 1951 with the formalin inactivation protocol (exact concentration, temperature, and duration) and the double-blind trial design used in the actual 1954 trial. This eliminates 3 years of trial-and-error on inactivation parameters.',
    estimatedImpact: 'Vaccine licensed ~1953 instead of 1955. Prevents ~30,000 paralysis cases and ~1,500 deaths in the US alone during the 1952-53 polio seasons. The 1952 epidemic was the worst in US history (58,000 cases).',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Salk\'s lab is fully equipped. Tissue culture techniques exist. The March of Dimes is ready to fund. The only bottleneck is the inactivation protocol optimization.'
  },
  {
    id: 'transistor-radio',
    concept: 'Transistor Radio Commercialization',
    tags: ['transistor', 'radio', 'consumer-electronics', 'regency', 'ti', 'portable', 'semiconductor', 'broadcasting', 'miniaturization'],
    description: 'The Regency TR-1 (October 1954) was the first transistor radio, built with Texas Instruments transistors. It proved transistors could replace vacuum tubes in consumer products. Accelerating this by 2-3 years jumpstarts the entire consumer electronics revolution.',
    optimalYear: 1951,
    targetRecipient: 'Texas Instruments semiconductor division (Gordon Teal, Pat Haggerty)',
    recipientContext: 'TI had just produced the first silicon transistors (1954) but the company was uncertain about consumer applications. Pat Haggerty (TI VP) championed the transistor radio concept. IDEA/Regency built the radio with TI transistors.',
    deliveryMethod: 'Send Haggerty a product brief in 1951 with the TR-1 schematics, the market size analysis, and a licensing proposal for a pocket-sized transistor radio. Include the circuit design: 4 germanium transistors, 22.5V battery, superheterodyne receiver.',
    estimatedImpact: 'Transistor radios hit market by 1952 instead of 1954. Consumer electronics miniaturization accelerates by 2-3 years. Portable music, handheld electronics, and hearing aids all advance faster.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Germanium transistors exist (Shockley-type). Battery technology is adequate. Superheterodyne radio circuits are mature. The market is ready — vacuum tube radios are bulky and power-hungry.'
  },
  {
    id: 'fortran-compiler',
    concept: 'FORTRAN High-Level Programming Language',
    tags: ['fortran', 'compiler', 'ibm', 'programming-language', 'high-level', 'backus', 'optimization', 'scientific-computing', 'code-generation'],
    description: 'FORTRAN (FORmula TRANslation) was the first high-level programming language, developed by John Backus at IBM (1954-1957). It demonstrated that compiled code could approach hand-coded assembly in performance, transforming software development from an art into engineering.',
    optimalYear: 1953,
    targetRecipient: 'John Backus at IBM Research, New York',
    recipientContext: 'Backus proposed FORTRAN to his IBM manager in late 1953. IBM approved the project but many at IBM doubted compiled code could be efficient. Backus\'s team of 10 engineers spent 3 years building it.',
    deliveryMethod: 'Send Backus a technical document in early 1953 outlining the FORTRAN language syntax, the compiler optimization passes (common subexpression elimination, register allocation, loop optimization), and benchmark results showing compiled code matching hand-coded assembly. This eliminates the "will it work?" doubt and accelerates the compiler by 1-2 years.',
    estimatedImpact: 'FORTRAN compiler available by 1955 instead of 1957. Scientific computing productivity jumps immediately. COBOL (1960), LISP (1958), and other languages arrive sooner. The software industry starts 2 years early.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'The IBM 704 (FORTRAN\'s target machine) ships in 1954. Assembly programming is the norm. The concept of a compiler exists but is unproven for production code. Backus has the team and IBM funding.'
  },
  {
    id: 'laser-invention',
    concept: 'Laser (Light Amplification by Stimulated Emission of Radiation)',
    tags: ['laser', 'maser', 'stimulated-emission', 'coherent-light', 'townes', 'schawlow', 'maiman', 'optics', 'photonics', 'ruby-laser'],
    description: 'The laser was invented by Theodore Maiman at Hughes Research Labs on May 16, 1960, building on the theoretical work of Charles Townes and Arthur Schawlow (1958 paper). Lasers enabled fiber optics, barcode scanners, CD players, laser eye surgery, and precision manufacturing.',
    optimalYear: 1956,
    targetRecipient: 'Charles Townes at Columbia University',
    recipientContext: 'Townes invented the maser (microwave amplification by stimulated emission) in 1954 and was actively working on extending the concept to optical frequencies. His 1958 paper with Schawlow laid out the theoretical framework. Maiman built the first working laser in 1960 using a ruby crystal.',
    deliveryMethod: 'Send Townes a research memo in 1956 with the ruby laser design: a ruby cylinder with silvered ends, a helical flash lamp for pumping, and the specific chromium ion energy levels. Also describe the helium-neon gas laser (first continuous-wave, built 1961). This gives Townes the specific design 4 years early.',
    estimatedImpact: 'Working laser by 1957 instead of 1960. Fiber optic communications arrive ~5 years earlier. CD players, laser printers, barcode scanners, and medical lasers all advance by 3-5 years. Precision manufacturing (cutting, welding) accelerates.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'The maser exists (1954). Ruby crystals are available. Flash lamps exist. The theoretical physics is understood — only the specific implementation is missing.'
  },
  {
    id: 'weather-satellite',
    concept: 'Weather Satellite / Remote Earth Observation',
    tags: ['weather-satellite', 'tiros', 'nasa', 'remote-sensing', 'earth-observation', 'meteorology', 'infrared', 'cloud-cover', 'storm-tracking'],
    description: 'TIROS-1 (Television Infrared Observation Satellite), launched April 1, 1960, was the first weather satellite. It proved that satellite imagery could track cloud patterns and storm systems, transforming meteorology from ground-based guesswork to global observation.',
    optimalYear: 1957,
    targetRecipient: 'NASA Goddard Space Flight Center / RCA Astro Electronics',
    recipientContext: 'The TIROS program was proposed in 1958 and funded after Sputnik. RCA built the satellite with a television camera system. The concept was obvious after Sputnik but pre-Sputnik, funding was scarce.',
    deliveryMethod: 'Send a proposal to the US Weather Bureau and the Advanced Research Projects Agency (ARPA) in early 1957 describing a polar-orbiting satellite with TV cameras for cloud cover imaging. Include orbital mechanics, camera specifications (vidicon tube, 500-line resolution), and image transmission protocol.',
    estimatedImpact: 'Weather satellite operational by 1958 instead of 1960. Hurricane tracking, severe storm warnings, and 5-day forecasts all improve 2 years earlier. Early Sputnik-era space funding accelerates.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Vanguard and Explorer rocket programs exist. Vidicon TV cameras are mature. Image transmission from high altitude is demonstrated (U-2 program). The main barrier is funding and will — Sputnik provides both in Oct 1957.'
  },
  {
    id: 'pacemaker-implant',
    concept: 'Implantable Cardiac Pacemaker',
    tags: ['pacemaker', 'cardiac', 'heart', 'implant', 'medical-device', 'electronics', 'battery', 'arrhythmia', 'medtronic', 'chardack'],
    description: 'The first fully implantable pacemaker was developed by Wilson Greatbatch and Dr. William Chardack, implanted in a human patient in 1960. It used a mercury battery and delivered electrical pulses to regulate heartbeat. Pacemakers have since saved millions of lives.',
    optimalYear: 1957,
    targetRecipient: 'Wilson Greatbatch (independent inventor, Buffalo NY)',
    recipientContext: 'Greatbatch was building oscillator circuits at the University of Buffalo. He accidentally built a circuit that pulsed at 1.8 Hz — mimicking a heartbeat. He realized it could pace a heart and spent 2 years perfecting the design before the first human implant in 1960.',
    deliveryMethod: 'Send Greatbatch a circuit diagram in 1957 showing the exact blocking oscillator design he eventually developed, plus recommendations for the housing (epoxy resin, later titanium), the battery (later replaced by lithium-iodide in 1972), and the electrode placement (transvenous approach). Saves 2-3 years of iteration.',
    estimatedImpact: 'Implantable pacemaker available by 1958 instead of 1960. Tens of thousands of heart patients get life-saving treatment 2 years earlier. Greatbatch goes on to found the company that becomes Medtronic sooner.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Transistors exist. Mercury batteries exist. The surgical techniques exist. Epoxy resin for hermetic sealing exists. The only missing piece is the specific circuit design and the idea of making it implantable.'
  },
  {
    id: 'touchtone-phone',
    concept: 'Touch-Tone (DTMF) Telephone Signaling',
    tags: ['dtmf', 'touch-tone', 'telephone', 'bell-labs', 'signaling', 'dual-tone', 'multi-frequency', 'at&t', 'telecom', 'keypad'],
    description: 'Dual-tone multi-frequency (DTMF) signaling replaced rotary dial phones with push-button keypads. Invented at Bell Labs, first demonstrated in 1963, and rolled out commercially in the late 1960s. DTMF enabled automated phone systems, voicemail, and eventually interactive voice response.',
    optimalYear: 1958,
    targetRecipient: 'Bell Labs switching engineering group',
    recipientContext: 'Bell Labs was already researching tone-based signaling to replace the slow rotary dial. The DTMF standard was formally proposed in 1960. Engineers knew the concept but debated frequency pair selection for years.',
    deliveryMethod: 'Send a Bell Labs engineering memo in 1958 with the exact DTMF frequency pair matrix (the 4x4 grid that became the standard: 697, 770, 852, 941 Hz row tones and 1209, 1336, 1477, 1633 Hz column tones), the filter design for tone detection, and the keypad layout.',
    estimatedImpact: 'Touch-Tone phones in commercial service by 1961 instead of 1963. Automated phone banking, voicemail, and IVR systems arrive 2 years earlier. Rotary dials phase out faster.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Bell Labs has the entire telephone network. Tone generators and filters are well-understood electronics. The only debate was the specific frequency selection — providing the answer eliminates years of committee work.'
  },
  {
    id: 'microwave-oven',
    concept: 'Microwave Oven Consumer Design',
    tags: ['microwave', 'oven', 'magnetron', 'radar', 'raytheon', 'amana', 'consumer-appliance', 'radarange', 'cooking', 'rf-heating'],
    description: 'Percy Spencer at Raytheon discovered microwave heating in 1945 (a chocolate bar melted in his pocket near a radar magnetron). The first commercial Radarange (1947) was the size of a refrigerator and cost $5,000. The first countertop home model (Amana RR-1, 1967) cost $495 and transformed cooking.',
    optimalYear: 1958,
    targetRecipient: 'Raytheon appliance division / Amana subsidiary',
    recipientContext: 'Raytheon had the commercial Radarange (huge, expensive) but hadn\'t cracked the home market. They acquired Amana in 1965 specifically to develop consumer appliances. The miniaturization challenge was the magnetron and the cavity design.',
    deliveryMethod: 'Send Raytheon\'s appliance division a product spec in 1958 for a countertop microwave: compact cavity magnetron (0.7 kW), turntable for even heating, simplified controls (timer dial + power level), target price $400-500. Include the specific cavity geometry and mode stirrer design.',
    estimatedImpact: 'Countertop microwave oven by 1962 instead of 1967. 5 years of earlier adoption. By 1975, microwaves could be in 15% of US homes instead of the actual 4%. Time savings compound across hundreds of millions of households.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Cavity magnetrons are mature (WWII radar technology). Sheet metal fabrication exists. Turntable mechanisms exist. The engineering challenge is miniaturization and cost reduction, both solvable with a clear target spec.'
  },
  {
    id: 'barcode-upc',
    concept: 'UPC Barcode System',
    tags: ['barcode', 'upc', 'scanning', 'retail', 'laser-scanner', 'grocery', 'inventory', 'point-of-sale', 'ncr', 'ibm', 'woodland'],
    description: 'The Universal Product Code (UPC) barcode was first scanned on a pack of Wrigley\'s gum at a Marsh supermarket in Troy, Ohio on June 26, 1974. The concept was patented in 1952 (Woodland & Silver) but took 22 years to commercialize due to scanning technology and industry coordination.',
    optimalYear: 1965,
    targetRecipient: 'IBM (where Norman Woodland worked) or NCR (National Cash Register)',
    recipientContext: 'The barcode concept was patented in 1952 but no one could build cheap, reliable scanners. By the mid-1960s, lasers and photodiodes made it feasible. The grocery industry formed a unified standards committee ( Uniform Grocery Product Code Council) in 1970.',
    deliveryMethod: 'Send IBM a proposal in 1965 with the exact UPC symbology (the pattern of bars and spaces, the 12-digit number structure, the error-checking digit), plus a laser scanner design using a helium-neon laser and a photodiode array. Also recommend forming an industry standards body to get all grocery chains on one code.',
    estimatedImpact: 'Barcode scanning in stores by 1969 instead of 1974. Retail inventory management, checkout speed, and supply chain tracking all advance by 5 years. Walmart\'s logistics advantage (which depended on barcodes) accelerates.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'Lasers exist (1960). Photodiodes exist. IBM mainframes can process the data. The barcode symbology itself is just encoding theory — the patent was already filed. The missing piece is industry coordination and cheap scanner hardware.'
  },
  {
    id: 'numerical-control',
    concept: 'CNC Machine Tool Standardization (G-Code)',
    tags: ['cnc', 'g-code', 'numerical-control', 'machining', 'mit', 'rs274', 'post-processor', 'aia', 'machine-tool', 'programming'],
    description: 'While NC machining was invented at MIT in 1952, the standard programming language (G-code, formally RS274) took over a decade to emerge. Standardizing it earlier would have accelerated CNC adoption across manufacturing worldwide.',
    optimalYear: 1955,
    targetRecipient: 'MIT Servomechanisms Lab / Aircraft Industries Association (AIA)',
    recipientContext: 'MIT built the first NC machine in 1952. The AIA sponsored the development. Different manufacturers (Bendix, General Electric, Gidding & Lewis) all created proprietary control languages. Standardization efforts didn\'t coalesce until the early 1960s.',
    deliveryMethod: 'Send the AIA and MIT a proposed standard RS274D G-code specification in 1955, including the core G-words (G00 rapid, G01 linear, G02/G03 arc, G90/G91 absolute/incremental), M-codes for machine functions, and the APT (Automatically Programmed Tool) language for part programming. This is exactly what eventually became the standard — delivering it 7 years early eliminates the format wars.',
    estimatedImpact: 'CNC standardization by 1957 instead of 1963-67. Manufacturing automation accelerates across aerospace, automotive, and precision engineering. Parts interchangeability improves globally. Machine tool costs drop faster.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'NC machines exist (MIT 1952). Paper tape readers exist. The programming language is just a convention — no hardware changes needed. The AIA has the industry pull to enforce a standard.'
  },
  {
    id: 'color-tv-mass',
    concept: 'Color TV Manufacturing Cost Reduction',
    tags: ['color-tv', 'ntsc', 'manufacturing', 'consumer-electronics', 'crt', 'phosphor', 'shadow-mask', 'rca', 'cost-reduction'],
    description: 'Color TVs existed since 1954 (RCA CT-100, $1,000) but cost 3-5x more than B&W sets and had reliability problems. By 1965, RCA\'s improvements brought prices to $350-500 and color TV sales exploded. Accelerating this cost curve by 3-4 years means tens of millions of households get color TV sooner.',
    optimalYear: 1957,
    targetRecipient: 'RCA Consumer Electronics division (David Sarnoff, CEO)',
    recipientContext: 'RCA was the dominant TV manufacturer and had pioneered color TV. The CT-100 (1954) was $1,000 with a 15-inch screen. The main cost drivers were the shadow-mask CRT and the complex NTSC decoder circuit with dozens of vacuum tubes. Transistorizing the decoder and improving CRT yields were the key cost reductions.',
    deliveryMethod: 'Send RCA engineering a manufacturing improvement plan in 1957: (1) Use semiconductors to replace 19 of the 25 vacuum tubes in the chroma decoder, (2) Use rare-earth phosphors (europium-activated yttrium orthovanadate for red — developed 1964) for brighter colors at lower beam current, (3) Automate shadow-mask alignment with optical registration. Target: $350 retail by 1960.',
    estimatedImpact: 'Affordable color TVs ($350-500) by 1960 instead of 1965. Color broadcasting becomes profitable sooner. The 1960 Presidential debates (Kennedy vs Nixon) could have been in color. Visual media culture shifts earlier.',
    butterflyRisk: 'Low',
    infrastructureReadiness: 'RCA has the factories. Transistors are available. The NTSC standard is set. CRT manufacturing exists but needs yield improvements. All solvable with specific engineering guidance.'
  }
];