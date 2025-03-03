import {connect} from "react-redux";
import ClientPage from "./ClientPage";
import React from 'react'
import {updateClients} from "../../redux/clients-reducer";

const ClientPageContainer = React.memo((props) => {
    return (
        <ClientPage { ...props } />
    )
})

const mapStateToProps = (state) => {
    return {
        clients: state.clients.clients
    };
}


export default connect(mapStateToProps, { updateClients })(ClientPageContainer)