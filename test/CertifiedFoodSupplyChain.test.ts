/* eslint-disable prettier/prettier */
import { expect, assert } from 'chai';
import { ethers } from 'hardhat';

describe('CertifiedFoodSupplyChain', function () {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let nonAdministrator: any;
  let certifiedProduct: any;
  before(async () => {
    [owner, addr1, addr2, addr3, nonAdministrator] = await ethers.getSigners();
    const CertifiedProduct = await ethers.getContractFactory(
      'CertifiedFoodSupplyChain'
    );
    certifiedProduct = await CertifiedProduct.deploy([
      addr1.address,
      addr2.address,
      addr3.address
    ]);
    await certifiedProduct.deployed();
  });

  // describe('creating a new checkpoint as a non-administrator', () => {
  //   it('should revert', async () => {
  //     await expect(
  //       certifiedProduct.connect(nonAdministrator).newCheckpoint(0, [])
  //     ).to.be.revertedWith('Only administrator can create checkpoint');
  //   });
  // });

  describe('creating a checkpoint as the contract owner', () => {
    let receipt: any;
    before(async () => {
      const tx = await certifiedProduct.connect(owner).newCheckpoint(0, []);
      receipt = await tx.wait();
    });

    it('should emit a `CheckPointCreated` event', () => {
      const event = receipt.events.find(
        (x: any) => x.event === 'CheckPointCreated'
      );
      assert(event, 'Event not found!');
    });
  });

  describe('creating a checkpoint as an administrator', () => {
    let receipt: any;
    before(async () => {
      const tx = await certifiedProduct.connect(addr1).newCheckpoint(1, []);
      receipt = await tx.wait();
    });

    it('should emit a `CheckPointCreated` event', () => {
      const event = receipt.events.find(
        (x: any) => x.event === 'CheckPointCreated'
      );
      assert(event, 'Event not found!');
    });

    it('should create a chain of checkpoints', async () => {
      const tx2 = await certifiedProduct.connect(addr1).newCheckpoint(2, [1]);
      const receipt2 = await tx2.wait();

      const event = receipt2.events.find(
        (x: any) => x.event === 'CheckPointCreated'
      );
      assert(event, 'Event not found!');
      const prevCheckpoints = await certifiedProduct.getPrevCheckpoints(2);
      expect(prevCheckpoints[0].toString()).equal('1');
    });
  });
});

//       ✓ newStep maintains lastSteps. (121ms)
//       ✓ append only on last steps (107ms)
//       ✓ newStep allows multiple precedents. (136ms)
//       ✓ item must be unique or the same as a precedent. (114ms)
//       ✓ newStep records step creator. (128ms)
//       ✓ newStep records item. (165ms)
//       ✓ lastSteps records item. (138ms)




//       ✓ newStep creates a step. (90ms)
//       ✓ newStep creates chains. (160ms)


