import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kygybgb7',
    dataset: 'production'
  },
  deployment: {
    appId: 'o44cp3v9ngi4u0xvxwtvhsjc',
    autoUpdates: true,
  }
})
