import { elasticSearchProvider } from '..'
import { IndexManager } from './index.manager'
import { IndexRegistry } from './index.registry'
import { productIndex } from './product.index'

const initialIndices = async () => {
  const elastic = await elasticSearchProvider()
  const indexManager = new IndexManager(elastic)

  IndexRegistry.registry(productIndex)

  indexManager.createAll()
}

export default initialIndices
