import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner; // buyer
  bob: HardhatEthersSigner; // recipient
  charlie: HardhatEthersSigner; // other
};

describe("FHEPurchaseManager", function () {
  let signers: Signers;
  let contractAddress: string;
  let contract: any;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0], bob: ethSigners[1], charlie: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    const factory = await ethers.getContractFactory("FHEPurchaseManager");
    contract = await factory.deploy();
    contractAddress = await contract.getAddress();
  });

  it("bob can claim exactly once; charlie gets nothing", async function () {
    // Alice creates a purchase for Bob with amount 7
    const enc = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(7)
      .add256(BigInt(signers.bob.address))
      .encrypt();

    await (await contract.connect(signers.alice).purchase(enc.handles[0], enc.inputProof, enc.handles[1], enc.inputProof)).wait();

    // Charlie tries to claim id 0
    await (await contract.connect(signers.charlie).claim([0])).wait();
    const encBalCharlie = await contract.getEncryptedBalance(signers.charlie.address);
    if (encBalCharlie !== ethers.ZeroHash) {
      const clearCharlie = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encBalCharlie,
        contractAddress,
        signers.charlie,
      );
      expect(clearCharlie).to.eq(0);
    }

    // Bob claims id 0
    await (await contract.connect(signers.bob).claim([0])).wait();
    const encBalBob = await contract.getEncryptedBalance(signers.bob.address);
    const clearBob = await fhevm.userDecryptEuint(FhevmType.euint32, encBalBob, contractAddress, signers.bob);
    expect(clearBob).to.eq(7);

    // Bob claims again; balance should not increase
    await (await contract.connect(signers.bob).claim([0])).wait();
    const encBalBob2 = await contract.getEncryptedBalance(signers.bob.address);
    const clearBob2 = await fhevm.userDecryptEuint(FhevmType.euint32, encBalBob2, contractAddress, signers.bob);
    expect(clearBob2).to.eq(7);
  });
});

