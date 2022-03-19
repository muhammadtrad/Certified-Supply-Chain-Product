import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy Greeter contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const Greeter = await hre.ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, Hardhat!');
    await greeter.deployed();

    const CertifiedSupplyChain = await hre.ethers.getContractFactory(
      'CertifiedSupplyChain'
    );
    const certifiedSupplyChain = await CertifiedSupplyChain.deploy([]);
    await certifiedSupplyChain.deployed();

    console.log(
      'Greeter deployed to:',
      greeter.address,
      'CertifiedSupplyChain deployed to:',
      certifiedSupplyChain.address
    );
  }
);
