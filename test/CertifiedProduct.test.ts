import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CertifiedProduct', function (): void {
  it("Should return the new greeting once it's changed", async function (): Promise<void> {
    const CertifiedProduct = await ethers.getContractFactory(
      'CertifiedProduct'
    );
    const certifiedProduct = await CertifiedProduct.deploy([]);
    await certifiedProduct.deployed();
    console.log('test 1', await certifiedProduct.viewAdministrators());
    // expect(await certifiedProduct.greet()).to.equal('Hello, world!');

    // const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});
