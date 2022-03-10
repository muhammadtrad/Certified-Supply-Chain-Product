import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CertifiedProduct', function (): void {
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
