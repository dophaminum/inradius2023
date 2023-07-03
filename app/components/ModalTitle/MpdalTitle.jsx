import styled from "@emotion/styled";

const StyledTitle = styled.div`
  display: flex;
`;

const StyledTitleHeading = styled.div`
  flex-grow: 1;
  padding-right: 24px;
  h1 {
    line-height: 1.2;
    flex-grow: 1;
    text-align: center;
    font-size: 24px;
    margin: 0;
  }

  @media screen and (min-width: 43.125em) {
    h1 {
      font-size: 32px;
      margin: 0;
    }
  }
`;

export default function ModalTitle({ title, children }) {
  return (
    <StyledTitle>
      {children}
      <StyledTitleHeading>
        <h1>{title}</h1>
      </StyledTitleHeading>
    </StyledTitle>
  );
}
