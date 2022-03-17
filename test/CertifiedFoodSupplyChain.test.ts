import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CertifiedFoodSupplyChain', function (): void {
  it('Should deploy the CertifiedProduct contract with defined administrator addresses', async function (): Promise<void> {
    const CertifiedProduct = await ethers.getContractFactory(
      'CertifiedProduct'
    );
    const accounts = await ethers.provider.listAccounts();
    const certifiedProduct = await CertifiedProduct.deploy(accounts);
    await certifiedProduct.deployed();
    // console.log('test 1', await certifiedProduct.viewAdministrators());
    expect((await certifiedProduct.viewAdministrators()).length).to.equal(20);

    // const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});

// Contract: SupplyChain
//     Steps
//       ✓ newStep creates a step. (90ms)
//       ✓ newStep creates chains. (160ms)
//       ✓ newStep maintains lastSteps. (121ms)
//       ✓ append only on last steps (107ms)
//       ✓ newStep allows multiple precedents. (136ms)
//       ✓ item must be unique or the same as a precedent. (114ms)
//       ✓ newStep records step creator. (128ms)
//       ✓ newStep records item. (165ms)
//       ✓ lastSteps records item. (138ms)
//   9 passing (2s)
