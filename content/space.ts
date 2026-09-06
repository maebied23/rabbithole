import type { Concept, Source, Relationship } from "./schema";
export const spaceSources: Source[] = [
  {
    id: "newton",
    title: "Newton\u2019s Universal Law of Gravitation",
    publisher: "OpenStax Astronomy 2e",
    url: "https://openstax.org/books/astronomy-2e/pages/3-3-newtons-universal-law-of-gravitation",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
  {
    id: "three-body",
    title: "The compelling mathematical challenge of the three-body problem",
    publisher: "UC Santa Cruz \u00b7 Tim Stephens",
    url: "https://news.ucsc.edu/2019/08/three-body-problem/",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
  {
    id: "light-year",
    title: "What is a light-year?",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/exoplanets/what-is-a-light-year/",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
  {
    id: "relativity",
    title: "The relativity of space and time",
    publisher: "Einstein Online",
    url: "https://www.einstein-online.info/en/relativity_space_time/",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
  {
    id: "timekeeping",
    title: "How time is made",
    publisher: "Einstein Online \u00b7 Andreas Bauch",
    url: "https://www.einstein-online.info/en/spotlight/how-time-is-made/",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
  {
    id: "stars",
    title: "Stars",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/universe/stars/",
    checked: "2026-09-06",
    revision:
      "Section checked during route authoring; historical counts not reused",
    rights: "Original paraphrases only; external source link.",
  },
];
export const spaceConcepts: Concept[] = [
  {
    id: "gravity",
    label: "Gravity",
    kind: "phenomenon",
    aliases: [],
    scope: "What keeps an orbit turning?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What keeps an orbit turning?",
    overview:
      "Masses attract one another. In Newton\u2019s model, the attraction depends on both masses and their separation.",
    deeper:
      "Doubling the separation reduces the force to one quarter, if the masses stay fixed. The model works well for many ordinary orbital calculations.",
    misconception: "An orbit does not mean gravity has switched off.",
    evidence: [
      {
        sourceId: "newton",
        section: "Universal gravitation",
        support:
          "Masses attract one another. In Newton\u2019s model, the attraction depends on both masses and their separation.",
      },
    ],
    position: {
      x: 0,
      y: 0,
    },
  },
  {
    id: "orbit",
    label: "Orbit",
    kind: "phenomenon",
    aliases: [],
    scope: "Why does a planet keep missing its star?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Why does a planet keep missing its star?",
    overview:
      "An orbit is motion shaped by gravity. Sideways motion and inward acceleration together can produce a path around another body.",
    deeper:
      "A bound two-body orbit can be elliptical. Both bodies move around their shared centre of mass.",
    misconception: "The smaller body is not the only one that moves.",
    evidence: [
      {
        sourceId: "newton",
        section: "Orbits and gravitation",
        support:
          "An orbit is motion shaped by gravity. Sideways motion and inward acceleration together can produce a path around another body.",
      },
    ],
    position: {
      x: 260,
      y: 0,
    },
  },
  {
    id: "three-body-problem",
    label: "Three-body problem",
    kind: "framework",
    aliases: [],
    scope: "Why do three bodies make prediction harder?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Why do three bodies make prediction harder?",
    overview:
      "The problem asks how three mutually gravitating bodies move from given starting positions and velocities.",
    deeper:
      "Special repeating solutions exist. General motion can be chaotic, and numerical calculations can still provide useful predictions.",
    misconception:
      "There are solutions; there is no simple general formula like the familiar two-body solution.",
    evidence: [
      {
        sourceId: "three-body",
        section: "Problem definition and special solutions",
        support:
          "The problem asks how three mutually gravitating bodies move from given starting positions and velocities.",
      },
    ],
    position: {
      x: 520,
      y: 0,
    },
  },
  {
    id: "initial-conditions",
    label: "Initial conditions",
    kind: "framework",
    aliases: [],
    scope: "What must we know before predicting motion?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What must we know before predicting motion?",
    overview:
      "A prediction starts with masses, positions, and velocities. These are inputs to the equations of motion.",
    deeper:
      "In chaotic motion, small differences in starting conditions can grow into large differences in later trajectories.",
    misconception:
      "More accurate equations do not remove uncertainty in the starting measurements.",
    evidence: [
      {
        sourceId: "three-body",
        section: "Initial positions and velocities",
        support:
          "A prediction starts with masses, positions, and velocities. These are inputs to the equations of motion.",
      },
    ],
    position: {
      x: 0,
      y: 170,
    },
  },
  {
    id: "deterministic-chaos",
    label: "Deterministic chaos",
    kind: "phenomenon",
    aliases: [],
    scope: "Does unpredictable mean random?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Does unpredictable mean random?",
    overview:
      "Deterministic rules can produce motion that is highly sensitive to starting conditions. This limits long-range prediction.",
    deeper:
      "Three-body motion can exhibit this sensitivity, but special orderly trajectories also exist.",
    misconception: "Not every three-body arrangement is chaotic.",
    evidence: [
      {
        sourceId: "three-body",
        section: "Chaotic dynamics",
        support:
          "Deterministic rules can produce motion that is highly sensitive to starting conditions. This limits long-range prediction.",
      },
    ],
    position: {
      x: 260,
      y: 170,
    },
  },
  {
    id: "light-speed",
    label: "Vacuum light speed",
    kind: "framework",
    aliases: [],
    scope: "How fast can information travel?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "How fast can information travel?",
    overview:
      "Light in vacuum travels at about 300,000 kilometres per second. Its finite speed matters across astronomical distances.",
    deeper:
      "We use the symbol c for vacuum light speed. Distance divided by c gives a simple light-travel time in a static setting.",
    misconception:
      "Vacuum light speed is not the speed of light in every material.",
    evidence: [
      {
        sourceId: "light-year",
        section: "Definition and light-time",
        support:
          "Light in vacuum travels at about 300,000 kilometres per second. Its finite speed matters across astronomical distances.",
      },
    ],
    position: {
      x: 520,
      y: 170,
    },
  },
  {
    id: "light-year",
    label: "Light-year",
    kind: "framework",
    aliases: [],
    scope: "Is a light-year a time?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Is a light-year a time?",
    overview:
      "A light-year is a distance: how far light travels in vacuum in one year, about 9.46 trillion kilometres.",
    deeper:
      "A nearby star four light-years away sends us light that takes roughly four years to arrive.",
    misconception:
      "A light-year is not a duration or a spacecraft\u2019s travel time.",
    evidence: [
      {
        sourceId: "light-year",
        section: "Opening definition",
        support:
          "A light-year is a distance: how far light travels in vacuum in one year, about 9.46 trillion kilometres.",
      },
    ],
    position: {
      x: 0,
      y: 340,
    },
  },
  {
    id: "light-travel-time",
    label: "Light travel time",
    kind: "phenomenon",
    aliases: [],
    scope: "Are we seeing a star as it is now?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Are we seeing a star as it is now?",
    overview:
      "Light takes time to cross space. Observing a distant object means receiving light emitted earlier.",
    deeper:
      "The simple relation t = d/c assumes a static setting; cosmic expansion needs a more careful distance model.",
    misconception:
      "Looking at old light is not physically traveling into the past.",
    evidence: [
      {
        sourceId: "light-year",
        section: "Light-time examples",
        support:
          "Light takes time to cross space. Observing a distant object means receiving light emitted earlier.",
      },
    ],
    position: {
      x: 260,
      y: 340,
    },
  },
  {
    id: "reference-frame",
    label: "Reference frame",
    kind: "framework",
    aliases: [],
    scope: "Whose measurement are we comparing?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Whose measurement are we comparing?",
    overview:
      "A reference frame supplies a way to assign positions and times to events. Observers in relative motion can assign different durations.",
    deeper:
      "Special relativity compares inertial frames, which move uniformly relative to one another.",
    misconception:
      "A statement about a moving clock needs a specified comparison frame.",
    evidence: [
      {
        sourceId: "relativity",
        section: "Observer-dependent measurements",
        support:
          "A reference frame supplies a way to assign positions and times to events. Observers in relative motion can assign different durations.",
      },
    ],
    position: {
      x: 520,
      y: 340,
    },
  },
  {
    id: "special-relativity",
    label: "Special relativity",
    kind: "theory",
    aliases: [],
    scope: "Can observers disagree without either being wrong?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Can observers disagree without either being wrong?",
    overview:
      "Special relativity relates space and time measurements between inertial observers. Simultaneity can depend on the observer.",
    deeper:
      "Motion-related time dilation is one consequence. General relativity extends the description to gravitational spacetime geometry.",
    misconception:
      "Different measurements do not mean a clock is malfunctioning.",
    evidence: [
      {
        sourceId: "relativity",
        section: "Relativity of space and time",
        support:
          "Special relativity relates space and time measurements between inertial observers. Simultaneity can depend on the observer.",
      },
    ],
    position: {
      x: 0,
      y: 510,
    },
  },
  {
    id: "kinematic-time-dilation",
    label: "Motion-related time dilation",
    kind: "phenomenon",
    aliases: [],
    scope: "Why can a moving clock accumulate less time?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Why can a moving clock accumulate less time?",
    overview:
      "In an inertial frame, a clock moving relative to that frame ticks more slowly than clocks at rest in it.",
    deeper:
      "The traveler experiences their own clock normally. Comparing reunited clocks requires accounting for their different journeys.",
    misconception: "The traveler does not feel their own seconds slowing.",
    evidence: [
      {
        sourceId: "relativity",
        section: "Time dilation",
        support:
          "In an inertial frame, a clock moving relative to that frame ticks more slowly than clocks at rest in it.",
      },
    ],
    position: {
      x: 260,
      y: 510,
    },
  },
  {
    id: "gravitational-time-dilation",
    label: "Gravitational time dilation",
    kind: "phenomenon",
    aliases: [],
    scope: "Can height change a clock comparison?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Can height change a clock comparison?",
    overview:
      "Clocks at different gravitational potentials can accumulate different times. This matters even for precise timekeeping on Earth.",
    deeper:
      "For stationary clocks near Earth, the higher clock runs faster than the lower one. Motion must also be considered in real comparisons.",
    misconception: "This effect does not require being near a black hole.",
    evidence: [
      {
        sourceId: "timekeeping",
        section: "Relativity in clock comparisons",
        support:
          "Clocks at different gravitational potentials can accumulate different times. This matters even for precise timekeeping on Earth.",
      },
    ],
    position: {
      x: 520,
      y: 510,
    },
  },
  {
    id: "star",
    label: "Star",
    kind: "object",
    aliases: [],
    scope: "What makes a star shine?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What makes a star shine?",
    overview:
      "A star is a hot gas object. During its main-sequence life, hydrogen fusion in the core supplies energy.",
    deeper:
      "The Sun is a star. A star\u2019s mass strongly influences its lifetime and evolution.",
    misconception: "Stars are not burning by ordinary chemical combustion.",
    evidence: [
      {
        sourceId: "stars",
        section: "Birth and Life",
        support:
          "A star is a hot gas object. During its main-sequence life, hydrogen fusion in the core supplies energy.",
      },
    ],
    position: {
      x: 0,
      y: 680,
    },
  },
  {
    id: "nuclear-fusion",
    label: "Nuclear fusion",
    kind: "phenomenon",
    aliases: [],
    scope: "Where does stellar energy come from?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Where does stellar energy come from?",
    overview:
      "Hydrogen nuclei can combine to form helium in stellar cores, releasing energy.",
    deeper:
      "Fusion supplies energy during the main sequence; stellar evolution involves changes in fuel and structure.",
    misconception: "Fusion is a nuclear process, not a chemical fire.",
    evidence: [
      {
        sourceId: "stars",
        section: "Life",
        support:
          "Hydrogen nuclei can combine to form helium in stellar cores, releasing energy.",
      },
    ],
    position: {
      x: 260,
      y: 680,
    },
  },
  {
    id: "stellar-evolution",
    label: "Stellar evolution",
    kind: "phenomenon",
    aliases: [],
    scope: "Do all stars have the same ending?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "Do all stars have the same ending?",
    overview:
      "Stars change as their fuel and structure change. Their eventual remnants depend strongly on mass and evolution.",
    deeper:
      "The Sun is expected to leave a white dwarf. Massive stars can leave neutron stars or black holes.",
    misconception: "Every star does not become a black hole.",
    evidence: [
      {
        sourceId: "stars",
        section: "Death",
        support:
          "Stars change as their fuel and structure change. Their eventual remnants depend strongly on mass and evolution.",
      },
    ],
    position: {
      x: 520,
      y: 680,
    },
  },
  {
    id: "white-dwarf",
    label: "White dwarf",
    kind: "object",
    aliases: [],
    scope: "What remains after a Sun-like star?",
    version: 1,
    editorial: "reviewed",
    epistemic: "Established description",
    question: "What remains after a Sun-like star?",
    overview:
      "A white dwarf is the compact stellar core left after a star like the Sun loses its outer layers.",
    deeper:
      "It gradually cools rather than sustaining ordinary main-sequence hydrogen fusion.",
    misconception:
      "A white dwarf is distinct from a neutron star and a black hole.",
    evidence: [
      {
        sourceId: "stars",
        section: "Death: lower-mass stars",
        support:
          "A white dwarf is the compact stellar core left after a star like the Sun loses its outer layers.",
      },
    ],
    position: {
      x: 0,
      y: 850,
    },
  },
];
export const spaceRelationships: Relationship[] = [
  {
    id: "sr-predicts-motion-dilation",
    from: "special-relativity",
    to: "kinematic-time-dilation",
    type: "predicts",
    claim: "Special relativity predicts motion-related time dilation.",
    editorial: "reviewed",
    epistemic: "Established description",
    evidence: [
      {
        sourceId: "relativity",
        section: "Time dilation",
        support: "Compares moving clocks in an inertial frame.",
      },
    ],
  },
  {
    id: "gr-predicts-gravity-dilation",
    from: "general-relativity",
    to: "gravitational-time-dilation",
    type: "predicts",
    claim: "General relativity predicts gravitational time dilation.",
    editorial: "reviewed",
    epistemic: "Established description",
    evidence: [
      {
        sourceId: "timekeeping",
        section: "Relativity in clock comparisons",
        support: "Discusses gravitational clock corrections.",
      },
    ],
  },
];
