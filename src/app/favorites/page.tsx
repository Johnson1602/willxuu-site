import { FavoriteCard } from '@/components/favorite-card'
import { favorites } from '@/lib/favorites'

export default function FavoritesPage() {
  return (
    <div className='max-w-6xl mx-auto w-full'>
      <h1 className='text-2xl font-bold mb-2'>Favorites</h1>
      <p className='text-muted-foreground mb-8'>
        A collection of things I use and love.
      </p>

      <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {favorites.map((item) => (
          <FavoriteCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
