// File: ~/utils/log-routes.util.ts

import chalk from 'chalk'
import env from '~/config/env/dotenv.config'

// Define a type for your route config for better type safety
type RouteConfig = {
  [key: string]: {
    path: string
    child?: {
      [key: string]: {
        path: string
        method: string
      }
    }
  }
}

// Helper to get a chalk color for each HTTP method
const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return chalk.green
    case 'POST':
      return chalk.blue
    case 'PUT':
      return chalk.yellow
    case 'DELETE':
      return chalk.red
    default:
      return chalk.white
  }
}

/**
 * Iterates through a route configuration object and logs all endpoints to the console.
 * @param routeConfig The configuration object for your routes.
 */
export function logRoutesFromConfig(routeConfig: RouteConfig): void {
  const fullDomain = `${env.DOMAIN}:${env.PORT}`
  const routes: string[] = []

  console.log(chalk.bold.cyan('\n-- Registered API Endpoints --\n'))

  // Iterate over each main module (e.g., 'users')
  for (const moduleKey in routeConfig) {
    const module = routeConfig[moduleKey]

    // Iterate over each child route within the module
    for (const childKey in module.child) {
      const endpoint = module.child[childKey]
      const method = endpoint.method.toUpperCase()

      // Pad the method string so all paths align nicely
      const paddedMethod = method.padEnd(0)
      const coloredMethod = getMethodColor(method)(paddedMethod)

      // Construct the full URL
      const fullPath = `${fullDomain}${env.API_PREFIX}${module.path}${endpoint.path}`

      routes.push(`[ ${coloredMethod} ]  ${chalk.gray(fullPath)}`)
    }
  }

  // Sort the routes alphabetically and print them
  routes.sort().forEach((route) => console.log(route))

  console.log(
    chalk.bold.cyan('\n--------------------------------------------------------------------------------------\n')
  )
}

export default logRoutesFromConfig
