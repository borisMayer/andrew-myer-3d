export interface Book {
  id:           string;
  titleEs:      string;
  titleEn:      string;
  subtitle:     string;
  series:       string;
  isbn?:        string;
  edition?:     string;
  year?:        number;
  coverColor:   string;
  spineColor:   string;
  glowColor:    string;
  amazonUrl:    string;
  description:  string;
  descriptionEn?: string;
  categoryEs:   string;
  categoryEn:   string;
  comingSoon?:  boolean;
}

export const BOOKS: Book[] = [
  {
    id: 'entre-dos-mundos-vol1',
    titleEs:  'Entre Dos Mundos, Vol. I',
    titleEn:  'Between Two Worlds, Vol. I',
    subtitle: 'El Poder del Kadish y el Rugido del León',
    series:   'Navegando por el Océano del Infinito',
    edition:  '2.ª edición',
    year:     2023,
    coverColor: '#0f1520', spineColor: '#080e17', glowColor: '#4a6fa5',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Testimonio · Teología',
    categoryEn: 'Testimony · Theology',
    description: 'Crónica de una odisea espiritual que comenzó en una Unidad de Cuidados Intensivos durante la pandemia de COVID-19. El autor relata su travesía a través de las dimensiones de las tinieblas y la gloria celestial mientras su cuerpo permanecía en coma, presentando un testimonio de la soberanía de Adonay sobre la vida y la muerte.',
    descriptionEn: 'Chronicle of a spiritual odyssey that began in an Intensive Care Unit during the COVID-19 pandemic. The author recounts his journey through the dimensions of darkness and celestial glory while his body remained in a coma, presenting a testimony of Adonay\'s sovereignty over life and death.',
  },
  {
    id: 'el-renacido',
    titleEs: 'El Renacido',
    titleEn: 'The Reborn',
    subtitle: 'Un Viaje desde la Muerte hacia la Libertad del Alma',
    series:  'Navegando por el Océano del Infinito',
    year:    2023,
    coverColor: '#12100a', spineColor: '#0a0805', glowColor: '#8a7040',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Testimonio · Psicología Espiritual',
    categoryEn: 'Testimony · Spiritual Psychology',
    description: 'Documentación de la experiencia de resurrección personal del autor tras su crisis de salud. Analiza los mecanismos que aprisionan al ser humano y el proceso de recuperación de la libertad del alma tras la experiencia del umbral de la muerte.',
    descriptionEn: 'Documentation of the author\'s personal experience of resurrection following his health crisis. Analyses the mechanisms that imprison the human being and the process of recovering the freedom of the soul after the near-death experience.',
  },
  {
    id: 'narcisismo-cristalizacion',
    titleEs: 'Narcisismo: La Primera Ley de la Cristalización',
    titleEn: 'Narcissism: The First Law of Crystallization',
    subtitle: 'Una aproximación teológico-psicoanalítica',
    series:  'Navegando por el Océano del Infinito',
    isbn:    '9798311562621',
    year:    2024,
    coverColor: '#100a05', spineColor: '#080603', glowColor: '#9e7828',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Psicología · Teología · Filosofía',
    categoryEn: 'Psychology · Theology · Philosophy',
    description: 'Exploración del narcisismo no solo como trastorno psicológico, sino como fuerza metafísica primordial presente desde los albores de la creación. La obra analiza la autoidolatría como fundamento del pecado original, integrando análisis de textos sagrados, interpretaciones místicas y psicología moderna.',
    descriptionEn: 'Exploration of narcissism not merely as a psychological disorder but as a primordial metaphysical force present since the dawn of creation. The work analyses self-idolatry as the foundation of original sin, integrating analysis of sacred texts, mystical interpretations and modern psychology.',
  },
  {
    id: 'espejo-quebrado',
    titleEs: 'El Espejo Quebrado',
    titleEn: 'The Broken Mirror',
    subtitle: 'Narcisismo metafísico y la Homosexualidad como eco de la Caída Angelical',
    series:  'Navegando por el Océano del Infinito',
    year:    2024,
    coverColor: '#0a0515', spineColor: '#06030e', glowColor: '#6040a0',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Teología · Psicoanálisis · Ética',
    categoryEn: 'Theology · Psychoanalysis · Ethics',
    description: 'Expansión de la investigación sobre el narcisismo metafísico. Propone que ciertos patrones de deseo, cuando surgen de un fundamento narcisista, son manifestaciones contemporáneas de una inversión primordial. Utiliza análisis detallado de textos hebreos y teorías psicoanalíticas para conectar la metafísica con la psicología profunda.',
    descriptionEn: 'An expansion of the research on metaphysical narcissism. Proposes that certain patterns of desire, when arising from a narcissistic foundation, are contemporary manifestations of a primordial inversion. Uses detailed analysis of Hebrew texts and psychoanalytic theory to connect metaphysics with depth psychology.',
  },
  {
    id: 'jesucristo-leon-juda',
    titleEs: 'Jesucristo, El León de Judá',
    titleEn: 'Jesus Christ, The Lion of Judah',
    subtitle: 'El Tzimtzum Divino y la Revelación Trinitaria',
    series:  'Teología Sistemática',
    year:    2024,
    coverColor: '#08100a', spineColor: '#050a06', glowColor: '#4a7a50',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Teología Sistemática · Cristología · Cábala',
    categoryEn: 'Systematic Theology · Christology · Kabbalah',
    description: 'Desarrollo teológico y académico sobre la cristianización del Tzimtzum cabalístico. Propone que esta "contracción divina" es el movimiento por el cual el Dios infinito genera el espacio ontológico para la creación finita. Integra conceptos de física cuántica y cosmología como analogías para explicar el misterio de la Trinidad y la Encarnación.',
    descriptionEn: 'Theological and academic development on the Christianisation of the Kabbalistic Tzimtzum. Proposes that this "divine contraction" is the movement by which the infinite God generates the ontological space for finite creation. Integrates concepts from quantum physics and cosmology as analogies to explain the mystery of the Trinity and the Incarnation.',
  },
];
