import { estypes } from '@elastic/elasticsearch'

export class SortBuilder {
  static build(sort?: string): estypes.Sort {
    if (!sort || sort === 'relevance') return []

    switch (sort) {
      case 'price_asc':
        return [{ price: { order: 'asc' } }]

      case 'price_desc':
        return [{ price: { order: 'desc' } }]

      case 'newest':
        return [{ createdAt: { order: 'desc' } }]

      case 'sold':
        return [{ createdAt: { order: 'desc' } }]

      case 'rating':
        return [{ rating: { order: 'desc' } }]

      default:
        return []
    }
  }
}
