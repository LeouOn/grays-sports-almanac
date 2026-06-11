export interface MedicalIntervention {
  id: string;
  condition: string;
  description: string;
  optimalYear: number;
  targetRecipient: string;
  deliveryMethod: string;
  estimatedLivesSaved: string;
  butterflyRisk: 'Low' | 'Medium' | 'High' | 'Extreme';
  details: string;
  tags?: string[];
}

export const medicalInterventions: MedicalIntervention[] = [
  {
    id: 'h-pylori',
    condition: 'H. Pylori & Peptic Ulcers',
    tags: ['h-pylori', 'ulcers', 'bacteria', 'antibiotics', 'gastroenterology', 'marshall', 'warren', 'nobel-prize'],
    description: 'Bacterium causes 90% of duodenal ulcers and 80% of gastric ulcers. Treatable with a 2-week antibiotic course instead of lifelong antacids or surgery.',
    optimalYear: 1979,
    targetRecipient: 'Barry Marshall / Robin Warren, Royal Perth Hospital, Australia',
    deliveryMethod: 'Send a clinical case file to Warren in early 1979 with H. pylori culture methods, treatment protocol (bismuth + metronidazole + tetracycline), and before/after endoscopic images.',
    estimatedLivesSaved: 'Millions spared unnecessary surgery and stomach cancer',
    butterflyRisk: 'Low',
    details: 'Warren first observed the bacteria in gastric biopsies in 1979. Marshall famously drank a culture in 1984 to prove causation. Their breakthrough was dismissed until the 1990s. Accelerating acceptance by even 5 years prevents enormous suffering. They won the 2005 Nobel Prize.'
  },
  {
    id: 'aids-early',
    condition: 'HIV/AIDS Early Warning & Response',
    tags: ['hiv', 'aids', 'retrovirus', 'cd4', 't-cells', 'cdc', 'blood-screening', 'pandemic'],
    description: 'HIV-1 retrovirus causes AIDS. Transmission: blood, sexual contact, mother-to-child. Prevention: condoms, clean needles, blood screening. First clusters appeared in 1981 but the virus likely circulated since the 1960s.',
    optimalYear: 1978,
    targetRecipient: 'CDC (Centers for Disease Control), Atlanta, USA',
    deliveryMethod: 'Anonymous typed letter to the CDC Director in 1978: "A novel retrovirus targeting CD4+ T-cells is spreading in the US, primarily among IV drug users and men who have sex with men. Transmission: blood and sexual contact. Test the blood supply using ELISA. Begin public health education immediately. The virus has a long incubation period — cases will appear in 1981. Act now."',
    estimatedLivesSaved: 'Potentially millions — accelerating the response by even 2-3 years changes the entire epidemic trajectory',
    butterflyRisk: 'Extreme',
    details: 'The earliest known US case was in 1969. By the time GRID (Gay-Related Immune Deficiency) was recognized in 1981, the virus had spread widely. Earlier blood screening, safe-sex education, and research funding could prevent a significant portion of the 40M+ cumulative deaths. The butterfly risk is extreme because this changes demographic trajectories globally.'
  },
  {
    id: 'reye-syndrome',
    condition: 'Reye\'s Syndrome / Aspirin Warning',
    description: 'Reye\'s Syndrome: rapid liver failure and brain swelling in children given aspirin during viral infections (flu, chickenpox). Mortality rate ~30%. Survivors often have permanent brain damage.',
    optimalYear: 1977,
    targetRecipient: 'CDC Epidemiology Program Office, Atlanta, USA',
    deliveryMethod: 'Send a "case-control study analysis" to the CDC showing the aspirin-Reye\'s link with clear odds ratios. The CDC was already investigating Reye\'s — this gives them the answer ~3 years early.',
    estimatedLivesSaved: '500-1,000+ children (plus prevents permanent brain damage in survivors)',
    butterflyRisk: 'Low',
    details: 'The CDC confirmed the link in 1980 and the FDA required warning labels in 1986. Moving the warning to 1980-82 prevents hundreds of cases during peak incidence years. The Reye\'s incidence dropped 90%+ after aspirin warnings were implemented in the UK and US.'
  },
  {
    id: 'lead-exposure',
    condition: 'Childhood Lead Exposure Reduction',
    description: 'Lead is a neurotoxin. Childhood exposure (primarily from leaded gasoline and lead paint) causes permanent IQ reduction, behavioral disorders, and developmental delays. The effects are dose-dependent with no safe threshold.',
    optimalYear: 1974,
    targetRecipient: 'EPA (Environmental Protection Agency) and major newspapers (NYT, WaPo)',
    deliveryMethod: 'Leak a "confidential EPA analysis" to NYT and WaPo in 1974 showing the IQ impact of leaded gasoline on urban children. Include blood lead level data from inner-city cohorts. Public pressure accelerates the phase-out by a decade.',
    estimatedLivesSaved: 'Prevents IQ loss across entire generations — hard to quantify but enormous',
    butterflyRisk: 'Low',
    details: 'EPA began regulating lead in gasoline in 1973; the phase-out was completed in 1996. Accelerating this to completion by 1985 prevents millions of children from elevated blood lead levels. The science was settled — the barrier was the Ethyl Corporation\'s lobbying.'
  },
  {
    id: 'fetal-alcohol',
    condition: 'Fetal Alcohol Syndrome Awareness',
    description: 'Alcohol consumption during pregnancy causes Fetal Alcohol Spectrum Disorders (FASD): facial abnormalities, growth deficiency, CNS damage, intellectual disability. 100% preventable.',
    optimalYear: 1975,
    targetRecipient: 'CDC and Surgeon General\'s office, USA',
    deliveryMethod: 'Send a research summary to the CDC in 1975 documenting the teratogenic effects of alcohol with clinical photos and outcomes. The term "Fetal Alcohol Syndrome" was coined in 1973 — you\'re reinforcing emerging science.',
    estimatedLivesSaved: 'Prevents thousands of FASD cases through earlier public health warnings',
    butterflyRisk: 'Low',
    details: 'FAS was first described in English literature in 1973 (Jones & Smith). The Surgeon General issued the first advisory in 1981. Getting that advisory to 1977-78 and making it stronger saves thousands of children from preventable disability.'
  },
  {
    id: 'hepatitis-b',
    condition: 'Hepatitis B Vaccine Acceleration',
    description: 'Hepatitis B virus causes chronic liver disease and hepatocellular carcinoma. A plasma-derived vaccine was developed in 1981; a recombinant vaccine followed in 1986.',
    optimalYear: 1977,
    targetRecipient: 'CDC and WHO immunization programs',
    deliveryMethod: 'Send a research brief to WHO in 1978 summarizing the recombinant DNA approach to Hep B vaccine production (insert HBsAg gene into yeast cells). This accelerates the transition from plasma-derived to recombinant vaccine.',
    estimatedLivesSaved: 'Hundreds of thousands (Hep B causes ~800,000 deaths/year globally, mostly from liver cancer)',
    butterflyRisk: 'Medium',
    details: 'The plasma-derived vaccine (Heptavax-B, 1981) was effective but expensive and had limited supply. The recombinant vaccine (Recombivax HB, 1986) solved both problems. Accelerating the recombinant approach by 3-4 years brings universal vaccination programs forward.'
  },
  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    id: 'hiv-haart',
    condition: 'Triple-Drug HIV Therapy (HAART)',
    description: 'Highly Active Antiretroviral Therapy (HAART) combines three drugs (like protease inhibitors with RT inhibitors) to suppress HIV replication, preventing AIDS and resistance.',
    optimalYear: 1995,
    targetRecipient: 'David Ho at Aaron Diamond AIDS Research Center, NYC',
    deliveryMethod: 'Deliver a detailed molecular report and clinical trial protocol for combination antiretroviral therapy (specifically targeting viral load suppression with protease inhibitors) in early 1995.',
    estimatedLivesSaved: 'Millions of lives saved globally, turning HIV from a death sentence into a manageable chronic condition',
    butterflyRisk: 'Medium',
    details: 'HAART was announced at the 1996 Vancouver AIDS Conference and immediately revolutionized care. Accelerating combination therapy clinical trials by 18 months saves hundreds of thousands of lives during the peak of the epidemic in the US and Europe.'
  },
  {
    id: 'mammal-cloning',
    condition: 'Somatotype Somatic Cell Nuclear Transfer (SCNT)',
    description: 'Cloning mammals using somatic cells (adult body cells) rather than embryonic cells. Replaces the dogma that adult cells are irreversibly differentiated.',
    optimalYear: 1996,
    targetRecipient: 'Ian Wilmut / Keith Campbell, Roslin Institute, Scotland',
    deliveryMethod: 'Deliver a technical protocol on electrical pulse parameters and nuclear transfer synchronization for fused enucleated oocytes in late 1995.',
    estimatedLivesSaved: 'Accelerates regenerative medicine, cell therapy, and agricultural biotechnology',
    butterflyRisk: 'Medium',
    details: 'Dolly the sheep was born July 5, 1996, proving SCNT was possible in mammals. Accelerating this discovery clarifies ethical guidelines earlier and establishes biotech research benchmarks.'
  },
  {
    id: 'human-genome-hgp',
    condition: 'Human Genome Project Acceleration',
    description: 'Mapping and sequencing the entire human genome. The draft sequence was published in 2001; the complete sequence in 2003.',
    optimalYear: 1990,
    targetRecipient: 'Francis Collins / James Watson, National Institutes of Health (NIH), USA',
    deliveryMethod: 'Send a technical brief describing automated high-throughput capillary electrophoresis sequencing systems (developed in late 90s) and shotgun sequencing algorithms (Celera method) in 1990.',
    estimatedLivesSaved: 'Millions (by bringing forward gene therapies, cancer targeted therapies, and personalized medicine by a decade)',
    butterflyRisk: 'Low',
    details: 'The HGP began officially in 1990 and was completed in 2003. Accelerating the genome sequence by providing capillary electrophoresis and computational assembly algorithms early brings forward the entire age of genomics by 5-10 years.'
  },

  // ── 1950s / 1960s EXPANSIONS ─────────────────────────────
  {
    id: 'salk-vaccine-accel',
    condition: 'Polio Vaccine (Salk IPV) Field Trial Acceleration',
    tags: ['polio', 'vaccine', 'salk', 'ipv', 'inactivated-virus', 'field-trial', 'march-of-dimes', 'epidemiology', 'public-health'],
    description: 'The 1954 Salk vaccine field trial was the largest public health experiment in history: 1.8 million children. The vaccine was proven effective and licensed April 12, 1955. The 1952 polio epidemic was the worst in US history (58,000 cases, 3,145 deaths, 21,269 paralyzed).',
    optimalYear: 1951,
    targetRecipient: 'Jonas Salk, University of Pittsburgh / Basil O\'Connor, National Foundation for Infantile Paralysis',
    deliveryMethod: 'Send Salk the formalin inactivation protocol (1:250 formaldehyde, 37°C, specific duration by virus strain) and the double-blind placebo-controlled trial design in early 1951. This eliminates 2-3 years of optimization work.',
    estimatedLivesSaved: '~3,000 deaths and ~20,000 paralysis cases prevented during the 1952-54 polio seasons',
    butterflyRisk: 'Low',
    details: 'Salk began polio work in 1947. The 1952 epidemic was devastating. The field trial ran April-December 1954 and the vaccine was licensed April 12, 1955. Cutting 2 years from development means the vaccine is available before the worst epidemic ever hits. The Cutter Incident (bad batches from one manufacturer) caused 200 paralysis cases — a warning about quality control could prevent those too.'
  },
  {
    id: 'thalidomide-warning',
    condition: 'Thalidomide Teratogenicity Prevention',
    tags: ['thalidomide', 'teratogen', 'birth-defects', 'phocomelia', 'fda', 'frances-kelsey', 'drug-safety', 'sedative', 'pregnancy'],
    description: 'Thalidomide was marketed as a mild sedative and anti-nausea drug for pregnant women starting in 1957 (West Germany). It caused severe birth defects (phocomelia — limb malformations) in ~10,000 babies worldwide. FDA reviewer Frances Kelsey blocked its US approval, preventing thousands of American cases.',
    optimalYear: 1959,
    targetRecipient: 'Frances Kelsey at the FDA, and Dr. Widukind Lenz in West Germany',
    deliveryMethod: 'Send Kelsey and Lenz a dossier in 1959 documenting the phocomelia-thalidomide link with case reports from Germany and England. Kelsey was already skeptical — your data gives her ammunition to block approval sooner and forces an earlier international recall.',
    estimatedLivesSaved: '~10,000 babies from birth defects (prevents cases in UK, Germany, Japan, and other countries where the drug was already on market)',
    butterflyRisk: 'Low',
    details: 'Thalidomide was sold in 46 countries starting in 1957. The link to birth defects was identified by Lenz and McBride independently in 1961. The drug was withdrawn in late 1961. Kelsey blocked US approval in 1960-61 (for different reasons — she wanted more data). Providing the teratogenicity evidence 2 years earlier prevents thousands of birth defects globally.'
  },
  {
    id: 'open-heart-surgery',
    condition: 'Open Heart Surgery / Cardiopulmonary Bypass',
    tags: ['cardiac-surgery', 'heart', 'bypass', 'lillehei', 'gibbon', 'oxygenator', 'open-heart', 'cardiothoracic', 'dewall'],
    description: 'The first successful open-heart surgery using a heart-lung machine was performed by John Gibbon in 1953 (closure of an atrial septal defect). C. Walton Lillehei at the University of Minnesota pioneered cross-circulation (1954) and then the DeWall-Lillehei bubble oxygenator (1955), making open-heart surgery practical.',
    optimalYear: 1950,
    targetRecipient: 'C. Walton Lillehei at the University of Minnesota / Richard DeWall',
    deliveryMethod: 'Send Lillehei the DeWall bubble oxygenator design (helix reservoir, bubble trap, defoamer) in 1950 — 5 years before he and DeWall invented it. Also include the cross-circulation technique (using a parent as a living oxygenator) as an intermediate step.',
    estimatedLivesSaved: 'Tens of thousands (open-heart surgery became the basis for valve replacement, coronary bypass, and heart transplants)',
    butterflyRisk: 'Low',
    details: 'Gibbon\'s 1953 success was with a complex and expensive screen oxygenator. Lillehei\'s cross-circulation (1954) was ethically risky (could kill the parent). The DeWall-Lillehei bubble oxygenator (1955) was cheap, simple, and reusable — it democratized open-heart surgery. Providing it 5 years early accelerates the entire field of cardiac surgery.'
  },
  {
    id: 'oral-contraceptive',
    condition: 'Oral Contraceptive Pill Development',
    tags: ['birth-control', 'pill', 'oral-contraceptive', 'pincus', 'rock', 'sanger', 'planned-parenthood', 'synthetic-progesterone', 'estrogen', 'reproductive-health'],
    description: 'The first oral contraceptive (Enovid) was developed by Gregory Pincus and John Rock, funded by Margaret Sanger and Katharine McCormick. FDA approved it in 1960. It transformed women\'s autonomy, family planning, and demographics worldwide.',
    optimalYear: 1952,
    targetRecipient: 'Gregory Pincus at the Worcester Foundation for Experimental Biology',
    deliveryMethod: 'Send Pincus a research memo in 1952 with: (1) the specific synthetic progestin compounds (norethynodrel/norethindrone) that proved effective, (2) the dosing protocol (10mg + 150mcg estrogen for 20 days/month), (3) the Puerto Rico clinical trial design that was eventually used. This eliminates 6 years of compound screening.',
    estimatedLivesSaved: 'Not measured in lives saved, but in autonomy: the Pill enabled women to control reproduction, enter the workforce, and reduced maternal mortality from unwanted pregnancies. Demographic impact is immeasurable.',
    butterflyRisk: 'Medium',
    details: 'Pincus began hormonal contraception research in 1951. Sanger introduced him to McCormick (who funded the entire project with $2M of her own money). The first clinical trials ran in Puerto Rico 1956-57. FDA approved Enovid in 1960. Accelerating by 3-4 years means the Pill is available by 1956-57, transforming the late 1950s instead of the 1960s.'
  },
  {
    id: 'kidney-transplant',
    condition: 'Kidney Transplant / Immunosuppression',
    tags: ['transplant', 'kidney', 'immunosuppression', 'azathioprine', 'murray', 'hume', 'rejection', 'tissue-matching', 'organ-donor'],
    description: 'The first successful kidney transplant between identical twins was performed by Joseph Murray in 1954 (Nobel Prize 1990). The breakthrough for unrelated donors came with azathioprine (an immunosuppressant) in 1962, enabling transplants between non-identical individuals.',
    optimalYear: 1957,
    targetRecipient: 'Joseph Murray at Peter Bent Brigham Hospital, Boston / Roy Calne, Royal Free Hospital, London',
    deliveryMethod: 'Send Murray and Calne a research memo in 1957 with: (1) 6-mercaptopurine (6-MP) and its derivative azathioprine as immunosuppressive agents, (2) dosing protocols, (3) tissue typing (HLA matching) methodology. Murray was already doing twin transplants — this gives him the immunosuppression piece 5 years early.',
    estimatedLivesSaved: 'Tens of thousands (kidney failure was a death sentence before transplantation and dialysis)',
    butterflyRisk: 'Low',
    details: 'Murray\'s 1954 twin transplant worked because identical twins don\'t reject each other\'s tissue. The challenge was transplanting between unrelated people. Azathioprine (developed by Elion and Hitchings, who won the 1988 Nobel) was first used clinically in 1962. Providing it in 1957 means unrelated-donor transplants by 1958-59 instead of 1962-63.'
  },
  {
    id: 'measles-vaccine',
    condition: 'Measles Vaccine',
    tags: ['measles', 'vaccine', 'enders', 'milieu', 'live-attenuated', 'mMR', 'pediatric', 'viral', 'public-health'],
    description: 'Measles killed ~500 children per year in the US and caused encephalitis in thousands more before the vaccine. John Enders\' lab developed the live attenuated measles vaccine (Edmonston strain), licensed in 1963. Maurice Hilleman later improved it into the MMR combination vaccine.',
    optimalYear: 1959,
    targetRecipient: 'John Enders at Harvard / Maurice Hilleman at Merck',
    deliveryMethod: 'Send Enders\' lab the specific cell culture passage protocol for the Edmonston strain attenuation (chick embryo fibroblast cells, specific passage numbers) in 1959. Enders\' team had already isolated the virus — they just needed the attenuation protocol. Also send Hilleman the MMR combination concept for when he joins Merck.',
    estimatedLivesSaved: '~500/year in the US alone during peak years; millions globally over subsequent decades',
    butterflyRisk: 'Low',
    details: 'Enders\' lab isolated the measles virus in 1954. The vaccine development took 9 years (licensed 1963). The disease caused 400-500 deaths per year in the US and permanent disability (deafness, intellectual disability from encephalitis) in thousands more. Hilleman\'s MMR vaccine (1971) combined measles, mumps, and rubella. Accelerating the measles vaccine by 2-3 years prevents thousands of deaths.'
  },
  {
    id: 'cpr-chest-compression',
    condition: 'CPR (Cardiopulmonary Resuscitation) Standardization',
    tags: ['cpr', 'chest-compression', 'resuscitation', 'cardiac-arrest', 'defibrillation', 'acls', 'emergency-medicine', 'american-heart-association'],
    description: 'Modern CPR (closed-chest compression + mouth-to-mouth ventilation) was developed and demonstrated by William Kouwenhoven, James Jude, and Guy Knickerbocker at Johns Hopkins in 1960. The American Heart Association formally endorsed CPR in 1963. Before CPR, cardiac arrest outside a hospital was almost universally fatal.',
    optimalYear: 1957,
    targetRecipient: 'William Kouwenhoven at Johns Hopkins University',
    deliveryMethod: 'Send Kouwenhoven a research memo in 1957 describing: (1) closed-chest compression technique (rate 60-80/min, depth 1.5-2 inches, sternum compression), (2) the observation that chest compressions alone generate measurable arterial pressure, (3) the combination with expired-air ventilation. His team discovered this by accident in 1959 — you\'re giving them the answer 2 years early.',
    estimatedLivesSaved: 'Impossible to quantify — CPR has saved millions of lives worldwide since 1960',
    butterflyRisk: 'Low',
    details: 'Kouwenhoven\'s team was studying defibrillation when they noticed that pressing on the chest of a dog in cardiac arrest generated a pulse. They published their findings in 1960 and demonstrated CPR publicly. The AHA endorsed it in 1963. Providing the technique in 1957 means CPR is standard medical practice by 1958-59 instead of 1963.'
  },
  {
    id: 'antipsychotic-chlorpromazine',
    condition: 'Antipsychotic Medication (Chlorpromazine/Thorazine)',
    tags: ['chlorpromazine', 'thorazine', 'antipsychotic', 'psychiatry', 'schizophrenia', 'mental-health', 'deinstitutionalization', 'rhône-poulenc'],
    description: 'Chlorpromazine (Thorazine) was the first effective antipsychotic drug, transforming the treatment of schizophrenia and other severe mental illnesses. Developed in France (Rhône-Poulenc, 1950) and introduced to psychiatry by Henri Laborit and Pierre Deniker. FDA approved in 1954. It emptied mental asylums.',
    optimalYear: 1950,
    targetRecipient: 'Henri Laborit at Val-de-Grâce military hospital, Paris',
    deliveryMethod: 'Send Laborit the pharmacological profile of chlorpromazine (a phenothiazine derivative with dopamine D2 receptor antagonism) in 1950. He was already using it as an anesthetic adjunct — you\'re providing the specific psychiatric application and dosing protocol for schizophrenia.',
    estimatedLivesSaved: 'Hundreds of thousands freed from institutional warehousing; immeasurable reduction in human suffering',
    butterflyRisk: 'Low',
    details: 'Chlorpromazine was synthesized in 1950 and first used in psychiatry in 1952 by Delay and Deniker in Paris. FDA approved it in 1954. It was the first drug that actually treated psychosis rather than just sedating patients. The number of institutionalized psychiatric patients in the US dropped from 560,000 in 1955 to ~100,000 by 1980. While deinstitutionalization had complex outcomes, the drug itself was revolutionary.'
  },
  {
    id: 'sabin-oral-polio',
    condition: 'Oral Polio Vaccine (Sabin OPV)',
    tags: ['polio', 'vaccine', 'sabin', 'opv', 'oral', 'live-attenuated', 'who', 'global-eradication', 'sugar-cube'],
    description: 'Albert Sabin\'s oral polio vaccine (OPV) used live attenuated virus administered on a sugar cube. Unlike Salk\'s injected vaccine (IPV), OPV provided intestinal immunity (stopping transmission) and was cheap enough for mass global vaccination campaigns. Licensed in the US in 1962, it became the backbone of the global polio eradication effort.',
    optimalYear: 1954,
    targetRecipient: 'Albert Sabin at Cincinnati Children\'s Hospital',
    deliveryMethod: 'Send Sabin the specific attenuated strain passage protocol (the three attenuated strains that became the trivalent OPV) and the sugar cube delivery method in 1954. Sabin was already working on attenuated strains — you\'re giving him the specific attenuation passage sequence that took him 7 years to develop.',
    estimatedLivesSaved: 'Millions globally — OPV was the vaccine that eradicated polio from most of the world',
    butterflyRisk: 'Low',
    details: 'Sabin and Salk had an intense rivalry. Salk\'s IPV was first (1955) but required injection and didn\'t stop transmission. Sabin\'s OPV (licensed 1962) was taken orally, cost pennies, and created intestinal immunity. The USSR adopted OPV first (1959) and used it to eradicate polio. The WHO used OPV for the global eradication campaign. Accelerating OPV by 4-5 years means the global eradication effort starts in the mid-1950s instead of the late 1960s.'
  },
  {
    id: 'tetracycline-broad',
    condition: 'Broad-Spectrum Antibiotics (Tetracycline)',
    tags: ['tetracycline', 'antibiotic', 'broad-spectrum', 'pfizer', 'chlotetracycline', 'aureomycin', 'bacterial-infection', 'infectious-disease'],
    description: 'Chlortetracycline (Aureomycin) was discovered by Benjamin Duggar at Lederle Labs in 1948 — the first broad-spectrum antibiotic. Pfizer developed oxytetracycline (Terramycin) in 1950 and tetracycline itself in 1953. These drugs treated dozens of previously untreatable bacterial infections.',
    optimalYear: 1948,
    targetRecipient: 'Benjamin Duggar at Lederle Laboratories / Pfizer research division',
    deliveryMethod: 'Send Duggar the soil sample location and culture conditions for Streptomyces aureofaciens (the organism that produces chlortetracycline) in 1946. Duggar was already screening soil organisms — you\'re pointing him directly at the winning sample.',
    estimatedLivesSaved: 'Millions — broad-spectrum antibiotics transformed the treatment of pneumonia, typhus, cholera, syphilis, and dozens of other infections',
    butterflyRisk: 'Low',
    details: 'Duggar discovered chlortetracycline in 1948 by screening soil microorganisms (the "Waksman platform"). It was the first antibiotic effective against a wide range of bacteria, not just specific ones like penicillin. Tetracyclines became the most prescribed antibiotics in the world by the 1960s. The Nobel Prize went to Waksman for streptomycin, but the tetracycline discovery arguably saved more lives.'
  },
  {
    id: 'coronary-bypass',
    condition: 'Coronary Artery Bypass Grafting (CABG)',
    tags: ['cabg', 'bypass', 'coronary', 'heart', 'cardiac-surgery', 'favaloro', 'saphenous-vein', 'angioplasty', 'cardiothoracic'],
    description: 'Coronary artery bypass grafting uses a blood vessel (usually the saphenous vein from the leg) to bypass blocked coronary arteries, restoring blood flow to the heart muscle. René Favaloro at the Cleveland Clinic performed the first successful CABG in 1967. It became the most commonly performed major surgery in the world.',
    optimalYear: 1963,
    targetRecipient: 'René Favaloro at the Cleveland Clinic',
    deliveryMethod: 'Send Favaloro a surgical protocol in 1963 describing: (1) the saphenous vein graft technique (harvest vein, reverse it so valves don\'t obstruct flow, anastomose to aorta distal to the blockage), (2) the use of cardiopulmonary bypass during the procedure, (3) angiographic criteria for identifying operable lesions. Favaloro was already working on coronary interventions — this gives him the complete procedure 4 years early.',
    estimatedLivesSaved: 'Millions — CABG became the standard treatment for multi-vessel coronary disease for 40+ years before stents',
    butterflyRisk: 'Low',
    details: 'Favaloro performed the first planned CABG in May 1967 at the Cleveland Clinic. He used the saphenous vein as a graft, connecting it from the aorta to the coronary artery beyond the blockage. The procedure became widespread in the 1970s. Heart disease was (and remains) the #1 killer worldwide — a procedure that reliably treats it saves millions. Favaloro returned to Argentina and later took his own life — a tragic end for someone who saved so many.'
  }
];