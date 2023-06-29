import React, { ReactNode } from 'react';

import Container from '@mui/material/Container';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.28) 0px 2px 8px !important;
  text-align: center;
  margin-bottom: 20px;
`;

interface Props {
  children: ReactNode;
}

const index = ({ children }: Props): JSX.Element => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default index;
