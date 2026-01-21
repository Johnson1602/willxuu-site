export type FavoriteCategory =
  | 'tech-gear'
  | 'restaurant'
  | 'book'
  | 'place'

export interface FavoriteItem {
  id: string
  name: string
  description: string
  category: FavoriteCategory
  coverImage: {
    light: string
    dark: string
  }
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
    description: 'Compact active speaker with exceptional clarity and iconic Finnish design',
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/genelec-g2-light.jpg',
      dark: '/favorites/genelec-g2-dark.jpg',
    },
    link: 'https://www.genelec.com/g-two',
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro 3',
    description: 'Great noise cancellation and seamless Apple ecosystem integration',
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/airpods-pro-light.svg',
      dark: '/favorites/airpods-pro-dark.svg',
    },
  },
  {
    id: 'ipad-mini',
    name: 'iPad mini 7',
    description: 'Perfect e-reader for night reading with warm light display',
    category: 'tech-gear',
    coverImage: {
      light: '/favorites/ipad-mini-light.svg',
      dark: '/favorites/ipad-mini-dark.svg',
    },
  },
]
