export type FavoriteCategory = 'tech-gear' | 'restaurant' | 'book' | 'place'

export interface FavoriteItem {
  id: string
  name: string
  description: string
  longDescription?: string
  category: FavoriteCategory
  coverImage: {
    light: string
    dark: string
  }
  images?: string[]
  link?: string
}

export const categoryLabels: Record<FavoriteCategory, string> = {
  'tech-gear': 'Tech Gear',
  restaurant: 'Restaurant',
  book: 'Book',
  place: 'Place',
}

export const favorites: FavoriteItem[] = [
  {
    id: 'genelec-g2',
    name: 'Genelec G Two',
    description:
      'Compact active speaker with exceptional clarity and iconic Finnish design',
    longDescription:
      "The Genelec G Two is a compact active speaker that delivers exceptional audio clarity with the iconic Finnish design Genelec is known for. Perfect for desktop setups and small rooms, it features Genelec's Minimum Diffraction Enclosure (MDE™) technology and Directivity Control Waveguide (DCW™) for precise sound reproduction.",
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/genelec-g2-light.jpg',
      dark: '/favorites/genelec-g2-dark.jpg',
    },
    images: [
      '/favorites/genelec-g2-light.jpg',
      '/favorites/genelec-g2-dark.jpg',
    ],
    link: 'https://www.genelec.com/g-two',
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro 3',
    description:
      'Great noise cancellation and seamless Apple ecosystem integration',
    longDescription:
      'AirPods Pro 3 offer industry-leading active noise cancellation, adaptive audio features, and seamless integration with the Apple ecosystem. The H2 chip enables computational audio for immersive spatial audio experiences.',
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/airpods-pro-light.svg',
      dark: '/favorites/airpods-pro-dark.svg',
    },
    images: [
      '/favorites/airpods-pro-light.svg',
      '/favorites/airpods-pro-dark.svg',
    ],
    link: 'https://www.apple.com/airpods-pro/',
  },
  {
    id: 'ipad-mini',
    name: 'iPad mini 7',
    description: 'Perfect e-reader for night reading with warm light display',
    longDescription:
      'The iPad mini 7 is the perfect portable device for reading, note-taking, and light productivity. Its compact 8.3-inch Liquid Retina display with True Tone makes it ideal for extended reading sessions, especially at night with the warm display setting.',
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/ipad-mini-light.svg',
      dark: '/favorites/ipad-mini-dark.svg',
    },
    images: ['/favorites/ipad-mini-light.svg', '/favorites/ipad-mini-dark.svg'],
    link: 'https://www.apple.com/ipad-mini/',
  },
]
