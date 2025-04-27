import { createPublicClient, getCreateAddress, http } from "viem";
import { sepolia } from "viem/chains";

async function predictContractAddress() {
  const provider = createPublicClient({ transport: http(), chain: sepolia });

  const nonce = BigInt(
    await provider.getTransactionCount({
      address: "0x1dda4b932633cad2a182f444bd5de39bb01c278a",
    })
  );

  const predictedAddress = getCreateAddress({
    from: "0x1Dda4b932633cAd2a182f444bd5DE39BB01c278A",
    nonce: nonce + 1n,
  });

  console.log(`Predicted contract address: ${predictedAddress}`);
}
predictContractAddress();
