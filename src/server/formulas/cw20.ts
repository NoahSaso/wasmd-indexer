import { Formula } from '../types'

interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  total_supply: string
}

interface MarketingInfo {}

export const balance: Formula<string> = async ({
  contractAddress,
  get,
  args: { address },
}) =>
  // If no balance is found, return 0.
  (await get<string>(contractAddress, 'balance', address)) ?? '0'

export const tokenInfo: Formula<TokenInfo> = async ({
  contractAddress,
  get,
}) => ({
  ...(await get(contractAddress, 'token_info')),
  // Not present in normal TokenInfoResponse.
  mint: undefined,
})

export const marketingInfo: Formula<MarketingInfo> = async ({
  contractAddress,
  get,
}) => await get(contractAddress, 'marketing_info')

// Returns undefined if no logo URL found.
export const logoUrl: Formula<string | undefined> = async ({
  contractAddress,
  get,
}) => {
  const logo = await get<{ url: string | never }>(contractAddress, 'logo')
  return logo && 'url' in logo ? logo.url : undefined
}