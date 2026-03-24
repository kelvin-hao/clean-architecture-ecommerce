import { configureContainer } from './injectionConfig'
import { containerInjection } from './injectionManager'

const initialInjection = () => {
  containerInjection.setContainer(configureContainer())
}

export default initialInjection
