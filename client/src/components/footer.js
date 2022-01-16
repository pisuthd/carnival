import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    bottom: 3%;
    left: 0px;
    font-size: 20px;
    width: 100%;

    @media only screen and (max-width: 600px) {
        font-size: 16px;
    }

    a {
        color: inherit;
        text-decoration: initial;

        :hover {
            text-decoration: underline;
        }

    }


`

const Footer = () => {
    return (
        <Wrapper>
            <div style={{ textAlign: "center"  }}>
                Made during NFTHack 2022
            </div>
        </Wrapper>
    )
}

export default Footer