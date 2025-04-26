import { Address, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const getWalletClient = () => {
  const account = privateKeyToAccount(process.env.TEST_PRIV_KEY as Address);
  const walletClient = createWalletClient({
    transport: http(),
    account,
    chain: sepolia,
  });
  return walletClient;
};
