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
  coverImage?:  string;   // real cover photo path
  amazonUrl:    string;
  description:  string;
  descriptionEn?: string;
  categoryEs:   string;
  categoryEn:   string;
  hasLiveBook?: boolean;  // shows "Libro Vivo" button
  comingSoon?:  boolean;
}

export const BOOKS: Book[] = [
  {
    id: 'entre-dos-mundos-vol1',
    titleEs:  'Entre Dos Mundos, Vol. I',
    titleEn:  'Between Two Worlds, Vol. I',
    subtitle: 'El Poder del Kadish y el Rugido del León',
    series:   'Navegando por el Océano del Infinito',
    edition:  '2.ª edición', year: 2023,
    coverColor: '#0d1422', spineColor: '#080e18', glowColor: '#3a5a8a',
    coverImage: '/covers/entre-dos-mundos.jpg',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Testimonio · Teología',
    categoryEn: 'Testimony · Theology',
    hasLiveBook: true,
    description: 'Crónica de una odisea espiritual que comenzó en una Unidad de Cuidados Intensivos durante la pandemia de COVID-19. El autor relata su travesía a través de las dimensiones de las tinieblas y la gloria celestial mientras su cuerpo permanecía en coma.',
    descriptionEn: 'Chronicle of a spiritual odyssey that began in an Intensive Care Unit during the COVID-19 pandemic. The author recounts his journey through the dimensions of darkness and celestial glory while his body remained in a coma.',
  },
  {
    id: 'el-renacido',
    titleEs: 'El Renacido',
    titleEn: 'The Reborn',
    subtitle: 'Un Viaje desde la Muerte hacia la Libertad del Alma',
    series:  'Navegando por el Océano del Infinito',
    year:    2023,
    coverColor: '#0a1010', spineColor: '#060a0a', glowColor: '#4a8070',
    coverImage: '/covers/renacido.png',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Testimonio · Psicología Espiritual',
    categoryEn: 'Testimony · Spiritual Psychology',
    description: 'Documentación de la experiencia de resurrección personal del autor tras su crisis de salud. Analiza los mecanismos que aprisionan al ser humano y el proceso de recuperación de la libertad del alma.',
    descriptionEn: 'Documentation of the author\'s personal resurrection experience following his health crisis. Analyses the mechanisms that imprison human beings and the process of recovering freedom of the soul.',
  },
  {
    id: 'narcisismo-cristalizacion',
    titleEs: 'Narcisismo: La Primera Ley de la Cristalización',
    titleEn: 'Narcissism: The First Law of Crystallization',
    subtitle: 'Una aproximación teológico-psicoanalítica',
    series:  'Navegando por el Océano del Infinito',
    isbn:    '9798311562621', year: 2024,
    coverColor: '#050d18', spineColor: '#030810', glowColor: '#3a7a90',
    coverImage: '/covers/narcisismo.jpg',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Psicología · Teología · Filosofía',
    categoryEn: 'Psychology · Theology · Philosophy',
    description: 'Exploración del narcisismo no solo como trastorno psicológico, sino como fuerza metafísica primordial presente desde los albores de la creación. Integra análisis de textos sagrados, interpretaciones místicas y psicología moderna.',
    descriptionEn: 'Exploration of narcissism not merely as a psychological disorder but as a primordial metaphysical force. Integrates analysis of sacred texts, mystical interpretations and modern psychology.',
  },
  {
    id: 'espejo-quebrado',
    titleEs: 'El Espejo Quebrado',
    titleEn: 'The Broken Mirror',
    subtitle: 'Narcisismo metafísico y la Homosexualidad como eco de la Caída Angelical',
    series:  'Navegando por el Océano del Infinito',
    year:    2024,
    coverColor: '#0a0510', spineColor: '#06030a', glowColor: '#7050a0',
    coverImage: '/covers/espejo-quebrado.jpg',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Teología · Psicoanálisis · Ética',
    categoryEn: 'Theology · Psychoanalysis · Ethics',
    description: 'Expansión de la investigación sobre el narcisismo metafísico. Propone que ciertos patrones de deseo son manifestaciones contemporáneas de una inversión primordial. Utiliza análisis de textos hebreos y teorías psicoanalíticas.',
    descriptionEn: 'An expansion of the research on metaphysical narcissism, proposing that certain patterns of desire are contemporary manifestations of a primordial inversion.',
  },
  {
    id: 'jesucristo-leon-juda',
    titleEs: 'Jesucristo, El León de Judá',
    titleEn: 'Jesus Christ, The Lion of Judah',
    subtitle: 'El Tzimtzum Divino y la Revelación Trinitaria',
    series:  'Teología Sistemática',
    year:    2024,
    coverColor: '#080e05', spineColor: '#050903', glowColor: '#5a8040',
    coverImage: '/covers/jesucristo.png',
    amazonUrl: 'https://www.amazon.com/author/andrewmyer',
    categoryEs: 'Teología Sistemática · Cristología · Cábala',
    categoryEn: 'Systematic Theology · Christology · Kabbalah',
    description: 'Desarrollo teológico y académico sobre la cristianización del Tzimtzum cabalístico. Propone que la "contracción divina" es el movimiento por el cual Dios infinito genera el espacio ontológico para la creación finita.',
    descriptionEn: 'Theological and academic development on the Christianisation of the Kabbalistic Tzimtzum, proposing it as the movement by which the infinite God generates the ontological space for finite creation.',
  },
];
