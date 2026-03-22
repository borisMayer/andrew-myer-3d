export interface Book {
  id:           string;
  titleEs:      string;
  titleEn:      string;
  subtitle:     string;
  series:       string;
  coverColor:   string;
  spineColor:   string;
  glowColor:    string;
  amazonUrl:    string;
  description:  string;
  descriptionEn?: string;
  comingSoon?:  boolean;
}

export const BOOKS: Book[] = [
  {
    id: 'espejo-quebrado',
    titleEs:  'El Espejo Quebrado',
    titleEn:  'The Broken Mirror',
    subtitle: 'Narcisismo metafísico y la Homosexualidad como eco de la Caída Angelical',
    series:   'Navegando por el Océano del Infinito',
    coverColor: '#1a0533', spineColor: '#0d0224', glowColor: '#9333ea',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_1',
    description: 'Una exploración del narcisismo como ley metafísica y su relación con los arquetipos espirituales más oscuros.',
    descriptionEn: 'An exploration of narcissism as a metaphysical law and its relation to the darkest spiritual archetypes.',
  },
  {
    id: 'the-reborn',
    titleEs: 'The Reborn',
    titleEn: 'The Reborn',
    subtitle: 'A Transformative Journey Beyond Life and Death',
    series:  'Navigating the Ocean of Infinity',
    coverColor: '#001a33', spineColor: '#00101f', glowColor: '#06b6d4',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_2',
    description: 'Un viaje a través de revelaciones de la experiencia cercana a la muerte.',
    descriptionEn: 'A journey through near-death revelations and extraordinary truths about reality beyond the physical world.',
  },
  {
    id: 'el-renacido',
    titleEs: 'El Renacido',
    titleEn: 'The Reborn (Spanish)',
    subtitle: 'Un Viaje desde la Muerte hacia la Libertad del Alma',
    series:  'Navegando por el Océano del Infinito',
    coverColor: '#001a1a', spineColor: '#001010', glowColor: '#0891b2',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_3',
    description: 'La edición en español del viaje transformador de Andrew Myer más allá de la vida y la muerte.',
    descriptionEn: 'The Spanish edition of Andrew Myer\'s transformative journey beyond life and death.',
  },
  {
    id: 'narcisismo-cristalizacion',
    titleEs: 'Narcisismo: La Primera Ley de la Cristalización',
    titleEn: 'Narcissism: The First Law of Crystallization',
    subtitle: 'La Primera Ley de la Cristalización',
    series:  'Navegando por el Océano del Infinito',
    coverColor: '#1a0a00', spineColor: '#0d0500', glowColor: '#c9a227',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_4',
    description: 'El narcisismo como principio cosmológico primordial por el que el universo cristaliza la realidad.',
    descriptionEn: 'Narcissism as the primordial cosmological principle by which the universe crystallizes reality.',
  },
  {
    id: 'entre-dos-mundos',
    titleEs: 'Entre Dos Mundos (Vol. 1)',
    titleEn: 'Between Two Worlds (Vol. 1)',
    subtitle: 'El puente entre lo visible y lo invisible',
    series:  'Navegando por el Océano del Infinito',
    coverColor: '#1a001a', spineColor: '#0d000d', glowColor: '#ec4899',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_5',
    description: 'La vida entre dos dimensiones: cómo habitamos simultáneamente el mundo físico y el espiritual.',
    descriptionEn: 'Life between two dimensions: how we simultaneously inhabit the physical and spiritual worlds.',
  },
  {
    id: 'entre-dos-mundos-vol2',
    titleEs: 'Entre Dos Mundos (Vol. II)',
    titleEn: 'Between Two Worlds (Vol. II)',
    subtitle: 'La continuación del viaje interdimensional',
    series:  'Navegando por el Océano del Infinito',
    coverColor: '#200020', spineColor: '#120012', glowColor: '#c026d3',
    amazonUrl:  'https://amazon.com/dp/REPLACE_ASIN_6',
    description: 'La segunda parte del viaje entre dimensiones, con nuevas revelaciones sobre el alma y la existencia.',
    descriptionEn: 'The second part of the interdimensional journey, with new revelations about the soul and existence.',
  },
];
