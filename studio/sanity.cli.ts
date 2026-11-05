import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'voq06lrd',
    dataset: 'production'
  },
  studioHost: 'homo-site-studio',
  deployment: {
    autoUpdates: true,
    appId: 't6pdgl2uzvab1xp0u7qjj9k1',
  },
})
