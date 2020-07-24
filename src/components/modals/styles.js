import styled from "styled-components";
import { Image, Modal, Item, Header } from "semantic-ui-react";

export const StyledModal = styled(Modal)`
&.top {
    @media only screen and (min-width: 576px) {
        position: absolute;
        top: 5%;
        right: 5%;
    }
}
`

export const StyledDescriptionModal = styled(Modal.Description)`   
display: flex;
justify-content: center;
flex-wrap: wrap;
padding: 1.25rem 1.5rem;

&.text {
    display: block;
}
`

export const StyledContentModal = styled(Modal.Content)`
display: flex !important;
justify-content: center;

&.list {
    padding: 3rem 10rem !important;
}

&.wrap {
    flex-wrap: wrap;
}
`

export const StyledItemGroup = styled(Item.Group)`
padding: 1.25rem 1.5rem;
`

export const StyledListImageWrapper = styled.div`
height: 80px;
align-items: center;
display: flex;
`

export const StyledListImage = styled(Image)`
margin-right: auto !important;
margin-left: auto !important;
display: block !important;    
`

export const StyledHeader = styled(Header)`
    text-align: center
`