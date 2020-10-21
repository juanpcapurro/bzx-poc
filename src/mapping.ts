import { log, Address } from '@graphprotocol/graph-ts'
import {
  SetTargetsCall,
  ReplaceContractCall,
  SetSupportedTokens,
  SetLoanPool,
} from '../generated/bZxProtocol/bZxProtocol'
import { BZxProtocol, ImplementationContract, Token, LoanPool } from '../generated/schema'
import { GLOBAL_PROTOCOL_ID } from './constants'

function getOrCreateGlobalProtocol(): BZxProtocol {
  let state = BZxProtocol.load(GLOBAL_PROTOCOL_ID)
  if (state == null) {
    state = new BZxProtocol(GLOBAL_PROTOCOL_ID)
  }
  return state as BZxProtocol
}

export function handleReplaceContract(call: ReplaceContractCall): void {
  getOrCreateGlobalProtocol().save()
  const target: string = call.inputs.target.toHexString()
  const implementation = new ImplementationContract(target)
  implementation.protocolId = GLOBAL_PROTOCOL_ID
  implementation.address = call.inputs.target
  implementation.signature = 'idk'
  implementation.save()
  log.error('added implementation: {}', [target])
}

export function handleSetTargets(call: SetTargetsCall): void {
  getOrCreateGlobalProtocol().save()
  const signatures: Array<string> = call.inputs.sigsArr
  const targets: Array<Address> = call.inputs.targetsArr
  for (let i = 0; i < signatures.length; i++) {
    const target: Address = targets[i]
    const signature: string = signatures[i]
    const implementation = new ImplementationContract(target.toHexString())
    implementation.protocolId = GLOBAL_PROTOCOL_ID
    implementation.address = target
    implementation.signature = signature
    implementation.save()
    log.warning('added implementation for signature {} at address {}', [signature, target.toHexString()])
  }
}

export function handleSetSupportedTokens(event: SetSupportedTokens): void {
  const token: Token = new Token(event.params.token.toHexString())
  token.enabled = event.params.isActive
  token.save()
}

export function handleSetLoanPool(event: SetLoanPool): void {
  const loanPool: LoanPool = new LoanPool(event.params.loanPool.toHexString())
  loanPool.underlying = event.params.underlying.toHexString()
  const underlying = Token.load(loanPool.underlying)
  if (underlying) {
    underlying.liquidityPool = loanPool.id
    underlying.save()
  } else {
    log.warning('The underlying token: {} for the liquidity pool: {} is not registered', [
      loanPool.underlying,
      loanPool.id,
    ])
  }
  loanPool.save()
}
