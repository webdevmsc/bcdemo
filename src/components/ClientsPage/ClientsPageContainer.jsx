import {connect} from "react-redux";
import ClientsPage from "./ClientsPage";
import React from 'react'
import {createClient} from "../../redux/clients-reducer";

const ClientsPageContainer = React.memo((props) => {
    return (
        <ClientsPage { ...props } />
    )
})

const mapStateToProps = (state) => {
    return {
        clients: state.clients.clients
    };
}


export default connect(mapStateToProps, { createClient })(ClientsPageContainer)