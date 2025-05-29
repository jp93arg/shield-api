// src/validators/addressValidators.ts

export interface AddressValidator {
    isValid(address: string): boolean;
  }
  
  class BitcoinAddressValidator implements AddressValidator {
    isValid(address: string): boolean {
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address); // very basic check
    }
  }
  
  class EthereumAddressValidator implements AddressValidator {
    isValid(address: string): boolean {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  }
  
  class TronAddressValidator implements AddressValidator {
    isValid(address: string): boolean {
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address); // basic Tron address format
    }
  }
  
  export const addressValidatorMap: Record<string, AddressValidator> = {
    bitcoin: new BitcoinAddressValidator(),
    ethereum: new EthereumAddressValidator(),
    tron: new TronAddressValidator(),
  };
  