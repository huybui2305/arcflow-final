import { ethers } from 'ethers'
import { CONTRACTS, ERC20_ABI, ARC_TESTNET } from '@/lib/arc'

export interface SendResult {
  hash: string
  confirmedAt: number // ms elapsed
  blockNumber: number
  explorerUrl: string
}

export async function sendUSDC(
  signer: ethers.JsonRpcSigner,
  to: string,
  amount: string, // human-readable, e.g. "100.50"
  token: 'USDC' | 'EURC' = 'USDC'
): Promise<SendResult> {
  if (!ethers.isAddress(to)) throw new Error('Invalid recipient address')

  const amountNum = parseFloat(amount)
  if (isNaN(amountNum) || amountNum <= 0) throw new Error('Invalid amount')

  const contractAddress = token === 'USDC' ? CONTRACTS.USDC : CONTRACTS.EURC
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)

  // Use 6 decimals (ERC-20 interface, as recommended in Arc docs)
  const amountWei = ethers.parseUnits(amount, 6)

  const start = Date.now()
  const tx = await contract.transfer(to, amountWei)
  const receipt = await tx.wait(1)
  const elapsed = Date.now() - start

  return {
    hash: receipt.hash,
    confirmedAt: elapsed,
    blockNumber: receipt.blockNumber,
    explorerUrl: `${ARC_TESTNET.explorer}/tx/${receipt.hash}`,
  }
}
