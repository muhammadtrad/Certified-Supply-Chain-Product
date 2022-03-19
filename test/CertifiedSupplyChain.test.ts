/* eslint-disable prettier/prettier */
import { expect, assert } from 'chai';
import { ethers } from 'hardhat';

describe('CertifiedSupplyChain', function () {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let certifiedProduct: any;
  before(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const CertifiedProduct = await ethers.getContractFactory(
      'CertifiedSupplyChain'
    );
    certifiedProduct = await CertifiedProduct.deploy([
      addr1.address,
      addr2.address,
      addr3.address
    ]);
    await certifiedProduct.deployed();
  });

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

    it('should maintain last checkpoints', async () => {
      const tx3 = await certifiedProduct.connect(addr1).newCheckpoint(3, [1,2]);
      const receipt2 = await tx3.wait(); 

      const event = receipt2.events.find(
        (x: any) => x.event === 'CheckPointCreated'
      );
      assert(event, 'Event not found!');
      const isLastCheckpoint = await certifiedProduct.isLastCheckpoint(3);
      const isLastCheckpoint2 = await certifiedProduct.isLastCheckpoint(2);
      expect(isLastCheckpoint).equal(true);
      expect(isLastCheckpoint2).equal(true);
    });

    it('should append on last checkpoints', async () => {
      const prevCheckpoints = await certifiedProduct.getPrevCheckpoints(3);
      const isLastCheckpoint3 = await certifiedProduct.isLastCheckpoint(prevCheckpoints[0].toString());
      expect(isLastCheckpoint3).equal(true);
    });

    it('newCheckpoint should allow multiple prevCheckpoints', async () => {
      const prevCheckpoints = await certifiedProduct.getPrevCheckpoints(3);
      expect(prevCheckpoints.length).equal(2);
      expect(prevCheckpoints[0].toString()).equal('1');
      expect(prevCheckpoints[1].toString()).equal('2');
    });

    it('newCheckpoint records checkpoint creator', async () => {
      const checkpointCreator = await certifiedProduct.getCheckpointCreator(3);
      expect(addr1.address).equal(checkpointCreator);
    });

    it('newCheckpoint records checkpoint creator', async () => {
      const checkpointCreator = await certifiedProduct.getCheckpointCreator(3);
      expect(checkpointCreator).equal(addr1.address);
    });

    it('newCheckpoint records item id', async () => {
      const checkpointItemId = await certifiedProduct.getCheckpointItemId(3);
      expect(checkpointItemId).equal(3);
    });

    it('lastCheckpoint maps the item id to checkpoint', async () => {
      const lastCheckpointItem = await certifiedProduct.getLastCheckpointItemId(2);
      expect(lastCheckpointItem).equal(2);
    });
  });
});
