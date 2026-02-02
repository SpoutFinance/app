export const contractaddresses = {
  gateway: {
    84532: "0xa78b1cbeCaCC297Ded2965481F8510120b0680C9", // Base Sepolia
    688688: "0x126F0c11F3e5EafE37AB143D4AA688429ef7DCB3", // Pharos Testnet
  },
  idfactory: {
    84532: "0x1Ff598E271Ae3fcF27175081BB9011c322B20C86", // Base Sepolia
    688688: "0x18cB5F2774a80121d1067007933285B32516226a", // Pharos Testnet
  },
  issuer: {
    84532: "0xec0B601c4C0c49aa67ca40948C0A841292Bda3D5", // Base Sepolia - ClaimIssuer
    688688: "0xA5C77b623BEB3bC0071fA568de99e15Ccc06C7cb", // Pharos Testnet
  },
  orders: {
    84532: "0x91cf66129191DF4EF9f55f89C50C02557a4CA50C", // Base Sepolia - OrdersChainlink
    688688: "0x81b33972f8bdf14fD7968aC99CAc59BcaB7f4E9A", // Pharos Testnet
  },
  usdc: {
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
    688688: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", // Pharos Testnet
  },
  // Legacy key retained for backward compatibility
  rwatoken: {
    84532: "0xA3b7e2B478286955716B660f536F0DC89995ef07", // Base Sepolia - SpoutTokenProxy
    688688: "0x54b753555853ce22f66Ac8CB8e324EB607C4e4eE", // Pharos Testnet
  },
  SpoutLQDtoken: {
    84532: "0xA3b7e2B478286955716B660f536F0DC89995ef07", // Base Sepolia - SpoutTokenProxy
    688688: "0x54b753555853ce22f66Ac8CB8e324EB607C4e4eE", // Pharos Testnet
  },
  proofOfReserve: {
    84532: "0x0000000000000000000000000000000000000000", // Base Sepolia - placeholder
    688688: "0x72F88509C53b939a0613c679a0F4768c0444d247", // Pharos Testnet - Blocksense Feed Store for LQD PoR (ID: 101001)
  },
  // CDP Vault System Contracts
  vat: {
    84532: "0xA187193003d63317148383831d3227aB5114a228", // Base Sepolia - Updated with deterministic vault IDs
    688688: "0xc0c9AbCaE1E1A8FDBd6D6c58c3Eee1c138186Dd3", // Pharos Testnet - Core accounting contract
  },
  jug: {
    84532: "0x04dcef936bF7BB40d76f2324b8D1f4251441F634", // Base Sepolia - Interest rate module
    688688: "0x0000000000000000000000000000000000000000", // Pharos Testnet - placeholder
  },
  spotter: {
    84532: "0x6412cafEae9115262c60d55c56bA968cbB41Ddcd", // Base Sepolia - Fixed getSpot() interface
    688688: "0xE5aC291cBD9a7858813C446628f06DEF839A32aa", // Pharos Testnet - Oracle mock for price feeds
  },
  gemJoin: {
    84532: "0xA8373A1F35bbC3a3578061Fe421F2BA66C480337", // Base Sepolia - Updated to point to new Vat
    688688: "0xFEd968b1b36C2827268eE8816a9F8e36d92b5c34", // Pharos Testnet - Collateral token adapter (LQD ilk)
  },
  stablecoinJoin: {
    84532: "0x0102b70650Be44bc23c812BA48a56B544242fC82", // Base Sepolia - Redeployed to use new SPUS stablecoin
    688688: "0x18ad85302B7bbbd1b5F77B902219C3034d0365cd", // Pharos Testnet - Stablecoin adapter for minting/burning
  },
  collateral: {
    84532: "0xA3b7e2B478286955716B660f536F0DC89995ef07", // Base Sepolia - SpoutTokenProxy (SLQD)
    688688: "0x0cd15cD448F6260507d8104354298AdA15CE4097", // Pharos Testnet - MockERC20 (TCOL)
  },
  stablecoin: {
    84532: "0x3d761D4bb4645609Fd4e95c5e93855B2063c5fbC", // Base Sepolia - MockStablecoin (SPUS, 18 decimals)
    688688: "0xb6cEaD376429d8855bd94A7914695AeF4849682c", // Pharos Testnet - MockStablecoin (TST)
  },
  // Legacy vault key for backward compatibility
  vault: {
    84532: "0xA187193003d63317148383831d3227aB5114a228", // Base Sepolia - Points to Vat (updated)
    688688: "0xc0c9AbCaE1E1A8FDBd6D6c58c3Eee1c138186Dd3", // Pharos Testnet - Points to Vat
  },
  // Add more contracts as needed
};

// USDC token decimals
export const USDC_DECIMALS = 6;

import { useChainId } from "wagmi";

export function useContractAddress(contract: keyof typeof contractaddresses) {
  const chainId = useChainId();
  const mapping = contractaddresses[contract] as
    | Record<number, string>
    | undefined;
  if (!mapping) {
    return undefined as any;
  }
  const value = mapping[chainId];
  return value as any;
}
