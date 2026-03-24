import { estypes } from '@elastic/elasticsearch'

export class SortBuilder {
  static build(sort?: string): estypes.Sort {
    if (!sort || sort === 'relevance') return []

    switch (sort) {
      case 'price_asc':
        return [{ minPrice: { order: 'asc' } }]

      case 'price_desc':
        return [{ minPrice: { order: 'desc' } }]

      case 'newest':
        return [{ createdAt: { order: 'desc' } }]

      case 'sold':
        return [{ sold: { order: 'desc' } }]

      case 'rating':
        return [{ rating: { order: 'desc' } }]

      default:
        return []
    }
  }
}
