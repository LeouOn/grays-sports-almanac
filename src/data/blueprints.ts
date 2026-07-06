export interface BootstrapBlueprint {
  id: string;
  title: string;
  category: 'Semiconductors' | 'Machine Tooling' | 'Electronics' | 'Materials & Chemistry';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  historicalEra: string;
  description: string;
  keyPrinciples: string[];
  materialsRequired: string[];
  tolerances: string;
  stepByStepGuide: string; // Markdown spec
  chronoImpact: string;
  tags?: string[];
}

export const blueprintsData: BootstrapBlueprint[] = [
  {
    id: 'czochralski-silicon',
    title: 'Silicon Crystal Pulling (Czochralski Method)',
    tags: ['semiconductor', 'silicon', 'czochralski', 'crystal-pulling', 'wafer', 'monocrystalline', 'doping', 'ingot', 'quartz-crucible', 'rf-heating'],
    category: 'Semiconductors',
    difficulty: 'Advanced',
    historicalEra: 'Late 1940s / 1950s',
    description: 'Process to pull a high-purity mono-crystalline silicon ingot from a molten pool of purified metallurgical-grade silicon, forming the basis of all silicon wafers.',
    keyPrinciples: [
      'Seed crystal orientation',
      'Rotary pulling velocity control',
      'Thermal equilibrium maintenance (1420°C)',
      'Argon gas atmosphere purging',
      'Quartz crucible erosion management'
    ],
    materialsRequired: [
      'Refined polycrystalline silicon (99.9999999% purity)',
      'Quartz (SiO2) crucible',
      'High-purity graphite susceptor',
      'Argon gas supply (99.999% purity)',
      'Single-crystal seed (typically [100] or [111] orientation)',
      'Radio-frequency (RF) induction heating coils'
    ],
    tolerances: 'Melting Temperature: 1420°C ± 0.5°C; Pulling Rate: 1.0 - 2.5 mm/min ± 0.05 mm/min; Rotation speed: 10 - 20 RPM.',
    stepByStepGuide: `### Phase 1: Charge Loading & Melting
1. **Cleanroom Assembly:** Assemble the quartz crucible inside the vacuum chamber, supported by the graphite susceptor.
2. **Silicon Charge:** Load high-purity polycrystalline silicon chunks into the crucible.
3. **Chamber Purging:** Seal and evacuate the chamber to $10^{-5}$ Torr, then backfill with high-purity Argon gas at low pressure (approx. 10 Torr) to establish a continuous sweep.
4. **Thermal Ramp:** Energize the RF induction coils to melt the silicon. Establish stable thermal equilibrium exactly at **1420°C** (molten silicon surface tension will change visually).

### Phase 2: Seed Contact & Necking
1. **Dipper Control:** Lower the holder containing the [100] single-crystal seed down to the melt surface.
2. **Thermal Adjustment:** Wait 2 minutes for the seed to reach temperature equilibrium with the melt without melting away.
3. **Contact:** Dip the seed into the melt.
4. **Necking:** Immediately begin rotating the seed at 15 RPM and pulling upward at a fast rate (3.0 mm/min). This forms a thin neck (3-5 mm diameter) which eliminates dislocations propagating from the seed.

### Phase 3: Shoulder & Body Pulling
1. **Shoulder Growth:** Slow the pulling rate to 1.0 mm/min and slightly reduce temperature. The crystal diameter will expand outward.
2. **Body Growth:** Once target ingot diameter is reached, balance temperature and pull speed (1.5 mm/min) to maintain a constant diameter cylinder.
3. **Doping:** Inject pre-measured tiny granules of dopant (e.g. Boron for P-type or Phosphorus for N-type) into the melt prior to pulling if specific electrical resistivity is targeted.

### Phase 4: Tail-Out & Slow Cooling
1. **End Cone:** Gradually increase temperature and pulling rate to taper the crystal diameter to a point, preventing thermal shock.
2. **Ingot Lift:** Lift the completed crystal completely free of the melt.
3. **Anneal Cooling:** Cooling must be conducted slowly under Argon sweep over 8-12 hours to prevent stress fractures.`,
    chronoImpact: 'Allows the production of defect-free single crystal wafers, accelerating the transition from germanium point-contact to high-temperature silicon planar transistors by 5-8 years.'
  },
  {
    id: 'optical-photolithography',
    title: 'Optical Reduction Photolithography (Step-and-Repeat)',
    category: 'Semiconductors',
    difficulty: 'Advanced',
    historicalEra: '1960s / 1970s',
    description: 'Projecting micro-circuit patterns from a master reticle (mask) onto a photoresist-coated wafer at a reduced scale (typically 10:1 or 5:1) using ultraviolet light.',
    keyPrinciples: [
      'Optical reduction scale projection',
      'UV light-band optimization (G-line 436nm, I-line 365nm)',
      'Novolac resin / Diazonaphthoquinone (DNQ) photoresist chemistry',
      'Chromium-on-quartz reticle technology',
      'Laser interferometric wafer stage alignment'
    ],
    materialsRequired: [
      'High-pressure Mercury Arc Lamp',
      'Highly corrected multi-element quartz lens system',
      'Novolac-based positive photoresist',
      'Tetramethylammonium hydroxide (TMAH) developer',
      'Chromium-coated quartz glass mask plates',
      'Hexamethyldisilazane (HMDS) adhesion promoter'
    ],
    tolerances: 'Alignment resolution: ± 0.25 microns; Projection reduction: 10:1 ± 0.001%; Spin speed coating: 4000 RPM ± 10 RPM.',
    stepByStepGuide: `### Phase 1: Wafer Preparation & Coating
1. **Dehydration Bake:** Bake silicon wafers at 150°C for 20 minutes to drive off surface moisture.
2. **HMDS Priming:** Expose wafers to vaporized HMDS for 30 seconds to convert the surface from hydrophilic to hydrophobic.
3. **Spin Coating:** Dispense a precise pool of Novolac/DNQ positive photoresist onto the center of the wafer. Spin the wafer at 4000 RPM for 30 seconds to yield a uniform 1.0-micron thick film.
4. **Soft Bake:** Bake the wafer at 90°C for 60 seconds on a hotplate to dry out solvent.

### Phase 2: Alignment & Projection Exposure
1. **Reticle Loading:** Mount the chromium-on-quartz master mask (containing circuit patterns 10x larger than final wafer print size) in the reticle frame.
2. **Wafer Placement:** Vacuum-clamp the coated wafer to the step-and-repeat wafer stage.
3. **Laser Stage Alignment:** Use laser interferometers to align the wafer stage relative to the lens axis.
4. **Exposure Pass:** Illuminate the reticle with a high-pressure Mercury Arc Lamp filtered to the 365nm spectral line (I-line). Project light through the 10:1 reduction lens onto a single die field. Step the stage and repeat across the wafer grid.

### Phase 3: Developing & Post-Processing
1. **Post-Exposure Bake:** Bake wafer at 110°C for 60 seconds to smooth out optical standing waves in the photoresist layers.
2. **Development:** Immerse wafer in 2.38% TMAH developer for 60 seconds. The exposed photoresist (which became soluble due to photochemical conversion of DNQ to indenecarboxylic acid) dissolves.
3. **Hard Bake:** Bake at 120°C for 90 seconds to harden remaining photoresist stencil.
4. **Etching/Ion Injection:** Plunge into chemical etchants (e.g. Buffered Oxide Etch) or place in ion implanter. Strip remaining photoresist with organic solvents.`,
    chronoImpact: 'Enables sub-micron feature sizes, allowing the fabrication of large-scale integrated circuits (VLSI), microprocessors, and megabit DRAMs years ahead of the historical schedule.'
  },
  {
    id: 'precision-ball-screw',
    title: 'Precision Ball Screws & Closed-Loop CNC Control',
    category: 'Machine Tooling',
    difficulty: 'Intermediate',
    historicalEra: '1950s / 1960s',
    description: 'Mechanical drive systems using recirculating ball bearings to convert rotary motor shaft rotation to sub-micron linear motion with near-zero backlash, coupled with optical linear encoder feedback.',
    keyPrinciples: [
      'Recirculating ball bearing channels',
      'Double-nut preloading for zero backlash',
      'Moiré fringe optical scale detection',
      'Proportional-Integral-Derivative (PID) feedback loop tuning',
      'Granite surface plate flatness benchmarks'
    ],
    materialsRequired: [
      'High-grade carbon alloy steel (AISI 4150 or similar)',
      'Precision-ground chrome steel balls (Grade 10 or better)',
      'Double ball-nut housing with adjustable shim spacing',
      'Fine glass scale grating (e.g. 100 lines/mm)',
      'LED light source and photodiode detection array',
      'DC permanent magnet servo motors',
      'High-precision Grade AA granite surface plates'
    ],
    tolerances: 'Screw lead accuracy: ± 1 micron per 300 mm; Backlash error: < 0.5 microns; Surface Plate Flatness: ± 1.5 microns across working surface.',
    stepByStepGuide: `### Phase 1: Ball Screw Grinding & Preloading
1. **Rough Machining:** Turn the screw shaft blank from hardened carbon steel. Rough-cut the ball track grooves.
2. **Thread Grinding:** Harden the shaft to HRC 60. Thread-grind the ball grooves with a specialized vitrified wheel.
3. **Double-Nut Assembly:** Pack the recirculating channels inside two separate ball nuts with precision chrome-steel bearings.
4. **Preload Adjustment:** Mount both nuts on the screw shaft separated by a precision shim washer. Adjust shim thickness until the nuts press against opposite sides of the screw threads. This preloaded configuration removes all axial clearance (zero backlash) while maintaining smooth rotation.

### Phase 2: Optical Scale Grating Construction
1. **Glass Scale Grating:** Create a glass ruler containing highly precise chromium lines (e.g., 50 to 100 lines per millimeter).
2. **Index Scale:** Create a matching short reference glass mask with the same pitch.
3. **Sensor Placement:** Mount the long glass scale to the machine bed, and the short scale + LED + photodetector array to the sliding carriage.
4. **Quadrature Output:** Align the sensor so the moving grids create Moiré fringe patterns. The photodetectors read two sine waves offset by 90 degrees (Quadrature), enabling sub-micron position and direction tracking.

### Phase 3: Closed-Loop Integration & PID Tuning
1. **Interfacing:** Route the encoder quadrature pulses to a high-speed digital counter card (or analog differential amplifier).
2. **Control Loop:** Write a control algorithm executing 1000 times per second:
   $$\\text{Error} = \\text{Target Position} - \\text{Encoder Position}$$
   $$\\text{Output Voltage} = K_p \\cdot \\text{Error} + K_i \\cdot \\int \\text{Error} \\, dt + K_d \\cdot \\frac{d(\\text{Error})}{dt}$$
3. **Tuning:** Mount carriage on carriage rails over a Grade AA granite plate. Tune parameters:
   - Increase proportional gain ($K_p$) for stiffness.
   - Adjust derivative gain ($K_d$) to eliminate overshoot oscillation.
   - Adjust integral gain ($K_i$) to eliminate steady-state friction error.`,
    chronoImpact: 'Eliminates manual machining errors and enables automated coordinate layout. Directly catalyzes precise CNC milling, laser plotting, and wafer stage positioning tables.'
  },
  {
    id: 'silicon-planar-process',
    title: 'Silicon Planar Process (Hoerni Planar Transistor)',
    category: 'Electronics',
    difficulty: 'Advanced',
    historicalEra: '1959 / 1960s',
    description: 'Jean Hoerni\'s breakthrough process to manufacture flat transistors protected by a passivating silicon dioxide layer, enabling monolithic integrated circuits.',
    keyPrinciples: [
      'Silicon dioxide thermal passivation',
      'Select oxide window etching',
      'Gas-phase thermal diffusion doping',
      'Vacuum vapor metallization (Al sputtering)'
    ],
    materialsRequired: [
      'Purified silicon wafer slices (P-type, doped with Boron)',
      'Deionized water and high-purity Oxygen gas',
      'Buffered Hydrofluoric acid (HF) etchant solution',
      'Phosphorus oxychloride (POCl3, N-type dopant source)',
      'Boron tribromide (BBr3, P-type dopant source)',
      'Pure Aluminum charge and vacuum deposition crucible'
    ],
    tolerances: 'Oxide passivating thickness: 500 nm ± 10 nm; Base diffusion junction depth: 1.5 microns ± 0.1 microns; Emitter junction depth: 0.8 microns ± 0.05 microns.',
    stepByStepGuide: `### Phase 1: Wafer Oxidation & Photo-Etching
1. **Cleaning:** Clean the polished P-type silicon wafer using sulfuric acid / hydrogen peroxide mixtures (piranha etch) to strip organic contaminants.
2. **Thermal Oxidation:** Place wafers in a quartz furnace tube at 1000°C. Flow water vapor ($H_2O$) and Oxygen ($O_2$) to grow a uniform 500 nm thick layer of protective Silicon Dioxide ($SiO_2$).
3. **Base Window Photo-Etch:** Spin-coat positive photoresist onto the oxide layer. Align and expose the base region outline. Develop, then etch away the exposed $SiO_2$ window using buffered HF. Strip remaining photoresist.

### Phase 2: Base & Emitter Diffusion Doping
1. **Base Diffusion (N-type):** Place the etched wafer in the diffusion furnace at 1050°C. Flow nitrogen carrying POCl3 vapor. Phosphorus atoms diffuse into the exposed silicon window, creating an N-type base region.
2. **Drive-In & Re-oxidation:** Heat wafer in oxygen to drive the phosphorus deeper (1.5 microns) and regrow a fresh oxide layer over the base window.
3. **Emitter Window Photo-Etch:** Repeat photolithography to open a smaller emitter window inside the base region. Etch the oxide layer window.
4. **Emitter Diffusion (P-type):** Heat wafer at 1000°C while flowing BBr3 carrier gas. Boron atoms diffuse into the emitter window, creating a P-type emitter. Regrow a final sealing oxide layer.

### Phase 3: Contact Window & Metallization
1. **Contact Etching:** Conduct photolithography a third time to open small contact windows over the base and emitter regions. Etch windows through the oxide down to bare silicon.
2. **Vapor Deposition:** Place the wafer inside a vacuum chamber at $10^{-6}$ Torr. Evaporate pure Aluminum using an electron beam or tungsten filament. A thin metal layer deposits across the entire wafer surface.
3. **Metal Patterning:** Spin photoresist, expose the contact wire layout mask, develop, and chemically etch away excess aluminum, leaving isolated metal contact pads connected to base and emitter terminals.
4. **Alloy Anneal:** Heat the wafer at 450°C for 15 minutes to allow aluminum to form an ohmic alloy interface with silicon.`,
    chronoImpact: 'Solves early transistor reliability, surface contamination, and leakage issues. Directly enables the creation of monolithic integrated circuits and high-reliability aerospace microprocessors.'
  },
  {
    id: 'electromagnetic-telegraph',
    title: 'Electromagnetic Telegraph (Morse Single-Wire System)',
    tags: ['telegraph', 'morse', 'electromagnet', 'copper-wire', 'key', 'sounder', 'relay', '1830s', 'pre-industrial-electronics'],
    category: 'Electronics',
    difficulty: 'Intermediate',
    historicalEra: '1837 / 1844 (Baltimore–Washington demo)',
    description: 'Samuel Morse\'s single-wire electromagnetic telegraph: a battery, a hand-operated make/break "key" at the sending end, an electromagnet and "sounder" at the receiving end, and Earth itself as the return conductor. Pulses encode letters in Morse code.',
    keyPrinciples: [
      'Soft-iron electromagnet actuation',
      'Single-wire line with Earth (ground) return',
      'Bipolar keying: closed circuit = mark, open circuit = space',
      'Acoustic decoding via sounder armature click',
      'Intermediate relay stations to restore signal over distance',
      'Atmospheric electricity protection via lightning gaps'
    ],
    materialsRequired: [
      'Insulated copper line wire (~14 AWG, gutta-percha or tar-impregnated cotton insulation)',
      'Soft iron bar stock for electromagnet cores (horseshoe shape)',
      'Magnet wire for coil windings (silk- or cotton-insulated, ~18 AWG)',
      'Zinc-carbon wet Leclanché cells (porous pot, manganese dioxide depolarizer)',
      'Hardwood mounting blocks, brass hardware, spring steel for armatures',
      'Copper-clad ground rods (driven into moist soil)',
      'Tinplate lightning arresters with adjustable spark gap'
    ],
    tolerances: 'Wire gauge: 14 AWG ± 0.05 mm diameter; Coil resistance: 4–8 Ω per station; Spark gap: 0.2 mm ± 0.05 mm; Cell EMF: 1.45 V ± 0.05 V per Leclanché cell.',
    stepByStepGuide: `### Phase 1: Build the Station Instruments
1. **Electromagnet:** Wind ~200 turns of 18 AWG silk-covered copper wire around each leg of a soft-iron horseshoe core. Leave lead-out tails and coat the windings with shellac for moisture protection.
2. **Key:** Machine a brass lever on a hardwood base with a platinum contact pin. Add a return spring and a second platinum contact below. Pressing the lever closes the line circuit.
3. **Sounder:** Mount a soft-iron armature on a pivot above the electromagnet. Adjust the limiting screw so the armature clacks against the iron core when the magnet pulls and against a stop post when released. The two clicks encode dot/dash acoustically.
4. **Battery:** Assemble a bank of 8–12 Leclanché wet cells in series (≈12–18 V total) on an insulated shelf with adequate ventilation for ammonia off-gassing.

### Phase 2: String the Line
1. **Pole Route:** Cut straight cedar or chestnut poles 8–10 m tall. Space them 60 m apart in clear terrain, closer where curvature demands.
2. **Crossarms & Insulators:** Mount a single hardwood crossarm with two glazed porcelain "knob" insulators. String the copper wire through the top insulator; reserve the lower for a future second wire.
3. **Grounding:** At each terminal station, drive a 2 m copper-clad rod into permanently damp earth. Solder the return lead to the rod.
4. **Lightning Arresters:** Install a tinplate spark gap (≈0.2 mm) between line and ground at every tenth pole and at each station entrance.

### Phase 3: Operate & Relay
1. **Continuity Test:** Close the key at the sending station. The distant sounder should click. Adjust the sounder limiting screw until dots and dashes are clearly distinguishable by ear alone.
2. **Morse Encoding:** Transmit using standardized American Morse (or Continental code after 1851): short click = dot (·), long click = dash (–), variable space = letter gap, longer space = word gap.
3. **Relay Repeaters:** For runs beyond ~30 km, install an electromechanical relay — its own electromagnet drives a contact that re-broadcasts incoming pulses into the next line segment at full battery voltage.
4. **Traffic Discipline:** Adopt a wire-book ledger. Listen before transmitting. Prefix each message with the destination office call sign and end with the operator's personal "signature" (e.g. "SK").`,
    chronoImpact: 'Collapses long-distance communication time from weeks (by post) to minutes. In time-travel terms, lets you coordinate distant industrial sites, dispatch bootlegger convoys, and report commodity prices weeks before competitors — a compounding economic edge through the 1840s–1870s.'
  },
  {
    id: 'daguerreotype-process',
    title: 'Daguerreotype Photographic Process',
    tags: ['photography', 'daguerreotype', 'silver-iodide', 'mercury-vapor', '1839', 'chemistry', 'portraiture'],
    category: 'Materials & Chemistry',
    difficulty: 'Intermediate',
    historicalEra: '1839 (publicly announced January 1839; fully practical August 1839)',
    description: 'Louis Daguerre\'s process for capturing a permanent direct-positive image on a silver-plated copper sheet sensitized with silver iodide, developed by exposure to mercury vapor, and fixed with sodium thiosulfate ("hypo"). One-of-a-kind image; exposure times start at ~10 minutes and drop toward 30 seconds by the 1840s with lens and chemistry improvements.',
    keyPrinciples: [
      'Silver iodide photodecomposition under UV/visible light',
      'Latent image amplification via mercury vapor amalgamation',
      'Selective dissolution of unexposed silver halides by thiosulfate',
      'Optical inversion: plate faces the lens and reads as a mirror',
      'Spectral sensitivity peak in the near-UV (~350–400 nm) — blue sky records bright, red lips record dark'
    ],
    materialsRequired: [
      'Rolled copper sheet (~1.6 mm thick), 8×10 cm or larger',
      'Fine silver (99.9%) for electroplating — approx. 3 g per plate',
      'Iodine crystals (sublimed) for fuming box sensitization',
      'Bromine optional, for faster "accelerator" plates from 1840 onward',
      'Mercury (≈2 kg per fuming trough; highly toxic — fume hood required)',
      'Sodium thiosulfate ("hypo") for fixing',
      'Distilled water, sodium carbonate, nitric acid for cleaning',
      'Cork and velvet buffing wheels for final plate polishing',
      'Wollaston-style landscape lens (early); Chevalier achromat (post-1841)'
    ],
    tolerances: 'Silver layer thickness: 2–4 µm (electroplate); Iodide sensitization time: 15–45 min at 15°C; Mercury development time: 25–40 min at 60°C; Fixing: 5–10 min in 10% thiosulfate.',
    stepByStepGuide: `### Phase 1: Plate Preparation
1. **Shear & Trim:** Cut copper sheet to size. File and burnish edges.
2. **Electroplate Silver:** In a silver-cyanide or silver-nitrate plating bath, deposit 2–4 µm of pure silver onto one face at ~0.5 A/dm² for 15 minutes. The silver must be thick enough to take a mirror polish but thin enough to flex slightly.
3. **Polish:** Wet-polish progressively with rouge on felt, then buff dry on a cork wheel. The plate must end as a perfect mirror — any scratch will appear in the final image.

### Phase 2: Sensitization
1. **Iodine Fuming Box:** Place iodine crystals in the bottom of a sealed wooden box, lined with paper. Suspend the polished plate face-down above the crystals.
2. **Coat Formation:** At ~15°C, allow iodine vapor to react with the silver for 15–45 minutes. The silver surface will pass through pale yellow → rose → blue-grey as a layer of photosensitive silver iodide (AgI) grows. The correct endpoint is a faint straw-gold color (the most sensitive layer).
3. **Dark Storage:** Load the sensitized plate into a light-tight plate holder immediately. Plates are usable for 1–3 hours before spontaneous fog degrades the latent image.

### Phase 3: Exposure
1. **Camera Setup:** Use a sliding wooden box camera with a brass landscape lens (~f/14). Focus on ground glass, then swap in the plate holder.
2. **Expose:** In full midday sunlight, exposure runs 10–15 minutes for a still subject. With a fast Chevalier achromat and bromine-accelerated plates, drop to 30–60 seconds. The plate remains visibly unchanged — the image is latent.

### Phase 4: Mercury Development
1. **Fume Trough:** Pour mercury into the bottom of a shallow iron trough. Heat from below with a spirit lamp until a thermometer reads 60°C.
2. **Develop:** Suspend the exposed plate face-down over the mercury vapor for 25–40 minutes. Where light struck, tiny mercury-silver amalgam droplets form, building up the bright highlights of the image.
3. **Inspect:** A correctly developed plate shows a ghostly image when viewed at a flat angle; it is fully formed only after fixing.

### Phase 5: Fix & Mount
1. **Wash:** Rinse plate in distilled water to remove soluble iodides.
2. **Fix:** Immerse in 10% sodium thiosulfate solution for 5–10 minutes until unexposed silver halides dissolve. The image is now light-stable.
3. **Final Rinse & Dry:** Wash in running water for 20 minutes to remove all fixer (residual hypo causes long-term image fade), then dry over a spirit lamp.
4. **Mount:** Seal the plate behind glass in a brass preserver frame to protect the soft amalgam from abrasion and atmospheric sulfur.`,
    chronoImpact: 'Replaces portrait commissions that took days (oil painting) with a session measured in minutes. For a time traveler: immediate likenesses enable identity verification, wanted posters, newspaper front-page illustrations, and the very first wave of mass-circulation visual journalism — a decisive advantage in any propaganda or financial-panic scenario.'
  },
  {
    id: 'monier-reinforced-concrete',
    title: 'Monier Reinforced Concrete (Iron-Mesh Composite)',
    tags: ['concrete', 'monier', 'reinforced', 'cement', 'iron-mesh', '1867', 'civil-engineering'],
    category: 'Materials & Chemistry',
    difficulty: 'Basic',
    historicalEra: '1867 (Monier patent) — refined through 1880s',
    description: 'Joseph Monier\'s composite of Portland cement concrete reinforced with an inner cage of iron rods or wire mesh. The concrete carries compressive load; the iron carries tensile load. Together they form a slab, beam, or pipe far stronger than either material alone.',
    keyPrinciples: [
      'Compressive strength of cured Portland cement paste (≈20–40 MPa)',
      'Tensile strength of wrought iron / mild steel (≈200–250 MPa)',
      'Alkaline passivation of embedded iron by cement pore solution (pH ~12.5)',
      'Bond stress transfer between iron ribs and concrete matrix',
      'Thermal-expansion match between iron and concrete (~12 × 10⁻⁶ /°C)'
    ],
    materialsRequired: [
      'Portland cement (≈1 part by volume; rotary-kiln grade after 1885)',
      'Clean sharp sand (≈2 parts; graded 0–4 mm)',
      'Crushed stone or gravel aggregate (≈4 parts; graded 4–20 mm)',
      'Clean water (≈0.5 parts; potable, low chloride)',
      'Wrought iron or mild steel bars, ~10–20 mm diameter',
      'Iron-wire mesh or expanded metal lath for thin slabs',
      'Wooden formwork (planks, stakes, ties), oiled to release',
      'Tampers, screed boards, and a curing pond or wet burlap'
    ],
    tolerances: 'Water/cement ratio: 0.45–0.55 by weight; Aggregate max size: ≤ 20 mm; Cover over outer bars: ≥ 25 mm; Cure time before load: 28 days; Slump at pour: 75–100 mm.',
    stepByStepGuide: `### Phase 1: Formwork & Iron Cage
1. **Build Forms:** Construct oiled wooden forms to the exact shape of the finished member (beam, slab, pipe, tank). Brace heavily — wet concrete is dense (~2400 kg/m³) and will distort underweight.
2. **Cut & Bend Iron:** Cut iron bars to length. Bend stirrups and corner hooks cold over a vise. Assemble the cage by tying bars at intersections with iron wire ("soft ties"). Keep the cage off the form bottom by setting it on stone or concrete spacer blocks to guarantee ≥25 mm cover.

### Phase 2: Mix Concrete
1. **Measure:** Combine 1 part cement, 2 parts sand, 4 parts aggregate in a clean mixing board or rotary drum.
2. **Add Water:** Pour in potable water slowly until the mix reaches plastic, workable consistency (slump 75–100 mm). Too dry → honeycombing. Too wet → cracking and weak surface.
3. **Mix Thoroughly:** Turn at least three full times until uniform color and consistency.

### Phase 3: Pour & Consolidate
1. **Place:** Shovel or chute the wet concrete into the form in lifts of ~150 mm. Avoid dropping from more than 1 m — it will segregate.
2. **Tamp:** Rod each lift with a slim iron bar or use a vibrating tamper to release trapped air pockets around the iron cage. Air voids next to the iron cause rust and spalling.
3. **Screed:** Strike off the top surface flat with a screed board.

### Phase 4: Cure
1. **Keep Moist:** Cover with wet burlap, straw, or standing water. Re-wet twice daily for 7 days minimum.
2. **Maintain Temperature:** Above 10°C for the first 48 hours. Cold (below 5°C) stops hydration and ruins the pour.
3. **Strip Forms:** After 7 days for vertical form sides, 14–28 days for structural soffits. Do not load the member with design load until 28 days have passed.

### Phase 5: Service
1. **Crack Inspection:** Hairline shrinkage cracks are normal; running cracks or rust staining through the surface indicate cover failure.
2. **Jointing:** For long slabs, cut control joints every 4–6 m to localize shrinkage cracking.
3. **Repair:** Patch spalls with a cement-sand mortar bonded with a bonding agent. Replace corroded surface bars by chipping back to sound concrete.`,
    chronoImpact: 'Cuts building cost ~30% versus stone or brick while enabling longer spans, taller walls, and monolithic construction. A traveler bootstrapping a town in the 1870s–1890s can build factories, bridges, water tanks, and sewers months ahead of the historical schedule — and own the regional cement monopoly if they secure a quarry first.'
  },
  {
    id: 'benz-internal-combustion-engine',
    title: 'Single-Cylinder Four-Stroke Gasoline Engine (Benz Patent-Motorwagen)',
    tags: ['internal-combustion', 'benz', 'four-stroke', 'gasoline', 'carburetor', '1885', 'machine-tooling'],
    category: 'Machine Tooling',
    difficulty: 'Advanced',
    historicalEra: '1885 (Benz Patent-Motorwagen, Patent-Motorwagen Nr. 1)',
    description: 'Karl Benz\'s 954 cc single-cylinder four-stroke gasoline engine running at ~400 rpm, output ~0.75 hp. Each cylinder is cast iron with a water jacket; a surface carburetor vaporizes fuel; ignition is by hot-tube or low-voltage trembler coil; cooling is thermosiphon via a radiator.',
    keyPrinciples: [
      'Four-stroke Otto cycle: intake, compression, power, exhaust',
      'Surface carburetion: fuel film evaporates into inducted air',
      'Ignition: timed hot-tube or trembler-coil spark (~15 kV)',
      'Thermosiphon water cooling (no pump)',
      'Hot-tube ignition via external gas flame (~700°C)'
    ],
    materialsRequired: [
      'Cast iron for cylinder block, piston, and crankcase',
      'Forged steel crankshaft, connecting rod, and flywheel shaft',
      'Mild steel or brass water jacket around cylinder',
      'Wrought-iron or copper fuel and water piping',
      'Surface carburetor (brass float bowl, calibrated jet, throttle butterfly)',
      'Hot-tube ignition: porcelain tube with platinum wire coil, Bunsen burner',
      'Lead-acid or zinc-carbon primary battery for coil (trembler) ignition',
      'Linen or leather drive belt; roller chain for final drive',
      'Pattern wood for sand casting the cylinder block and piston'
    ],
    tolerances: 'Cylinder bore: 150 mm ± 0.05 mm; Piston-to-bore clearance: 0.10–0.15 mm; Crankshaft bearing journal: ± 0.02 mm; Compression ratio: 3.5:1 ± 0.2; Ignition timing: 10–15° BTDC.',
    stepByStepGuide: `### Phase 1: Pattern & Casting
1. **Pattern Shop:** Carve wood patterns of the cylinder block and piston. Allow 1.5% shrink per side for cast iron.
2. **Sand Cast:** Ram green-sand molds around the patterns. Pour molten cast iron (≈1300°C) into the mold box. Allow 24 hours to cool before shakeout.
3. **Anneal:** Stress-relieve the cylinder casting at 600°C for 4 hours to prevent distortion during machining.

### Phase 2: Machining
1. **Rough Bore:** On a vertical boring mill, rough-bore the cylinder to ~150 mm + 1 mm.
2. **Final Bore & Hone:** Finish-bore to 150 mm ± 0.025 mm. Hone with progressively finer stones to a 0.4 µm Ra surface finish.
3. **Face & Drill:** Face the deck surface flat. Drill and tap bolt holes for the cylinder head and water jacket.
4. **Crankshaft:** Turn, mill, and grind the crankshaft from forged steel. Hardness HRC 55–60 at the journals; nitride or case-harden the bearing surfaces.
5. **Piston:** Machine the piston from a close-grained cast-iron blank. Leave 0.10–0.15 mm clearance to the bore for thermal expansion. Cut two groove rings for cast-iron piston rings.

### Phase 3: Carburetor & Ignition
1. **Carburetor:** Solder a brass float bowl with a cork or brass float. Drill and ream a calibrated main jet (~1.0 mm). Mount a butterfly throttle valve ahead of the venturi.
2. **Hot Tube:** Bend a porcelain tube into a "J" shape with a platinum coil at the closed end. Mount it so its mouth protrudes into the combustion chamber. Heat externally with a gas Bunsen burner.
3. **Trembler Coil (optional, post-1886):** Wind a low-voltage primary (10 turns) and high-voltage secondary (~200 turns of fine wire) on an iron core. Drive it from a 6 V primary battery through a cam-driven contact ("trembler") timed to crank rotation.

### Phase 4: Assembly
1. **Crankcase:** Bolt the cylinder block to the cast-iron crankcase. Mount crankshaft on Babbitt-metal bearings.
2. **Piston & Rod:** Slip cast-iron piston rings into grooves. Bolt connecting rod to piston with a gudgeon pin and to the crankshaft with a big-end bearing.
3. **Cooling:** Pipe the water jacket to a small radiator via thermosiphon. Fill with distilled water plus a touch of sodium silicate to inhibit corrosion.
4. **Fuel Line:** Run a copper line from a fuel tank to the carburetor float bowl. Use gasoline distilled to ~0.71 specific gravity (modern pump gasoline works).

### Phase 5: Start & Tune
1. **Crank:** Hand-crank the flywheel through the compression stroke until the engine fires.
2. **Ignition Timing:** Rotate the hot tube or adjust the trembler cam so the spark lands 10–15° before top-dead-center. Too early → kickback. Too late → power loss and overheating.
3. **Mixture:** Adjust the carburetor jet until the engine runs smoothly at idle (~250 rpm) and pulls cleanly to redline (~500 rpm).
4. **Run-In:** Run at half load for the first 20 hours, monitoring cylinder temperature. Re-torque head bolts after the first hour as castings seat.`,
    chronoImpact: 'Establishes the gasoline internal-combustion engine three years before Daimler and five years before the American Duryea. A traveler can patent the design immediately, license it to carriage makers, and capture the entire 1890s automotive-supply chain before Ford\'s assembly line appears. Practically: the 1885 engine is also an out-of-the-box farm-station power unit for mills, pumps, and small generators.'
  }
];
