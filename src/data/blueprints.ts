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
  }
];
