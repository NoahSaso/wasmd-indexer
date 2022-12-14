import { Transformer } from '@/core/types'
import { dbKeyForKeys, dbKeyToKeys } from '@/core/utils'

export const makeTransformer = (
  codeIdsKeys: string[],
  name: string,
  keyOrKeys?: string | string[]
): Transformer => {
  const dbKeys = [keyOrKeys || name].flat().map((key) => dbKeyForKeys(key))

  return {
    filter: {
      codeIdsKeys,
      matches: (event) => dbKeys.includes(event.key),
    },
    name,
    getValue: (event) => event.valueJson,
  }
}

interface TransformerForMapOptions<V = any> {
  numericKey?: boolean
  fallback?: any
  getValue?: Transformer<V>['getValue']
}

export const makeTransformerForMap = <V = any>(
  codeIdsKeys: string[],
  mapPrefix: string,
  keyPrefixOrPrefixes: string | string[],
  {
    numericKey = false,
    fallback = '',
    getValue,
  }: TransformerForMapOptions<V> = {}
): Transformer<V> => {
  const dbKeyPrefixes = [keyPrefixOrPrefixes]
    .flat()
    .map((key) => dbKeyForKeys(key, ''))

  return {
    filter: {
      codeIdsKeys,
      matches: (event) =>
        dbKeyPrefixes.some((prefix) => event.key.startsWith(prefix)),
    },
    name: (event) => {
      const [, key] = dbKeyToKeys(event.key, [false, numericKey])
      return `${mapPrefix}:${key}`
    },
    // Null transformed value indicates delete event, so fallback to a value.
    getValue: getValue || ((event) => event.valueJson ?? fallback),
  }
}
