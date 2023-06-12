import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import dotenv from 'dotenv';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';

dotenv.config();

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) throw new Error('RPC_URL not found');
console.log('RPC_URL: ', RPC_URL);
const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
const address2 = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

// Found after creating a safe
const safeAddress = "0xd4a75af3b845f78Cc41504B953732AF8A96f42F1"
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const safeOwner = provider.getSigner(address);
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner,
});
const owners = [address];
const threshold = 1;
const safeAccountConfig: SafeAccountConfig = {
  owners,
  threshold,
};

async function createAccount() {
  const safeFactory = await SafeFactory.create({ ethAdapter });
  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
  console.log({
    address: await safeSdk.getAddress(),

    message: 'Safe SDK created',
  });
}

async function sendTransaction() {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: address2,
    value: '0x1',
    data: '0x',
  };
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  });

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData,
  });

  console.log({
    safeTransaction,
  })
}

async function main() {
  await provider.send('hardhat_impersonateAccount', [address]);
  switch (process.argv[2]) {
    case 'create':
      await createAccount();
      break;
    case 'send':
      await sendTransaction();
      break;
    default:
      console.log('No command found');
  }
}

main();
