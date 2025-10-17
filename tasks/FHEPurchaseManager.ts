import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("purchase:address", "Prints the FHEPurchaseManager address").setAction(async function (_args: TaskArguments, hre) {
  const { deployments } = hre;
  const d = await deployments.get("FHEPurchaseManager");
  console.log("FHEPurchaseManager address is " + d.address);
});

task("purchase:buy", "Create an encrypted purchase for recipient")
  .addOptionalParam("address", "Optionally specify the FHEPurchaseManager contract address")
  .addParam("value", "Purchase amount as integer")
  .addParam("recipient", "Recipient address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const value = BigInt(taskArguments.value);
    const recipient = taskArguments.recipient as string;

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get("FHEPurchaseManager");
    console.log(`FHEPurchaseManager: ${deployment.address}`);

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("FHEPurchaseManager", deployment.address);

    const enc = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add32(Number(value))
      .add256(BigInt(recipient))
      .encrypt();

    const tx = await contract.connect(signer).purchase(enc.handles[0], enc.inputProof, enc.handles[1], enc.inputProof);
    console.log(`Wait for tx: ${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`status=${receipt?.status}`);
  });

task("purchase:claim", "Claim a set of purchases for the caller")
  .addOptionalParam("address", "Optionally specify the FHEPurchaseManager contract address")
  .addParam("ids", "Comma-separated ids")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get("FHEPurchaseManager");
    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("FHEPurchaseManager", deployment.address);

    const ids = (taskArguments.ids as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s));

    const tx = await contract.connect(signer).claim(ids);
    console.log(`Wait for tx: ${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`status=${receipt?.status}`);
  });

task("purchase:decrypt-balance", "Decrypt the encrypted balance of an address")
  .addOptionalParam("address", "Optionally specify the FHEPurchaseManager contract address")
  .addParam("user", "User address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get("FHEPurchaseManager");
    const user = taskArguments.user as string;

    const contract = await ethers.getContractAt("FHEPurchaseManager", deployment.address);
    const encBal = await contract.getEncryptedBalance(user);
    if (encBal === ethers.ZeroHash) {
      console.log("encrypted balance:", encBal);
      console.log("clear balance    : 0");
      return;
    }

    const [signer] = await ethers.getSigners();
    const clear = await fhevm.userDecryptEuint(FhevmType.euint32, encBal, deployment.address, signer);
    console.log("encrypted balance:", encBal);
    console.log("clear balance    :", clear);
  });

