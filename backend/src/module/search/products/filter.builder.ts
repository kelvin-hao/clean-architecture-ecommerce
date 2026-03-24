import { estypes } from '@elastic/elasticsearch'
import { FiltersProuct } from './product.search'

export class FilterBuilder {
  static build(filters: FiltersProuct): estypes.QueryDslQueryContainer[] {
    const result: estypes.QueryDslQueryContainer[] = []

    if (filters?.brand) {
      result.push({ term: { brand: filters.brand } })
    }

    if (filters?.category) {
      result.push({ term: { category: filters.category } })
    }

    if (filters?.priceFrom || filters?.priceTo) {
      result.push({
        range: {
          price: {
            gte: filters.priceFrom ?? 0,
            lte: filters.priceTo ?? 999999
          }
        }
      })
    }

    return result
  }
}
