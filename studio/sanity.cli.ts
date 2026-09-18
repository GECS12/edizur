import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'a5nclqso',
    dataset: 'production'
  },
  studioHost: 'edizur',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'olfmg9xyzm93o5ccx1msl0oy',
  },
})
