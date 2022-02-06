import styled from "styled-components";

const Card = styled.div`
  width: 210px;
  height: 210px;
  background-color: ${(props) => props.theme.cardBackground};
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
`;
export default Card;
