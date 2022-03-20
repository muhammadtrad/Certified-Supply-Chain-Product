import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import CertifiedSupplyChainArtifact from '../artifacts/contracts/CertifiedSupplyChain.sol/CertifiedSupplyChain.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function CertifiedSupplyChain(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [certifiedSupplyChainContract, setCertifiedSupplyChainContract] =
    useState<Contract>();
  const [
    certifiedSupplyChainContractAddr,
    setCertifiedSupplyChainContractAddr
  ] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [adminInput, setAdminInput] = useState<string>('');
  const [adminListInput, setAdminListInput] = useState<Array<string>>([]);
  const [adminList, setAdminList] = useState<Array<string>>([]);
  const [greetingInput, setGreetingInput] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!certifiedSupplyChainContract) {
      return;
    }

    async function getGreeting(
      certifiedSupplyChainContract: Contract
    ): Promise<void> {
      const _greeting = await certifiedSupplyChainContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(certifiedSupplyChainContract);
  }, [certifiedSupplyChainContract, greeting]);

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the CertifiedSupplyChain contract one time, when a signer is defined
    if (certifiedSupplyChainContract || !signer) {
      return;
    }

    async function deployCertifiedSupplyChainContract(
      signer: Signer
    ): Promise<void> {
      const CertifiedSupplyChain = new ethers.ContractFactory(
        CertifiedSupplyChainArtifact.abi,
        CertifiedSupplyChainArtifact.bytecode,
        signer
      );
      try {
        const certifiedSupplyChainContract = await CertifiedSupplyChain.deploy(
          adminListInput
        );

        await certifiedSupplyChainContract.deployed();

        const administrators =
          await certifiedSupplyChainContract.viewAdministrators();
        console.log('administrators', administrators);
        setCertifiedSupplyChainContract(certifiedSupplyChainContract);
        setAdminList(administrators);

        window.alert(
          `CertifiedSupplyChain deployed to: ${certifiedSupplyChainContract.address}`
        );

        setCertifiedSupplyChainContractAddr(
          certifiedSupplyChainContract.address
        );
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployCertifiedSupplyChainContract(signer);
  }

  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleAdminInputChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAdminInput(event.target.value);
  }

  function handleAdministratorAdd(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    const list = [...adminListInput];
    list.push(adminInput);
    setAdminListInput(list);
  }

  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!certifiedSupplyChainContract) {
      window.alert('Undefined certifiedSupplyChainContract');
      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(
      certifiedSupplyChainContract: Contract
    ): Promise<void> {
      try {
        const setGreetingTxn = await certifiedSupplyChainContract.setGreeting(
          greetingInput
        );

        await setGreetingTxn.wait();

        const newGreeting = await certifiedSupplyChainContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== greeting) {
          setGreeting(newGreeting);
        }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitGreeting(certifiedSupplyChainContract);
  }

  return (
    <>
      <StyledLabel htmlFor="adminListInput">Administrators</StyledLabel>
      <StyledInput
        id="adminListInput"
        type="text"
        placeholder={`add an administrator address`}
        onChange={handleAdminInputChange}
        style={{ fontStyle: greeting ? 'normal' : 'italic' }}
      ></StyledInput>
      <StyledButton
        disabled={false}
        style={{
          cursor: 'pointer',
          borderColor: 'blue'
        }}
        onClick={handleAdministratorAdd}
      >
        Add
      </StyledButton>
      <StyledLabel>Current Administrators for Contract</StyledLabel>
      <div>
        {adminListInput.reduce((acc, curr, idx) => {
          if (idx < adminListInput.length - 1) {
            return acc + curr + ', ';
          }
          return acc + curr;
        }, '')}
      </div>
      <StyledDeployContractButton
        disabled={!active || certifiedSupplyChainContract ? true : false}
        style={{
          height: '100%',
          cursor:
            !active || certifiedSupplyChainContract ? 'not-allowed' : 'pointer',
          borderColor:
            !active || certifiedSupplyChainContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy CertifiedSupplyChain Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {certifiedSupplyChainContractAddr ? (
            certifiedSupplyChainContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current Administrators</StyledLabel>
        <div>
          {adminList.length ? (
            adminList.reduce((acc, curr, idx) => {
              if (idx < adminList.length - 1) {
                return acc + curr + ', ';
              }
              return acc + curr;
            }, '')
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
        <StyledInput
          id="greetingInput"
          type="text"
          placeholder={greeting ? '' : '<Contract not yet deployed>'}
          onChange={handleGreetingChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !certifiedSupplyChainContract ? true : false}
          style={{
            cursor:
              !active || !certifiedSupplyChainContract
                ? 'not-allowed'
                : 'pointer',
            borderColor:
              !active || !certifiedSupplyChainContract ? 'unset' : 'blue'
          }}
          onClick={handleGreetingSubmit}
        >
          Submit
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}
