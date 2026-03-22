export interface Book {
  id:          string;
  titleEs:     string;
  titleEn:     string;
  subtitle:    string;
  series:      string;
  coverColor:  string;   // dominant color for 3D placeholder
  spineColor:  string;
  glowColor:   string;
  amazonUrl:   string;   // Replace with real Amazon URLs
  description: string;
  // Replace these with real GLTF model paths when available:
  // modelPath: string;
}

export const BOOKS: Book[] = [
  {
    id:         'espejo-quebrado',
    titleEs:    'El Espejo Quebrado',
    titleEn:    'The Broken Mirror',
    subtitle:   'Narcisismo metafísico y la Homosexualidad como eco de la Caída Angelical',
    series:     'Navegando por el Océano del Infinito',
    coverColor: '#1a0533',
    spineColor: '#0d0224',
    glowColor:  '#9333ea',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_1',
    description:
      'Una exploración profunda del narcisismo como ley metafísica y su relación con los arquetipos espirituales más oscuros de la humanidad.',
  },
  {
    id:         'the-reborn',
    titleEs:    'The Reborn',
    titleEn:    'The Reborn',
    subtitle:   'A Transformative Journey Beyond Life and Death',
    series:     'Navigating the Ocean of Infinity',
    coverColor: '#001a33',
    spineColor: '#00101f',
    glowColor:  '#06b6d4',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_2',
    description:
      'A journey through near-death revelations and the extraordinary truths about reality beyond the physical world.',
  },
  {
    id:         'narcisismo-cristalizacion',
    titleEs:    'Narcisismo: La Primera Ley de la Cristalización',
    titleEn:    'Narcissism: The First Law of Crystallization',
    subtitle:   'La Primera Ley de la Cristalización',
    series:     'Navegando por el Océano del Infinito',
    coverColor: '#1a0a00',
    spineColor: '#0d0500',
    glowColor:  '#c9a227',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_3',
    description:
      'El narcisismo como principio cosmológico primordial: cómo la autoabsorción del universo cristaliza la realidad material.',
  },
  {
    id:         'el-renacido-vol2',
    titleEs:    'El Renacido (Vol. II)',
    titleEn:    'The Reborn (Vol. II)',
    subtitle:   'Continuación del viaje transformador más allá de la vida y la muerte',
    series:     'Navegando por el Océano del Infinito',
    coverColor: '#0a1a00',
    spineColor: '#051000',
    glowColor:  '#22c55e',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_4',
    description:
      'La segunda parte del viaje transformador: nuevas revelaciones del más allá y su impacto en la realidad presente.',
  },
  {
    id:         'entre-dos-mundos',
    titleEs:    'Entre Dos Mundos (Vol. 1)',
    titleEn:    'Between Two Worlds (Vol. 1)',
    subtitle:   'El puente entre lo visible y lo invisible',
    series:     'Navegando por el Océano del Infinito',
    coverColor: '#1a001a',
    spineColor: '#0d000d',
    glowColor:  '#ec4899',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_5',
    description:
      'La vida entre dos dimensiones: cómo los seres humanos habitamos simultáneamente el mundo físico y el espiritual.',
  },
  {
    id:         'oceano-del-infinito',
    titleEs:    'Navegando por el Océano del Infinito',
    titleEn:    'Navigating the Ocean of Infinity',
    subtitle:   'El libro fundacional de la serie',
    series:     'Navegando por el Océano del Infinito',
    coverColor: '#00101a',
    spineColor: '#000810',
    glowColor:  '#38bdf8',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_6',
    description:
      'El viaje de Andrew Myer al corazón de la conciencia infinita y las verdades que encontró al otro lado del velo.',
  },
];
