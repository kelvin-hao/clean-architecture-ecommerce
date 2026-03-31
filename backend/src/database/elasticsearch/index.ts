import env from '~/config/env/dotenv.config'
import { elasticSearchProvider } from '..'
import { IndexManager } from './index.manager'
import { IndexRegistry } from './index.registry'
import { productIndex } from './product.index'

const initialIndices = async () => {
  if (!env.ES_NODE) return

  const elastic = await elasticSearchProvider()
  const indexManager = new IndexManager(elastic)

  IndexRegistry.registry(productIndex)

  await indexManager.createAll()
}

export default initialIndices
