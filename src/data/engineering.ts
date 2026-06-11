export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'estimated';

export interface EngineeringSpec {
  id: string;
  era: '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s';
  subDomain: 'cnc_machining' | 'semiconductors' | 'metallurgy' | 'aerospace' | 'telecommunications';
  conceptName: string;
  description: string;
  keySpecs: Record<string, string>;
  provenance: {
    sourceUrl: string;
    sourceSite: string;
    confidence: ConfidenceLevel;
    extractedAt: string;
  };
  tags?: string[];
}

function deriveEngineeringTags(subDomain: string, conceptName: string): string[] {
  const domainTags: Record<string, string[]> = {
    cnc_machining: ['cnc', 'machining', 'numerical-control'],
    semiconductors: ['semiconductor', 'silicon', 'integrated-circuit'],
    metallurgy: ['metallurgy', 'steel', 'alloy'],
    aerospace: ['aerospace', 'aviation', 'rocketry'],
    telecommunications: ['telecom', 'communication', 'radio'],
  };
  const tags = [...(domainTags[subDomain] ?? [])];
  const skip = new Set(['the', 'a', 'an', 'of', 'in', 'for', 'and', 'with', 'from', 'to', 'at', 'by']);
  conceptName.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
    .filter(w => w.length > 2 && !skip.has(w))
    .forEach(w => tags.push(w));
  return [...new Set(tags)];
}

export const engineeringData: EngineeringSpec[] = [
  {
    id: 'cnc_mit_1952',
    era: '1950s',
    subDomain: 'cnc_machining',
    conceptName: 'MIT Servomechanisms Lab CNC Milling Machine (1952)',
    description: 'The first numerically controlled (NC) machine tool, developed under USAF funding. It was a heavily modified 28-inch Cincinnati Hydro-Tel vertical-spindle contour milling machine.',
    keySpecs: {
      'Axis Control': '3-axis',
      'Resolution': '0.0005-inch (0.5 mil)',
      'Data Input': 'Perforated paper tape',
      'Drive System': 'Variable-speed hydraulic transmissions'
    },
    provenance: {
      sourceUrl: 'https://cms.it',
      sourceSite: 'CMS / MIT',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'cnc_acramatic_iv_1965',
    era: '1960s',
    subDomain: 'cnc_machining',
    conceptName: 'Cincinnati Milacron Acramatic IV (1965)',
    description: 'A significant industry milestone, it was the first numerical machine controller to use integrated circuit (IC) electronics, making it drastically faster and more reliable than predecessor systems.',
    keySpecs: {
      'Electronics': 'Integrated Circuits (ICs)',
      'Developer': 'CIMTROL (Cincinnati Milacron controls division)',
      'Significance': 'Replaced vacuum-tube and discrete transistor control systems'
    },
    provenance: {
      sourceUrl: 'https://chipsetc.com',
      sourceSite: 'Chips Etc',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_planar_1959',
    era: '1950s',
    subDomain: 'semiconductors',
    conceptName: 'Fairchild Planar Process (1959)',
    description: 'Invented by Jean Hoerni, this process left the insulating silicon dioxide layer in place to protect p-n junctions, resulting in a flat (planar) topography that enabled integrated circuits.',
    keySpecs: {
      'Key Innovation': 'Surface passivation using silicon dioxide',
      'First Commercial Device': '2N1613 transistor (1960)',
      'Patent': 'U.S. Patent No. 3,025,589'
    },
    provenance: {
      sourceUrl: 'https://computerhistory.org',
      sourceSite: 'Computer History Museum',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_intel_4004_1971',
    era: '1970s',
    subDomain: 'semiconductors',
    conceptName: 'Intel 4004 Microprocessor (1971)',
    description: 'The first commercially produced microprocessor, designed by Intel for Busicom calculators.',
    keySpecs: {
      'Transistor Count': '2,300',
      'Process Node': '10 μm (micrometers)',
      'Technology': 'P-channel silicon gate MOS',
      'Clock Speed': '740 kHz'
    },
    provenance: {
      sourceUrl: 'https://intel.com',
      sourceSite: 'Intel / Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_intel_8080_1974',
    era: '1970s',
    subDomain: 'semiconductors',
    conceptName: 'Intel 8080 Microprocessor (1974)',
    description: 'An enhanced successor to the 8008, it is widely credited with helping launch the microcomputer industry.',
    keySpecs: {
      'Transistor Count': '4,500 - 6,000',
      'Process Node': '6 μm (micrometers)',
      'Technology': 'N-channel silicon gate MOS',
      'Clock Speed': '2 MHz to 3.125 MHz',
      'Data Width': '8-bit data, 16-bit address (64 KB memory)'
    },
    provenance: {
      sourceUrl: 'https://wikipedia.org',
      sourceSite: 'Wikipedia / AllAboutCircuits',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'met_bos_1952',
    era: '1950s',
    subDomain: 'metallurgy',
    conceptName: 'Basic Oxygen Steelmaking (BOS) / Linz-Donawitz Process (1952)',
    description: 'A primary steelmaking method that converts molten pig iron into steel by blowing high-purity oxygen through the melt, replacing the slower open-hearth furnace.',
    keySpecs: {
      'Efficiency': 'Cycle lasts 20-45 minutes (vs 10-12 hours for open-hearth)',
      'Charge Composition': '70-80% molten pig iron, 20-30% steel scrap',
      'Innovation': 'Replaces air with pure supersonic oxygen via water-cooled lance'
    },
    provenance: {
      sourceUrl: 'https://wikipedia.org',
      sourceSite: 'Wikipedia / EPA',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_agc_1966',
    era: '1960s',
    subDomain: 'aerospace',
    conceptName: 'Apollo Guidance Computer (AGC) Block II (1966)',
    description: 'Designed by MIT Instrumentation Lab, it was the first computer to use silicon integrated circuits and navigated the Apollo Command and Lunar Modules.',
    keySpecs: {
      'Word Length': '16 bits (15 bits data + 1 parity bit)',
      'Clock Speed': '2.048 MHz',
      'Memory': '2,048 words RAM, 36,864 words Core Rope ROM',
      'Weight & Power': '70 lbs, 55 W power consumption'
    },
    provenance: {
      sourceUrl: 'https://computer.org',
      sourceSite: 'IEEE Computer Society',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_j58_1964',
    era: '1960s',
    subDomain: 'aerospace',
    conceptName: 'Pratt & Whitney J58 Turboramjet Engine (1964)',
    description: 'Designed for the Lockheed SR-71 Blackbird, it acts as a turbojet at lower speeds and a ramjet at high supersonic speeds (Mach 3.0+).',
    keySpecs: {
      'Thrust (Wet/Afterburner)': '32,500 lbf (150 kN)',
      'Compressor': 'Nine-stage axial-flow with high-speed bypass bleed',
      'Operating Temperatures': 'Exhaust gas temps up to 3,400°F'
    },
    provenance: {
      sourceUrl: 'https://thesr71blackbird.com',
      sourceSite: 'The Aviation Geek Club / SR71Blackbird',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'telecom_fiber_1977',
    era: '1970s',
    subDomain: 'telecommunications',
    conceptName: 'First Commercial Fiber Optic Network (1977)',
    description: 'AT&T installed the first commercial telecommunications fiber optic link in the underground tunnels of Chicago, demonstrating its superiority over copper.',
    keySpecs: {
      'Data Rate': '45 Mbps',
      'Wavelength': '850 nm',
      'Capacity': 'Approx 672 voice channels per fiber',
      'Fiber Type': 'Multimode (graded-index)'
    },
    provenance: {
      sourceUrl: 'https://thefoa.org',
      sourceSite: 'The FOA / Corning',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  // ── 1950s EXPANSIONS ─────────────────────────────────────
  {
    id: 'semi_transistor_1947',
    era: '1950s',
    subDomain: 'semiconductors',
    conceptName: 'Bell Labs Point-Contact Transistor (1947, mass-prod 1950s)',
    description: 'Invented Dec 23, 1947 by John Bardeen and Walter Brattain at Bell Labs, with William Shockley developing the junction transistor in 1948. Mass production began in the early-to-mid 1950s, replacing vacuum tubes in most consumer electronics by the end of the decade.',
    keySpecs: {
      'Inventors': 'Bardeen, Brattain (point-contact); Shockley (junction)',
      'First Public Demo': 'June 30, 1948',
      'Nobel Prize': '1956 (Physics)',
      'Transistor Radio (1st commercial)': 'Regency TR-1, Oct 1954, $49.95',
      'Power Consumption vs Vacuum Tube': '~1/10th the power, ~100x the lifespan'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Transistor',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_ti_silicon_1954',
    era: '1950s',
    subDomain: 'semiconductors',
    conceptName: 'Texas Instruments Silicon Transistor (1954)',
    description: 'Gordon Teal at Texas Instruments produced the first commercial silicon transistor (the TI 900 series, including 2N697). Silicon transistors could operate at higher temperatures than germanium, making them more reliable and ultimately cheaper — the price fell from $16 in 1954 to $2.50 by 1960.',
    keySpecs: {
      'Inventor': 'Gordon Teal (TI)',
      'First Commercial Device': 'TI 2N697 (NPN silicon BJT)',
      'Operating Temperature': 'Up to 150°C (germanium limit ~70°C)',
      'Price Trajectory': '$16 (1954) → $2.50 (1960) → $0.10 (early 1960s)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Gordon_Teal',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_kilby_ic_1958',
    era: '1950s',
    subDomain: 'semiconductors',
    conceptName: 'Jack Kilby Integrated Circuit (1958)',
    description: 'On Sept 12, 1958, Jack Kilby at Texas Instruments demonstrated the first integrated circuit: a germanium sliver with a transistor, a capacitor, and resistors connected by hand-soldered wires. Kilby won the 2000 Nobel Prize in Physics for this work. Noyce independently developed the silicon monolithic version a few months later.',
    keySpecs: {
      'Inventor': 'Jack Kilby (TI)',
      'Demo Date': 'September 12, 1958',
      'First Patent': 'Filed Feb 6, 1959; granted 1964',
      'Substrate': 'Germanium',
      'Components on First IC': '1 transistor, 1 capacitor, 3 resistors, hand-wired'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Integrated_circuit',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'semi_noyce_monolithic_1959',
    era: '1950s',
    subDomain: 'semiconductors',
    conceptName: 'Robert Noyce Monolithic Silicon IC (1959)',
    description: 'Independently of Kilby, Robert Noyce at Fairchild Semiconductor developed the first monolithic IC: a single silicon chip where the planar process could pattern all components and the on-chip aluminum interconnect eliminated hand-wiring. This approach is the basis of every modern IC.',
    keySpecs: {
      'Inventor': 'Robert Noyce (Fairchild)',
      'Filing Date': 'Patent filed July 30, 1959 (granted 1962)',
      'Substrate': 'Silicon (vs Kilby\'s germanium)',
      'Key Innovation': 'On-chip aluminum metallization for interconnect',
      'Foundation': 'Built on Jean Hoerni\'s planar process (also Fairchild)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Robert_Noyce',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_boeing_707_1958',
    era: '1950s',
    subDomain: 'aerospace',
    conceptName: 'Boeing 707 / Pratt & Whitney JT3C Turbofan (1958)',
    description: 'The Boeing 707 was the first commercially successful jet airliner in the United States, entering service with Pan Am on Oct 26, 1958 (London to New York). The JT3C turbojet (later upgraded to JT3D turbofan) powered most 707 variants and established the template for commercial jet engine design.',
    keySpecs: {
      'First Service Flight': 'Oct 26, 1958 (Pan Am, NYC→London)',
      'Passenger Capacity': '140-189 (typical config)',
      'Cruise Speed': '960 km/h (600 mph, Mach 0.84)',
      'Engine': 'Pratt & Whitney JT3C turbojet, 13,500 lbf thrust (later JT3D turbofan, 17,000 lbf)',
      'Range': '~6,900 km (3,700 nautical miles)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Boeing_707',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_atlas_icbm_1959',
    era: '1950s',
    subDomain: 'aerospace',
    conceptName: 'Convair SM-65 Atlas ICBM (1959)',
    description: 'The first operational U.S. intercontinental ballistic missile. Used liquid oxygen and kerosene, and a novel "stage-and-a-half" design where the outboard booster engines dropped away while the sustainer continued. It became the launch vehicle for Project Mercury\'s manned orbital flights (1958-1963).',
    keySpecs: {
      'First Operational Test': 'Sept 9, 1959',
      'Propellant': 'LOX + RP-1 kerosene',
      'Range': '~10,000 km (6,200 mi)',
      'Configuration': 'Stage-and-a-half (booster engines jettison, sustainer continues)',
      'Notable Use': 'Launched John Glenn (Mercury-Atlas 6, Feb 20, 1962) into orbit'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/SM-65_Atlas',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'telecom_ntsc_color_1953',
    era: '1950s',
    subDomain: 'telecommunications',
    conceptName: 'NTSC Color TV Standard (1953)',
    description: 'On Dec 17, 1953, the FCC adopted the NTSC (National Television System Committee) standard for color television broadcasting, designed to be backward-compatible with existing B&W sets. NTSC became the foundation for analog color TV broadcasting in the U.S., Japan, and much of the Americas until digital switchover in the 2000s.',
    keySpecs: {
      'FCC Adoption Date': 'Dec 17, 1953',
      'Frame Rate': '29.97 fps (60 Hz field rate)',
      'Resolution': '525 lines (480i visible)',
      'Backward Compatibility': 'Color signal included a B&W-compatible luminance (Y) component',
      'Field Nickname': '"Never The Same Color" (early broadcast variance)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/NTSC',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  // ── 1960s EXPANSIONS ─────────────────────────────────────
  {
    id: 'semi_mosfet_1963',
    era: '1960s',
    subDomain: 'semiconductors',
    conceptName: 'MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) (1963)',
    description: 'The MOSFET was theoretically described by Julius Lilienfeld (1925) and Oskar Heil (1934), and first successfully built by Mohamed Atalla and Dawon Kahng at Bell Labs in 1959-1960. It became the basis of modern digital electronics because of its small size, low power draw, and ease of mass production. CMOS (a MOSFET variant) is now the dominant semiconductor technology.',
    keySpecs: {
      'First Working Device': 'Atalla & Kahng, Bell Labs, 1959-1960',
      'Patent Filed': '1960 (Atalla, Kahng, assigned to Bell Labs)',
      'Key Properties': 'High input impedance, low power, scalable',
      'Use': 'Building block of every modern CPU, memory cell, and analog IC',
      'Status': 'Most widely manufactured device in human history (13 sextillion per year by 2018)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/MOSFET',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'comp_ibm_360_1964',
    era: '1960s',
    subDomain: 'semiconductors',
    conceptName: 'IBM System/360 Mainframe Family (1964)',
    description: 'Announced April 7, 1964, the IBM System/360 was a family of compatible mainframes that introduced the 8-bit byte as a standard (and with it, the 32-bit word length), established microcode as a universal design technique, and led to the unbundling of software from hardware. It is widely considered the most successful computer family ever built.',
    keySpecs: {
      'Announce Date': 'April 7, 1964',
      'Price Range': '$5,000 to $5,000,000+ across models',
      'Architecture': 'First mainstream 32-bit mainframe family',
      'Key Innovation': '8-bit byte, 32-bit word, microcode, full software compatibility across the line',
      'Industry Impact': 'IBM invested ~$5 billion (~$50B in 2024 dollars), largest private R&D project of its time'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/IBM_System/360',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'comp_pdp8_1965',
    era: '1960s',
    subDomain: 'semiconductors',
    conceptName: 'DEC PDP-8 Minicomputer (1965)',
    description: 'The first commercially successful minicomputer — small, cheap ($18,000 vs the $100K+ of mainframes), and shipped fully assembled. It pioneered the 12-bit word and 4K-word core memory design that made computers accessible to smaller labs, factories, and engineering groups. PDP-8 variants sold for over 20 years.',
    keySpecs: {
      'Announce Date': 'Aug 1965 (shipping early 1966)',
      'Price (1965 USD)': '$18,500',
      'Weight': '~250 lbs',
      'Word Length': '12 bits',
      'Memory': '4K-32K words of magnetic core memory',
      'Sales': 'Over 50,000 units (multiple variants) — one of the best-selling computer families of all time'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/PDP-8',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'telecom_arpanet_1969',
    era: '1960s',
    subDomain: 'telecommunications',
    conceptName: 'ARPANET First Four Nodes (1969)',
    description: 'Contracted by ARPA (later DARPA) and built by Bolt, Beranek and Newman (BBN), ARPANET was the first operational packet-switched network and the technical foundation of the modern internet. The first four nodes were UCLA, Stanford Research Institute, UC Santa Barbara, and the University of Utah. The first ARPANET message was sent Oct 29, 1969: BBN attempted to transmit "LOGIN" but the system crashed after "LO".',
    keySpecs: {
      'Contract Awarded': 'Jan 7, 1969 (to BBN)',
      'First Node Online': 'UCLA, Sept 1, 1969',
      'First Four Nodes': 'UCLA, SRI, UCSB, U. of Utah',
      'First Message': 'Oct 29, 1969 — crashed after "LO" of "LOGIN"',
      'Link Speed': '50 kbps (via leased telephone lines, 1200 bps modems at the time)',
      'Protocol': 'NCP (Network Control Program) initially, later TCP/IP (1974-1983)'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/ARPANET',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_lm_apollo_1969',
    era: '1960s',
    subDomain: 'aerospace',
    conceptName: 'Grumman Lunar Module (LM) / Eagle (1969)',
    description: 'Built by Grumman Aerospace, the LM was the first crewed spacecraft to operate exclusively in the airless vacuum of space. The Apollo 11 LM "Eagle" landed two humans on the Moon on July 20, 1969. The LM was so specialized that it could not operate in Earth\'s atmosphere — even a test flight in air would have collapsed the structure.',
    keySpecs: {
      'First Crewed Lunar Landing': 'July 20, 1969 (Apollo 11, Eagle)',
      'Dry Mass': '~4,800 lbs (descent stage) + 5,400 lbs (ascent stage)',
      'Crew': '2 (vs 3 in Command Module)',
      'Crew Capacity': 'Limited to ~2 crew for 3 days (one lunar day)',
      'Propellants': 'Aerozine 50 + N₂O₄ (hypergolic — ignite on contact, no igniter needed)',
      'Total Production': '15 flight articles (not all flew); 6 landed on the Moon'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Apollo_Lunar_Module',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  },
  {
    id: 'aero_carbon_fiber_1964',
    era: '1960s',
    subDomain: 'aerospace',
    conceptName: 'High-Performance Carbon Fiber (1964)',
    description: 'While carbon fiber filaments existed since Thomas Edison (1880), Roger Bacon at Union Carbide\'s Parma Technical Center produced the first high-performance carbon fibers in 1958-1964 with tensile strength ~1 GPa. These fibers became the basis of advanced composites in aerospace (Boeing 787, ~50% composites by weight) and Formula 1.',
    keySpecs: {
      'Pioneer': 'Roger Bacon (Union Carbide, Parma OH)',
      'First High-Performance Fiber': 'Late 1950s-early 1960s',
      'Early Tensile Strength': '~1 GPa (later variants 5-7 GPa)',
      'Modern Use': 'Boeing 787 (~50% composite), F1 monocoque chassis, wind turbine blades'
    },
    provenance: {
      sourceUrl: 'https://en.wikipedia.org/wiki/Carbon_fiber',
      sourceSite: 'Wikipedia',
      confidence: 'high',
      extractedAt: new Date().toISOString()
    }
  }
];

engineeringData.forEach(entry => {
  if (!entry.tags || entry.tags.length === 0) {
    entry.tags = deriveEngineeringTags(entry.subDomain, entry.conceptName);
  }
});
