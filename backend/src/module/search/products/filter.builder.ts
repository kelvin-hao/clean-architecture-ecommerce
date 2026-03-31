import { estypes } from '@elastic/elasticsearch'
import { FiltersProuct } from './product.search'

export class FilterBuilder {
  static build(filters: FiltersProuct): estypes.QueryDslQueryContainer[] {
    const result: estypes.QueryDslQueryContainer[] = []

    if (filters?.brand) {
      result.push({
        wildcard: {
          brand: {
            value: `*${filters.brand}*`,
            case_insensitive: true
          }
        }
      })
    }

    if (filters?.category) {
      result.push({ term: { category: filters.category } })
    }

    if (filters?.priceFrom !== undefined || filters?.priceTo !== undefined) {
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
