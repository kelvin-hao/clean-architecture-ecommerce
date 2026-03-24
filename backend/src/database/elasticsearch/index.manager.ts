import { Client } from '@elastic/elasticsearch'
import { IndexRegistry } from './index.registry'

export class IndexManager {
  private elastic: Client

  constructor(elastic: Client) {
    this.elastic = elastic
  }

  async createAll() {
    const indices = IndexRegistry.getAll()

    for (const index of indices) {
      await this.create(index.name)
    }
  }

  async create(name: string) {
    const config = IndexRegistry.getIndex(name)

    const existedIndex = await this.elastic.indices.exists({
      index: config.name
    })

    if (existedIndex) return

    await this.elastic.indices.create({
      index: config.name,
      settings: config.settings,
      mappings: config.mappings
    })

    console.log(`✅ Created index: ${config.name}`)
  }

  async delete(indexName: string) {
    await this.elastic.indices.delete({ index: indexName })
    console.log(`🗑 Deleted index: ${indexName}`)
  }

  async recreateAll() {
    const indices = IndexRegistry.getAll()

    for (const index of indices) {
      await this.delete(index.name)
      await this.create(index.name)
    }
  }
}
