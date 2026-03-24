import { estypes } from '@elastic/elasticsearch'

export class AggregationBuilder {
  static build(): Record<string, estypes.AggregationsAggregationContainer> {
    return {
      brands: {
        terms: { field: 'brand' }
      },
      categories: {
        terms: { field: 'category' }
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [{ to: 500 }, { from: 500, to: 1000 }, { from: 1000 }]
        }
      }
    }
  }
}
