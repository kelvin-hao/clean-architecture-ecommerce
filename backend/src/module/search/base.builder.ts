import { estypes } from '@elastic/elasticsearch'

export class BaseQueryBuilder {
  protected query: estypes.QueryDslQueryContainer = {
    bool: {
      must: [],
      filter: []
    }
  }

  protected sort: estypes.Sort = []
  protected aggs?: Record<string, estypes.AggregationsAggregationContainer>

  protected from = 0
  protected size = 20

  build(): estypes.SearchRequest {
    return {
      from: this.from,
      size: this.size,
      query: this.query,
      sort: this.sort,
      aggs: this.aggs
    }
  }
}
