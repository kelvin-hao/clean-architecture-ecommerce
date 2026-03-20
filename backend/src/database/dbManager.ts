import { IConnectionStrategy } from '~/types/interface'
import { ConnectionsEnum, ConnectionStrategyType } from '~/types/type'

class DatabaseManager {
  private static instance: DatabaseManager
  private connections = new Map<ConnectionsEnum, ConnectionStrategyType>()
  private strategies = new Map<ConnectionsEnum, IConnectionStrategy<ConnectionStrategyType>>()

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseManager()
    }
    return this.instance
  }

  public register(name: ConnectionsEnum, strategy: IConnectionStrategy<ConnectionStrategyType>): void {
    this.strategies.set(name, strategy)
  }

  /**
   * Gets a connection by name. If it doesn't exist, it creates one using the registered strategy.
   */
  public async getConnection<T>(name: ConnectionsEnum): Promise<T> {
    if (this.connections.has(name)) {
      return this.connections.get(name) as T
    }

    const strategy = this.strategies.get(name)
    if (!strategy) {
      throw new Error(`Connection strategy for "${name}" not registered.`)
    }

    const connection = await strategy.connect()
    this.connections.set(name, connection)
    return connection as T
  }

  /**
   * Closes all active connections gracefully.
   */
  public async closeAllConnections(): Promise<void> {
    console.log('Shutting down all connections...')
    for (const name of this.connections.keys()) {
      const strategy = this.strategies.get(name)
      if (strategy) {
        await strategy.disconnect()
      }
    }
  }
}

const databaseManager = DatabaseManager.getInstance()
export default databaseManager
