import dns from 'dns/promises'

const FALLBACK_DNS = ['8.8.8.8', '1.1.1.1'] as const

export async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri
  }

  dns.setServers([...FALLBACK_DNS])

  const withoutScheme = uri.slice('mongodb+srv://'.length)
  const slashIndex = withoutScheme.indexOf('/')
  const atIndex = withoutScheme.lastIndexOf('@')

  const auth = atIndex >= 0 ? withoutScheme.slice(0, atIndex + 1) : ''
  const hostEnd = slashIndex >= 0 ? slashIndex : withoutScheme.length
  const host =
    atIndex >= 0
      ? withoutScheme.slice(atIndex + 1, hostEnd)
      : withoutScheme.slice(0, hostEnd)
  const pathAndQuery = slashIndex >= 0 ? withoutScheme.slice(slashIndex) : '/'

  const [srvRecords, txtRecords] = await Promise.all([
    dns.resolveSrv(`_mongodb._tcp.${host}`),
    dns.resolveTxt(host),
  ])

  const hosts = srvRecords
    .map((record) => `${record.name}:${record.port}`)
    .join(',')
  const txtParams = txtRecords.map((record) => record.join('')).join('&')
  const querySeparator = pathAndQuery.includes('?') ? '&' : '?'
  const params = ['ssl=true', txtParams].filter(Boolean).join('&')

  return `mongodb://${auth}${hosts}${pathAndQuery}${params ? `${querySeparator}${params}` : ''}`
}
