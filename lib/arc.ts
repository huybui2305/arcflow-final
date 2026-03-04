// lib/arc.ts — Arc Testnet configuration (from docs.arc.network)

export const ARC_TESTNET = {
  chainId: 5042002,
  chainIdHex: '0x4CDF72',
  name: 'Arc Testnet',
  rpc: 'https://rpc.testnet.arc.network',
  explorer: 'https://testnet.arcscan.app',
  faucet: 'https://faucet.circle.com',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
} as const

// Contract addresses (docs.arc.network/arc/references/contract-addresses)
export const CONTRACTS = {
  // USDC — native asset on Arc, used for gas
  // Native balance: 18 decimals | ERC-20 interface: 6 decimals
  USDC: '0x3600000000000000000000000000000000000000',

  // EURC — euro stablecoin, 6 decimals
  EURC: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',

  // USYC — yield-bearing token, 6 decimals (allowlist required)
  USYC: '0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C',

  // CCTP V2 (domain 26)
  TokenMessengerV2: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
  MessageTransmitterV2: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',

  // Gateway
  GatewayWallet: '0x0077777d7EBA4688BDeF3E311b846F25870A19B9',

  // Utilities
  Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
} as const

// Minimal ERC-20 ABI
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const

// Multicall3 ABI (batch read)
export const MULTICALL3_ABI = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
] as const

export const TOKENS = [
  { symbol: 'USDC', address: CONTRACTS.USDC, decimals: 6, color: '#00e5ff', icon: '💵' },
  { symbol: 'EURC', address: CONTRACTS.EURC, decimals: 6, color: '#00ff94', icon: '💶' },
] as const

export type TokenSymbol = 'USDC' | 'EURC'
