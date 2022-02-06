import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  place-items: center;
  place-content: center;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  @media (max-width: 512px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 512px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export default Grid;
