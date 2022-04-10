const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const { config } = require('process')

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  
  // Needed if run in a container
  defaultConfig.experimental = experimentalConfig => {
    experimentalConfig.outputStandalone = true
    return experimentalConfig
  }

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Needed for Hot Reload in Docker while developing
    defaultConfig.webpackDevMiddleware = devMiddlewareConfig => {
      devMiddlewareConfig.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      }
      return devMiddlewareConfig
    }
  }

  return defaultConfig
}