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

const StyledContractDiv = styled.div`
  display: grid;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 30px;
  place-self: center;
  align-items: center;
`;

const StyledAdminDiv = styled.div`
  display: grid;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 30px;
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


type Checkpoint = {
  itemId: string,
  creator: string,
  prevCheckpointIds: Array<string>
}

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
  const [adminInput, setAdminInput] = useState<string>('');
  const [adminListInput, setAdminListInput] = useState<Array<string>>([]);
  const [adminList, setAdminList] = useState<Array<string>>([]);

  const [itemIdInput, setItemIdInput] = useState<string>('');
  const [prevCheckpointInput, setPrevCheckpointInput] = useState<string>('');
  const [prevCheckpointListInput, setPrevCheckpointListInput] = useState<
    Array<string>
  >([]);
  const [checkpointId, setCheckpointId] = useState<string>('');
  const [checkpointData, setCheckpointData] = useState<Checkpoint>({
    itemId: '',
    creator: '',
    prevCheckpointIds: []
  });
  const [viewItemId, setViewItemId] = useState<string>('');
  const [lastCheckpointId, setLastCheckpointId] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

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

  function handleAdminInputChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAdminInput(event.target.value);
  }

  function handleAddAdministrator(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    const list = [...adminListInput];
    list.push(adminInput);
    setAdminListInput(list);
    setAdminInput('');
  }

  function handleAddPreviousCheckpoint(
    event: MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
    if (prevCheckpointInput.length) {
      const list = [...prevCheckpointListInput];
      list.push(prevCheckpointInput);
      setPrevCheckpointListInput(list);
      setPrevCheckpointInput('');
    }
  }

  function handleNewCheckpointSubmit(
    event: MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
    // modify this to create new checkpoint
    if (!certifiedSupplyChainContract) {
      window.alert('Undefined certifiedSupplyChainContract');
      return;
    }

    if (!itemIdInput) {
      window.alert('Item ID cannot be empty');
      return;
    }

    async function submitNewCheckpoint(
      certifiedSupplyChainContract: Contract
    ): Promise<void> {
      try {
        const prevCheckpointList = prevCheckpointListInput.map((cp) =>
          parseInt(cp)
        );
        const newCheckpointTxn =
          await certifiedSupplyChainContract.newCheckpoint(
            parseInt(itemIdInput),
            prevCheckpointList
          );
        await newCheckpointTxn.wait();
        const checkpointId = await certifiedSupplyChainContract.getLastCheckpointItemId(parseInt(itemIdInput));
        window.alert(`Success!\n\nNew checkpoint created with checkpoint ID ${checkpointId}!`);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    submitNewCheckpoint(certifiedSupplyChainContract);
  }

  function handleViewCheckpoint(
    event: MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
    if (!certifiedSupplyChainContract) {
      window.alert('Undefined certifiedSupplyChainContract');
      return;
    }

    if (!checkpointId) {
      window.alert('Checkpoint ID cannot be empty');
      return;
    }

    async function viewCheckpoint(
      certifiedSupplyChainContract: Contract
    ): Promise<void> {
      try {
        const data =
          await certifiedSupplyChainContract.getCheckpointData(
            parseInt(checkpointId)
          );
          console.log('data', data);
        
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    viewCheckpoint(certifiedSupplyChainContract);
  }

  function handleViewLastCheckpointByItemId(
    event: MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
    if (!certifiedSupplyChainContract) {
      window.alert('Undefined certifiedSupplyChainContract');
      return;
    }

    if (!viewItemId) {
      window.alert('Item ID cannot be empty');
      return;
    }

    async function viewLastCheckpoint(
      certifiedSupplyChainContract: Contract
    ): Promise<void> {
      try {
        const lastCheckpoint =
          await certifiedSupplyChainContract.getLastCheckpointItemId(
            parseInt(viewItemId)
          );
          console.log('lastCheckpoint', lastCheckpoint);
          setLastCheckpointId(lastCheckpoint.toString());
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    viewLastCheckpoint(certifiedSupplyChainContract);
  }

  function handlePreviousCheckpointChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    event.preventDefault();
    setPrevCheckpointInput(event.target.value);
  }

  function handleCheckpointChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    event.preventDefault();
    setCheckpointId(event.target.value);
  }

  function handleItemIdInputChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setItemIdInput(event.target.value);
  }

  function handleClearAdminList() {
    setAdminListInput([]);
  }

  function handleClearPrevCheckpoints() {
    setPrevCheckpointListInput([]);
  }

  function handleViewItemIdChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setViewItemId(event.target.value);
  }

  return (
    <>
      <StyledAdminDiv style={{ maxWidth: '710px' }}>
        <StyledLabel htmlFor="adminListInput">Administrators</StyledLabel>
        <StyledInput
          value={adminInput}
          id="adminListInput"
          type="text"
          placeholder={`add an administrator address`}
          onChange={handleAdminInputChange}
          style={{ fontStyle: 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || certifiedSupplyChainContract ? true : false}
          style={{
            cursor:
              !active || certifiedSupplyChainContract
                ? 'not-allowed'
                : 'pointer',
            borderColor:
              !active || certifiedSupplyChainContract ? 'unset' : 'blue'
          }}
          onClick={handleAddAdministrator}
        >
          Add
        </StyledButton>
        <StyledLabel>Current Administrators</StyledLabel>
        <div>
          {adminListInput.length ? (
            adminListInput.reduce((acc, curr, idx) => {
              if (idx < adminListInput.length - 1) {
                return acc + curr + ', ';
              }
              return acc + curr;
            }, '')
          ) : (
            <em>{`<No administrators has been added>`}</em>
          )}
        </div>
        <StyledButton
          style={{
            cursor: 'pointer',
            borderColor: 'blue'
          }}
          onClick={handleClearAdminList}
        >
          Clear
        </StyledButton>
      </StyledAdminDiv>
      <StyledDeployContractButton
        disabled={!active || certifiedSupplyChainContract ? true : false}
        style={{
          height: '100%',
          width: '300px',
          cursor:
            !active || certifiedSupplyChainContract ? 'not-allowed' : 'pointer',
          borderColor:
            !active || certifiedSupplyChainContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy <em>CertifiedSupplyChain</em> Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledContractDiv style={{ maxWidth: '710px' }}>
        <StyledLabel>Contract address</StyledLabel>
        <div>
          {certifiedSupplyChainContractAddr ? (
            certifiedSupplyChainContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Contract Administrators</StyledLabel>
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
        <StyledLabel htmlFor="itemIdInput">Item ID</StyledLabel>
        <StyledInput
          value={itemIdInput}
          id="itemIdInput"
          type="text"
          placeholder={`enter the item ID`}
          onChange={handleItemIdInputChange}
          style={{ fontStyle: 'italic' }}
        ></StyledInput>
        <div></div>

        <StyledLabel htmlFor="checkpointInput">
          Previous Checkpoint ID
        </StyledLabel>
        <StyledInput
          value={prevCheckpointInput}
          id="checkpointInput"
          type="text"
          placeholder={`enter a checkpoint`}
          onChange={handlePreviousCheckpointChange}
          style={{ fontStyle: 'italic' }}
        ></StyledInput>
        <StyledButton
          style={{
            height: '100%',
            width: '150px',
            cursor: 'pointer',
            borderColor: 'blue'
          }}
          onClick={handleAddPreviousCheckpoint}
        >
          Add previous checkpoint ID
        </StyledButton>
        <StyledLabel>Previous Checkpoints ID</StyledLabel>
        <div>
          {prevCheckpointListInput.length ? (
            prevCheckpointListInput.reduce((acc, curr, idx) => {
              if (idx < prevCheckpointListInput.length - 1) {
                return acc + curr + ', ';
              }
              return acc + curr;
            }, '')
          ) : (
            <em>{`<No previous checkpoints has been added>`}</em>
          )}
        </div>
        <StyledButton
          style={{
            cursor: 'pointer',
            borderColor: 'blue'
          }}
          onClick={handleClearPrevCheckpoints}
        >
          Clear
        </StyledButton>
      </StyledContractDiv>
      <StyledDeployContractButton
        style={{
          height: '100%',
          width: '300px',
          cursor: 'pointer',
          borderColor: 'blue'
        }}
        onClick={handleNewCheckpointSubmit}
      >
        Create New Checkpoint ID
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledContractDiv style={{ maxWidth: '710px' }}>
      <StyledLabel htmlFor="viewItemId">
          Item ID
        </StyledLabel>
        <StyledInput
          value={viewItemId}
          id="checkpointId"
          type="text"
          placeholder={`enter an Item ID`}
          onChange={handleViewItemIdChange}
          style={{ fontStyle: 'italic' }}
        ></StyledInput>
        <StyledButton
          style={{
            height: '100%',
            width: '200px',
            cursor: 'pointer',
            borderColor: 'blue'
          }}
          onClick={handleViewLastCheckpointByItemId}
        >
          View Last Checkpoint ID
        </StyledButton>
        <StyledLabel>Last Checkpoint ID</StyledLabel>
        <div>
          {lastCheckpointId}
        </div>
      </StyledContractDiv>
      <SectionDivider />

      <StyledContractDiv style={{ maxWidth: '710px' }}>
      <StyledLabel htmlFor="checkpointInput">
           Checkpoint ID
        </StyledLabel>
        <StyledInput
          value={checkpointId}
          id="checkpointId"
          type="text"
          placeholder={`enter a checkpoint ID`}
          onChange={handleCheckpointChange}
          style={{ fontStyle: 'italic' }}
        ></StyledInput>
        <StyledButton
          style={{
            height: '100%',
            width: '150px',
            cursor: 'pointer',
            borderColor: 'blue'
          }}
          onClick={handleViewCheckpoint}
        >
          View checkpoint Data
        </StyledButton>
        <StyledLabel>Creator</StyledLabel>
        <div>
          {checkpointData.creator}
        </div>
        <div></div>
        <StyledLabel>Item ID</StyledLabel>
        <div>
          {checkpointData.itemId}
        </div>
        <div></div>
        <StyledLabel>Previous Checkpoints IDs</StyledLabel>
        <div>
          {checkpointData.prevCheckpointIds.length ? (
            checkpointData.prevCheckpointIds.reduce((acc, curr, idx) => {
              if (idx < checkpointData.prevCheckpointIds.length - 1) {
                return acc + curr + ', ';
              }
              return acc + curr;
            }, '')
          ) : (
            <em>{`<No previous checkpoints available>`}</em>
          )}
        </div>
        <div></div>
      </StyledContractDiv>
    </>
  );
}
