import { version } from '@/../package.json'

export const appName = 'Aonsoku'

// the upstream project this player is based on
const repository = { url: 'https://github.com/victoralvesf/aonsoku' }

export function getAppInfo() {
  return {
    name: appName,
    version,
  }
}

export const lrclibClient = `${appName} v${version} (${repository.url})`
