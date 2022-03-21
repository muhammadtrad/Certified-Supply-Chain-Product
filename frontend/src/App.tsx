import { ReactElement } from 'react';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { SectionDivider } from './components/SectionDivider';
import { CertifiedSupplyChain } from './components/CertifiedSupplyChain';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <SectionDivider />
      <CertifiedSupplyChain />
    </StyledAppDiv>
  );
}
