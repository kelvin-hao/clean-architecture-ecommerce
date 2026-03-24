import { BadRequestError } from '~/helper/response/errorResponse'
import { IndexConfig } from '~/types/interface'

export class IndexRegistry {
  private static indicies: Map<string, IndexConfig> = new Map()

  static registry(index: IndexConfig) {
    if (this.indicies.has(index.name)) throw new BadRequestError(`Index already registered: ${index.name}`)
    this.indicies.set(index.name, index)
  }

  static getIndex(name: string): IndexConfig {
    const index = this.indicies.get(name)

    if (!index) throw new BadRequestError(`Index not found ${name}`)

    return index
  }

  static getAll(): IndexConfig[] {
    return Array.from(this.indicies.values())
  }

  static has(name: string): boolean {
    return this.indicies.has(name)
  }
}
