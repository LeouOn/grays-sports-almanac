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
  },

  // ── 1970-2001 PUBLIC HEALTH EXPANSIONS ───────────────────
  {
    id: 'oral-rehydration',
    condition: 'Oral Rehydration Therapy (ORT) for Cholera & Diarrheal Disease',
    tags: ['ort', 'ors', 'oral-rehydration', 'cholera', 'diarrhea', 'who', 'unicef', 'nalin', 'cash', 'hirschhorn', 'mahalanabis', 'pediatrics', 'global-health'],
    description: 'A simple solution of clean water, glucose, and salts (sodium, potassium, citrate) reverses the fatal dehydration that kills ~5 million children annually from diarrheal disease. The Lancet called ORT "potentially the most important medical advance of the 20th century." It costs pennies per dose and requires no hospital.',
    optimalYear: 1970,
    targetRecipient: 'WHO Diarrhoeal Diseases Control Programme / UNICEF, and the Cholera Research Laboratory in Dacca (East Pakistan, now Bangladesh)',
    deliveryMethod: 'Deliver the exact ORS formula (the WHO ORS citrate formulation: Na+ 90 mmol/L, glucose 111 mmol/L, K+ 20 mmol/L, citrate 30 mmol/L) plus the field-trial design to the Pakistan-SEATO Cholera Research Laboratory researchers (Nalin, Cash, Hirschhorn) and to WHO Geneva in 1970. Include instructions for home preparation ("pinch-and-scoop" and the 6-point recipe).',
    estimatedLivesSaved: 'An estimated 50+ million lives saved cumulatively to date — accelerating global adoption by even 5 years saves several million children',
    butterflyRisk: 'Low',
    details: 'Nalin, Cash, and Hirschhorn proved ORT worked in cholera patients in Dacca and Calcutta (1968-1970). Mahalanabis used it at massive scale during the 1971 Bangladesh refugee crisis, demonstrating it worked under field conditions. WHO adopted ORS in 1978, but uptake was scandalously slow due to skepticism that "just water and salt" could save lives. Earlier WHO endorsement and aggressive UNICEF distribution prevents millions of childhood deaths through the 1970s and 1980s.'
  },
  {
    id: 'smallpox-eradication',
    condition: 'Smallpox Eradication — Surveillance-Containment Strategy',
    tags: ['smallpox', 'eradication', 'ring-vaccination', 'surveillance-containment', 'who', 'henderson', 'foege', 'vaccinia', 'vaccine', 'infectious-disease', 'public-health'],
    description: 'Smallpox killed ~300 million people in the 20th century before its eradication in 1980 — the only human disease ever eradicated. The breakthrough was abandoning mass-vaccination-everyone in favor of surveillance-containment (ring vaccination): find outbreaks fast, isolate them, and vaccinate every contact in a ring around each case.',
    optimalYear: 1970,
    targetRecipient: 'D.A. Henderson, WHO Smallpox Eradication Unit, Geneva',
    deliveryMethod: 'Send Henderson a strategic brief in early 1970 outlining the surveillance-containment "ring vaccination" strategy that Bill Foege pioneered in eastern Nigeria in 1967. Include the WHO/ILRI reporting structure, the jet-injector logistics, and the cold-chain protocol for the freeze-dried vaccine. Endorse Foege\'s approach as the global default rather than the mass-vaccination fallback.',
    estimatedLivesSaved: 'Accelerates eradication by ~5-8 years, preventing millions of deaths. Smallpox was declared eradicated May 8, 1980',
    butterflyRisk: 'Low',
    details: 'The WHO eradication campaign began in 1967 with a target of 100% mass vaccination — slow and wasteful. In 1967, Foege ran out of vaccine in eastern Nigeria and improvised by vaccinating only contacts of known cases. It worked. Henderson institutionalized surveillance-containment globally around 1970-1973. Giving Henderson the proven Foege playbook in 1970 means the strategy is doctrine from year one. The last natural case was Ali Maow Maalin in Somalia (October 1977).'
  },
  {
    id: 'azt-early-hiv',
    condition: 'AZT (Zidovudine) Early Development for HIV/AIDS',
    tags: ['azt', 'zidovudine', 'hiv', 'aids', 'antiretroviral', 'burroughs-wellcome', 'nih', 'broder', 'mitsuya', 'reverse-transcriptase', 'infectious-disease'],
    description: 'Azidothymidine (AZT) was the first antiretroviral drug effective against HIV. It inhibits reverse transcriptase, the enzyme HIV uses to copy itself into host DNA. Developed by Burroughs Wellcome with the NIH (Samuel Broder, Hiroaki Mitsuya), it was approved by the FDA on March 19, 1987 in record time (25 months).',
    optimalYear: 1984,
    targetRecipient: 'Samuel Broder at the National Cancer Institute (NCI) / Hiroaki Mitsuya, and Gertrude Elion at Burroughs Wellcome',
    deliveryMethod: 'Send Broder a compound-screening memo in late 1984 identifying AZT (compound S, originally synthesized by Jerome Horwitz in 1964 as a failed cancer drug) as a potent HIV reverse transcriptase inhibitor, with the in-vitro efficacy data from the NCI screen that Mitsuya would not produce until 1985. Also flag the dose-limiting bone marrow toxicity to inform trial design.',
    estimatedLivesSaved: 'Tens of thousands of lives during the early epidemic; AZT monotherapy was the only available treatment from 1987-1995',
    butterflyRisk: 'Medium',
    details: 'Horwitz synthesized AZT in 1964 as an anti-cancer agent and shelved it as a failure. Broder and Mitsuya set up the NCI\'s anti-HIV screening program in 1984 and rediscovered AZT in 1985. Burroughs Wellcome ran the Phase II trial (1985-1986) so well the placebo arm was stopped early on ethical grounds — it was that effective at reducing mortality. AZT was imperfect (resistance, side effects) but it bought millions of people 9 years until HAART arrived in 1996. Accelerating it by ~2 years saves tens of thousands of lives during the worst of the epidemic.'
  },
  {
    id: 'aspirin-mi',
    condition: 'Aspirin for Acute Myocardial Infarction (Heart Attack)',
    tags: ['aspirin', 'mi', 'myocardial-infarction', 'heart-attack', 'isis-2', 'antiplatelet', 'cardiology', 'secondary-prevention', 'oxford', 'peto'],
    description: 'A 162-300mg aspirin given during an acute myocardial infarction reduces mortality by ~23% and prevents re-infarction. It costs pennies, is available everywhere, and was definitively proven by the ISIS-2 trial (1988). Yet adoption was spotty for years despite the evidence.',
    optimalYear: 1987,
    targetRecipient: 'Richard Peto / Rory Collins, Clinical Trial Service Unit, University of Oxford',
    deliveryMethod: 'Deliver the ISIS-2 trial design and a statistical power analysis to the Oxford CTSU in early 1987 — specifically the randomization protocol (aspirin vs placebo, streptokinase vs placebo, in a 2x2 factorial design across 17,000 patients in 16 countries). Include the interim-analysis stopping boundaries and the prior evidence from meta-analyses suggesting aspirin efficacy.',
    estimatedLivesSaved: 'Hundreds of thousands per year globally once adopted — a single aspirin during a heart attack is one of the most cost-effective interventions in medicine',
    butterflyRisk: 'Low',
    details: 'ISIS-2 (Second International Study of Infarct Survival) published its results in The Lancet in August 1988. Aspirin alone reduced 5-week vascular mortality by 23%; combined with streptokinase, mortality dropped 42%. The trial was a landmark of evidence-based medicine. Despite this, surveys in 1990 found that as few as 30-60% of eligible US heart attack patients received aspirin. Giving Peto and Collins the polished design a year earlier means the trial completes and publishes sooner, and the global "give an aspirin immediately" guideline could be entrenched by 1990 instead of the late 1990s.'
  },
  {
    id: 'hib-vaccine',
    condition: 'Haemophilus influenzae type b (Hib) Vaccine',
    tags: ['hib', 'haemophilus', 'influenzae', 'vaccine', 'conjugate', 'meningitis', 'pediatrics', 'porter-anderson', 'robbins-schneerson', 'public-health'],
    description: 'Haemophilus influenzae type b was the leading cause of bacterial meningitis in children under 5 in the US (~20,000 cases/year before vaccination). Mortality ~5%, and ~30% of survivors had permanent neurologic damage (deafness, seizures, intellectual disability). Conjugate vaccine development eliminated this disease wherever it was adopted.',
    optimalYear: 1985,
    targetRecipient: 'John Robbins and Rachel Schneerson at the NIH (National Institute of Child Health) / David Smith at Connaught Labs',
    deliveryMethod: 'Send Robbins and Schneerson in 1985 a research brief describing the protein-conjugate vaccine approach (linking the Hib polysaccharide capsule to a carrier protein like diphtheria toxoid to elicit T-cell-dependent immunity in infants). Specify the four conjugate platforms (PRP-D, HbOC, PRP-OMP, PRP-T) that later became commercial products. The unconjugated polysaccharide vaccine (licensed 1985) was ineffective in infants — they were on the right track but needed the conjugate insight.',
    estimatedLivesSaved: 'Tens of thousands of children globally — Hib has been virtually eliminated in countries with routine immunization',
    butterflyRisk: 'Low',
    details: 'The first Hib vaccine (1985) was an unconjugated polysaccharide capsule. It only worked in children over 18 months — exactly the population least at risk. Robbins and Schneerson pioneered the conjugate vaccine concept (already proven for meningococcus) and the Hib conjugate vaccines reached the market between 1987 (HbOC, then PRP-D) and 1990 (PRP-OMP, PRP-T). US Hib meningitis cases collapsed from ~20,000/year to <50/year within a decade of routine infant vaccination. Accelerating the conjugate insight by 2 years prevents ~40,000 cases of meningitis in the US alone during the lag period.'
  },
  {
    id: 'folic-acid-fortification',
    condition: 'Folic Acid Fortification to Prevent Neural Tube Defects',
    tags: ['folic-acid', 'folate', 'neural-tube-defects', 'spina-bifida', 'anencephaly', 'mrc-vitamin-study', 'smithells', 'c dc', 'fortification', 'pregnancy'],
    description: 'Periconceptional folic acid supplementation reduces neural tube defects (spina bifida, anencephaly) by ~70%. The MRC Vitamin Study (1991) was the definitive proof. Food fortification (mandatory US 1998) prevents ~1,300 NTD-affected pregnancies per year in the US alone.',
    optimalYear: 1990,
    targetRecipient: 'Nicholas Wald at St Bartholomew\'s Hospital London (MRC Vitamin Study lead) / the CDC',
    deliveryMethod: 'Deliver a research brief to Wald in early 1990 describing the MRC Vitamin Study results a year before publication: randomize women with prior NTD pregnancies to folic acid (4mg) vs placebo; primary endpoint is recurrence. The 72% reduction is so dramatic that the trial will stop early. Also recommend mandatory grain fortification at 140mcg/100g flour (the US 1998 level) and periconceptional supplementation guidance.',
    estimatedLivesSaved: 'Thousands of births per year; NTDs cause infant death or lifelong severe disability',
    butterflyRisk: 'Low',
    details: 'Richard Smithells (Leeds) first suggested folic acid prevented NTDs in 1976 with observational data, but his hypothesis was dismissed. The MRC Vitamin Study (1983-1991) definitively proved it. The US mandated grain fortification in 1998 — by which point thousands of preventable NTD pregnancies had occurred since the science was clear. Getting the proof and policy in place by 1991-92 instead of 1998 prevents ~7 years of preventable spina bifida and anencephaly cases globally. The barriers were political, not scientific.'
  },
  {
    id: 'dots-tuberculosis',
    condition: 'DOTS Strategy for Tuberculosis Treatment',
    tags: ['dots', 'tuberculosis', 'tb', 'who', 'directly-observed-treatment', 'short-course', 'multi-drug-therapy', 'infectious-disease', 'public-health'],
    description: 'Tuberculosis kills ~1.5 million people per year and was resurgent in the 1990s (HIV co-epidemic, drug resistance). The WHO\'s DOTS strategy (Directly Observed Treatment, Short-course) standardized the 6-month multi-drug regimen with direct observation of pill-taking to ensure adherence, preventing relapse and drug resistance.',
    optimalYear: 1991,
    targetRecipient: 'Arata Kochi, WHO Global TB Programme, Geneva',
    deliveryMethod: 'Send the WHO TB Programme a strategic brief in 1991 outlining the DOTS framework before it was formally launched in 1994-95: (1) government commitment, (2) case detection by sputum smear microscopy, (3) standardized 6-month short-course chemotherapy (isoniazid + rifampin + pyrazinamide + ethambutol) given under direct observation for the intensive phase, (4) regular drug supply, (5) a recording and reporting system with treatment outcomes. Include the cure rates from Tanzania and Malawi pilot programs.',
    estimatedLivesSaved: 'Tens of millions cumulatively — DOTS cure rates of 85%+ became the backbone of global TB control',
    butterflyRisk: 'Low',
    details: 'The WHO declared TB a global emergency in 1993. Kochi\'s team developed DOTS based on IUATLD pilot programs in Tanzania, Mozambique, and Malawi (1980s). DOTS was formally launched in 1994-95 and the WHO declared the "DOTS expansion" goal in 1994. By providing the tested framework in 1991, the strategy is global policy 3-4 years earlier, catching the early wave of the HIV/TB co-epidemic in sub-Saharan Africa before resistance takes hold.'
  },
  {
    id: 'vitamin-a-supplementation',
    condition: 'Vitamin A Supplementation to Prevent Childhood Blindness & Mortality',
    tags: ['vitamin-a', 'supplementation', 'blindness', 'xerophthalmia', 'sommer', 'who', 'unicef', 'pediatrics', 'global-health', 'nutrition'],
    description: 'Vitamin A deficiency causes xerophthalmia (the leading cause of preventable childhood blindness) and dramatically increases all-cause child mortality. Alfred Sommer (Johns Hopkins) proved in 1983 that even mild xerophthalmia was associated with a 2-3x increased risk of death. Twice-yearly vitamin A capsules reduce childhood mortality by 23-34%.',
    optimalYear: 1983,
    targetRecipient: 'Alfred Sommer, Dana Center, Johns Hopkins School of Public Health / WHO & UNICEF nutrition programmes',
    deliveryMethod: 'Send Sommer a research brief in 1983 summarizing the Indonesian cohort findings he was about to publish: subclinical vitamin A deficiency is associated with markedly increased mortality, and the effect is reversible with cheap capsules. Include the meta-analysis (the Bellagio group, 1993) showing ~23% mortality reduction with supplementation, plus the WHO/UNICEF operational plan for universal capsule distribution.',
    estimatedLivesSaved: 'Hundreds of thousands of children per year; WHO/UNICEF programs now reach ~70% of at-risk children',
    butterflyRisk: 'Low',
    details: 'Sommer\'s 1983 Lancet paper showed children with mild xerophthalmia died at 4x the rate of controls. Follow-up trials in India (Rahmathullah 1990), Nepal (West 1991), Ghana, and Sudan confirmed mortality reductions of 19-54%. By 1993, the Bellagio meta-analysis established the consensus. Capsules cost ~$0.02 each and a child needs only 2 per year. WHO and UNICEF scaled up distribution through national immunization days in the 1990s-2000s. Accelerating the operational push by a decade prevents millions of child deaths and cases of blindness.'
  },
  {
    id: 'zinc-diarrhea',
    condition: 'Zinc Supplementation for Acute Diarrhea in Children',
    tags: ['zinc', 'supplementation', 'diarrhea', 'who', 'unicef', 'sazawal', 'black', 'icddr-b', 'pediatrics', 'global-health', 'nutrition'],
    description: 'Zinc supplementation during acute diarrhea reduces episode duration (~25%), severity, and subsequent episodes over the following months. Combined with oral rehydration salts, it reduces diarrhea mortality by ~23%. Zinc-ORS is now WHO standard of care for pediatric diarrhea.',
    optimalYear: 1985,
    targetRecipient: 'Researchers at ICDDR,B (International Centre for Diarrhoeal Disease Research, Bangladesh) — Sunil Sazawal, Robert Black',
    deliveryMethod: 'Deliver the ICDDR,B research team in 1985 a research brief outlining the zinc-deficiency–diarrhea mortality link: randomized controlled trials in Bangladesh and India showing 10-20mg/day zinc for 10-14 days during acute diarrhea reduces duration and 3-month mortality. Include the formulation challenges (taste, nausea with zinc sulfate) and the recommendation to co-package with ORS for routine WHO/UNICEF distribution.',
    estimatedLivesSaved: 'Hundreds of thousands of children — WHO estimates scaling up zinc+ORS could prevent ~400,000 child deaths annually',
    butterflyRisk: 'Low',
    details: 'The Delhi trial (Sazawal 1995) and subsequent Bangladesh trials proved zinc\'s effect on diarrhea severity and mortality. WHO and UNICEF issued the joint statement recommending zinc for all childhood diarrhea in 2004 — far too late given the evidence. The mechanism: zinc supports gut mucosal repair and immune function. Scaling the recommendation to 1990 would close a 14-year gap during which ~5+ million children died of diarrhea. The science was clearly feasible earlier.'
  },
  {
    id: 'hand-hygiene',
    condition: 'Hospital Hand Hygiene Protocols to Reduce Nosocomial Infections',
    tags: ['hand-hygiene', 'nosocomial', 'hospital-infection', 'semmelweis', 'handwashing', 'infection-control', 'c dc', 'mrsa', 'pitet', 'public-health'],
    description: 'Hospital-acquired (nosocomial) infections kill ~99,000 people per year in the US alone. The single most effective intervention is healthcare worker hand hygiene, which was understood since Semmelweis (1847) yet remained chronically under-practiced. Didier Pittet\'s alcohol-based handrub and the WHO "Five Moments" standardized modern infection control.',
    optimalYear: 1985,
    targetRecipient: 'CDC Hospital Infections Program (Atlanta) / Jim Curran, then later Didier Pittet at Geneva University Hospitals',
    deliveryMethod: 'Send the CDC Hospital Infections Program in 1985 a strategy brief: (1) national nosocomial infection surveillance system (NNIS) protocol modeled on the SENIC study (1985), (2) the alcohol-based handrub formulation that Pittet would popularize, (3) the "Five Moments for Hand Hygiene" framework, (4) infection rate auditing with public reporting. Include the projected MRSA and central-line infection reductions from hand hygiene compliance programs (>50% reductions).',
    estimatedLivesSaved: 'Tens of thousands per year in the US; vastly more globally as antibiotic resistance grows',
    butterflyRisk: 'Low',
    details: 'The CDC published its first "Guideline for Handwashing and Hospital Environmental Control" in 1985, but compliance remained poor. Pittet\'s Geneva campaign (1993-2000) showed a hospital-wide handrub program could drop MRSA rates by 50%+. The WHO "Clean Care is Safer Care" campaign (2005) globalized this. The two-decade lag between solid evidence (SENIC 1985) and global implementation (2005) is a scandal of modern medicine. Compressing that gap prevents millions of hospital-acquired infections.'
  },
  {
    id: 'blood-screening-hiv',
    condition: 'HIV Screening of the Blood Supply',
    tags: ['hiv', 'blood-transfusion', 'blood-supply', 'screening', 'elisa', 'c dc', 'fda', 'morbidity-mortality', 'pandemic', 'public-health', 'hemophilia'],
    description: 'Before HIV screening of donated blood, the US blood supply was contaminated. ~12,000 Americans (mostly hemophiliacs and transfusion recipients) became infected with HIV through blood products between 1978 and 1985. The HIV antibody ELISA test (licensed March 1985) ended this. Heat treatment of clotting factors (1984) protected hemophiliacs sooner.',
    optimalYear: 1983,
    targetRecipient: 'CDC (James Curran) / FDA Blood Products Advisory Committee / Margaret Heckler (HHS Secretary)',
    deliveryMethod: 'Send a sealed dossier to the CDC and FDA in early 1983: (1) the projected magnitude of blood-borne HIV transmission (thousands of hemophiliacs infected), (2) the heat-treatment protocol for Factor VIII concentrate (licensed by 1984 by Cutter/Baxter), (3) the ELISA antibody test design (viral lysate-based, as in the 1985 Abbott test), (4) the recommendation to screen donors via questionnaire immediately. Recommend donor deferral for high-risk groups and rapid deployment of heat-treated clotting factors.',
    estimatedLivesSaved: 'Thousands of lives — most of the ~10,000 hemophilia patients in the US became HIV-positive before 1985; acceleration could have prevented the majority',
    butterflyRisk: 'Medium',
    details: 'The CDC\'s MMWR first hinted at transfusion-associated AIDS in December 1982. Yet the FDA did not require heat treatment of clotting factors until 1984, and the ELISA test was not licensed until March 1985. By then ~half of US hemophiliacs were HIV-positive. Heat treatment was technically feasible by 1983 — Cutter Laboratories introduced it in Europe months before the US. The delay was bureaucratic. Earlier intervention prevents most transfusion-associated HIV infections in the US, France (the notorious 1983-85 French blood scandal), and elsewhere. The Etienne Latourite French contamination trial documents the criminal stakes.'
  },
  {
    id: 'statins-lovastatin',
    condition: 'Statins (HMG-CoA Reductase Inhibitors) for Cardiovascular Disease',
    tags: ['statins', 'lovastatin', 'mevacor', 'hmgcoa', 'cardiovascular', 'cholesterol', 'merck', 'endo', 'akira', 'pscot-ww', 'cardiology'],
    description: 'Statins lower LDL cholesterol by inhibiting HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis. Lovastatin (Mevacor), the first commercial statin, was approved by the FDA in September 1987. Statins reduce major cardiovascular events by ~25-35% and have become the most prescribed drug class in history.',
    optimalYear: 1976,
    targetRecipient: 'Akira Endo at Sankyo Company (Tokyo) / P. Roy Vagelos at Merck Research Labs',
    deliveryMethod: 'Send Endo and Vagelos a research brief in 1976 pointing to the specific active statin compounds: (1) Endo\'s compactin (ML-236B) and mevastatin from Penicillium citrinum, (2) the more potent lovastatin (monacolin K) from Aspergillus terreus, which Merck\'s team isolated in 1978, (3) the rationale that liver-selective HMG-CoA inhibition reduces LDL without systemic toxicity. This gives both labs the winning molecules years before they would isolate them.',
    estimatedLivesSaved: 'Tens of millions — statins are now prescribed to hundreds of millions worldwide and prevent heart attacks and strokes on a massive scale',
    butterflyRisk: 'Low',
    details: 'Akira Endo isolated compactin/mevastatin at Sankyo in 1973-1976 — the first statin. Sankyo dropped it after tumors appeared in dogs at extreme doses. Merck (Alfred Alberts, Vagelos) independently isolated lovastatin from Aspergillus terreus in 1978. Merck had paused statin work after hearing (incorrectly) about Sankyo\'s tumor findings; in 1980 they resumed and got FDA approval September 1, 1987. Statins prevent ~80 heart attacks per 1,000 patients over 5 years in high-risk populations. Accelerating the drug class by ~5 years prevents millions of cardiovascular events globally during the lag.'
  },
  {
    id: 'ace-inhibitors',
    condition: 'ACE Inhibitors (Captopril) for Hypertension & Heart Failure',
    tags: ['ace-inhibitor', 'captopril', 'enalapril', 'hypertension', 'heart-failure', 'squibb', 'cushman', 'ondetti', 'capoten', 'cardiology'],
    description: 'ACE inhibitors block angiotensin-converting enzyme, lowering blood pressure and reducing afterload on the failing heart. Captopril (Capoten), the first oral ACE inhibitor, was approved by the FDA in April 1981. The class became first-line therapy for hypertension, heart failure, and diabetic nephropathy.',
    optimalYear: 1974,
    targetRecipient: 'David Cushman and Miguel Ondetti at Squibb (Bristol-Myers Squibb) in Princeton, NJ',
    deliveryMethod: 'Deliver Cushman and Ondetti in 1974 the structure-activity relationship that led to captopril: the C-terminal binding zinc of ACE, the succinyl-L-proline scaffold, and the key insight that a thiol (-SH) group at the right position increases potency 1,000-fold (the D-3-mercapto-2-methylpropanoyl-L-proline = captopril). This saves Squibb ~3 years of rational drug design work.',
    estimatedLivesSaved: 'Millions — ACE inhibitors are foundational to cardiovascular and renal disease management',
    butterflyRisk: 'Low',
    details: 'Cushman and Ondetti\'s rational drug design of captopril is a landmark of structure-based pharmacology. Building on the Brazilian arrowhead viper peptide (teprotide), they synthesized small-molecule ACE inhibitors. Captopril was approved April 6, 1981 and was a blockbuster. Enalapril (Merck, 1985) and lisinopril (1987) followed. ACE inhibitors dramatically reduce mortality in heart failure (SOLVD, CONSENSUS trials) and slow diabetic kidney disease. Providing the captopril structure in 1974 brings the drug to market ~4 years earlier — early enough to be entrenched before the hypertension-treatment consensus of the late 1980s.'
  },
  {
    id: 'magnesium-eclampsia',
    condition: 'Magnesium Sulfate for Eclampsia & Pre-Eclampsia',
    tags: ['magnesium', 'eclampsia', 'preeclampsia', 'obstetrics', 'maggie-trial', 'collaborative-eclampsia', 'pregnancy', 'seizure', 'maternal-health'],
    description: 'Magnesium sulfate halves the risk of eclamptic seizures in women with pre-eclampsia and is more effective than diazepam or phenytoin for treating eclampsia itself. Eclampsia is a leading cause of maternal death worldwide. Yet magnesium sulfate was controversially underused for decades, especially outside the US.',
    optimalYear: 1990,
    targetRecipient: 'The Collaborative Eclampsia Trial group (Lelia Duley, Oxford) / WHO Maternal & Perinatal Health',
    deliveryMethod: 'Deliver Duley and the Oxford trialists in 1990 the protocol for the Collaborative Eclampsia Trial (1995) — the international multicenter randomized comparison of magnesium sulfate vs diazepam vs phenytoin for eclamptic seizures. Include the projected 59% seizure-reduction advantage of magnesium. Also recommend the MAGPIE trial design (magnesium for pre-eclampsia prevention) and WHO guidance to make magnesium sulfate the global standard.',
    estimatedLivesSaved: 'Tens of thousands of women — eclampsia kills ~50,000 women per year globally, mostly in low-resource settings',
    butterflyRisk: 'Low',
    details: 'Magnesium sulfate for eclampsia was first described in 1906 by Horn in Germany and popularized in the US by Pritchard at Parkland Hospital (1955). But for 80 years, international obstetrics was split between magnesium (US), diazepam (UK/Europe), and phenytoin. The Collaborative Eclampsia Trial (1995, Lancet) ended the debate decisively. The MAGPIE trial (2002) confirmed it for pre-eclampsia. WHO recommended magnesium as first-line in 2011 — absurdly late. Compressing the evidence-to-policy gap by 5-10 years prevents tens of thousands of maternal deaths globally.'
  },
  {
    id: 'antisteroids-preterm',
    condition: 'Antenatal Corticosteroids for Preterm Birth (Fetal Lung Maturation)',
    tags: ['corticosteroids', 'betamethasone', 'dexamethasone', 'preterm', 'respiratory-distress-syndrome', 'liggins', 'howie', 'nicu', 'neonatology', 'obstetrics'],
    description: 'Antenatal corticosteroids (betamethasone or dexamethasone) given to a woman at risk of preterm delivery accelerate fetal lung maturation, reducing neonatal respiratory distress syndrome by ~50% and neonatal mortality by ~30%. The effect was discovered by Graham Liggins in 1969 and proven by the landmark Liggins & Howie RCT in 1972.',
    optimalYear: 1990,
    targetRecipient: 'Patrick Crowley (Cork, Ireland) — the systematic reviewer who drove the NIH 1994 consensus / WHO',
    deliveryMethod: 'Deliver Crowley in 1990 the draft of his 1990 systematic review (the first meta-analysis of antenatal steroids trials): 7 RCTs showing a 40-50% reduction in RDS, neonatal death, and intraventricular hemorrhage with a single course of betamethasone or dexamethasone. Recommend NIH/WHO consensus conferences to mandate the practice globally and a clear protocol (two 12mg betamethasone doses, 24h apart, between 24-34 weeks gestation).',
    estimatedLivesSaved: 'Hundreds of thousands of preterm infants; the WHO lists it as one of the most cost-effective neonatal interventions',
    butterflyRisk: 'Low',
    details: 'Liggins discovered the effect accidentally in 1969 while studying preterm sheep; the Liggins-Howie RCT (Auckland, 1972) was the first human proof. Yet uptake was abysmally slow — by 1990 only ~15-20% of eligible women in the US received antenatal steroids. Crowley\'s meta-analyses (1990, 2006) and the NIH Consensus Conference (1994) finally drove adoption. WHO made it a priority in 2000+. The gap between clear evidence (1972) and routine practice (2000s) is one of the most damaging delays in perinatal medicine. Compressing it saves hundreds of thousands of preterm babies.'
  },
  {
    id: 'sterile-water-injection',
    condition: 'Sterile Technique & Surgical Safety Checklist',
    tags: ['sterile-technique', 'surgical-checklist', 'who', 'atul-gawande', 'surgical-safety', 'infection-control', 'perioperative', 'safe-surgery-saves-lives'],
    description: 'Standardized sterile technique, instrument counts, time-outs, and the WHO Surgical Safety Checklist cut surgical morbidity and mortality by 30-40%. The 19-step checklist was proven by Haynes et al. (NEJM 2009) but the principles are timeless and could have been standardized decades earlier.',
    optimalYear: 1980,
    targetRecipient: 'American College of Surgeons / American Society of Anesthesiologists / WHO Patient Safety',
    deliveryMethod: 'Send the American College of Surgeons in 1980 a draft "Surgical Safety Checklist" protocol: (1) pre-op sign-in with patient identity and procedure, (2) instrument and sponge counts, (3) antibiotic prophylaxis timing (within 60 min before incision), (4) pulse oximetry monitoring, (5) post-op debrief. Include evidence from the international studies showing ~40% reduction in complications and deaths.',
    estimatedLivesSaved: 'Millions — surgery is performed ~300 million times per year; even a 5% mortality reduction is enormous cumulatively',
    butterflyRisk: 'Low',
    details: 'Surgical checklists are an old aviation idea applied late to medicine. The Harvard Medical Practice Study (1991) found surgical "adverse events" were common and often preventable. The WHO "Safe Surgery Saves Lives" program (2008) and Haynes\' 2009 NEJM paper (complication rate down from 11% to 7%, death rate down from 1.5% to 0.8%) standardized the checklist globally. The principles were feasible in 1980. Earlier adoption across the boom in elective surgery during the 1980s-90s prevents an enormous burden of preventable surgical harm.'
  }
];