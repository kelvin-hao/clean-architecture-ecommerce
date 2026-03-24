import { BaseQueryBuilder } from '../base.builder'
import { FilterBuilder } from './filter.builder'
import { AggregationBuilder } from './aggregation.builder'
import { SortBuilder } from './sort.builder'

export type FiltersProuct = {
  brand?: string
  category?: string
  priceFrom?: number
  priceTo?: number
}

export type SortProduct = 'price_asc' | 'price_desc' | 'newest' | 'sold' | 'rating'

export interface ProductSearch {
  keyword?: string

  filters?: FiltersProuct
  sort?: SortProduct

  page?: number
  limit?: number
}

export class ProductSearchBuilder extends BaseQueryBuilder {
  constructor(private params: ProductSearch) {
    super()

    this.from = ((params.page ?? 1) - 1) * (params.limit ?? 20)
    this.size = params.limit ?? 20

    this.buildQuery()
    this.buildFilters()
    this.buildSort()
    this.buildAggregations()
  }

  private buildQuery() {
    if (!this.params.keyword) return
    if (this.query.bool!.must && Array.isArray(this.query.bool!.must)) {
      this.query.bool!.must.push({
        multi_match: {
          query: this.params.keyword,
          fields: ['name^3', 'description', 'category^2'],
          fuzziness: 'AUTO'
        }
      })
    }
  }

  private buildFilters() {
    this.query.bool!.filter = this.params.filters ? FilterBuilder.build(this.params.filters) : []
  }

  private buildSort() {
    this.sort = SortBuilder.build(this.params.sort)
  }

  private buildAggregations() {
    this.aggs = AggregationBuilder.build()
  }
}
