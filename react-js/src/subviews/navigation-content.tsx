import React from "react";
import {Styles} from "../model/styles";
import {Toolbar} from "@material-ui/core";

import { withRouter } from 'react-router-dom'
class NavigationContent extends React.Component<any, any> {

    render() {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                <button
                    style={Styles.backButton}
                    onClick={() => this.props.history.goBack()}
                    dangerouslySetInnerHTML={{__html: "&#8249"}}
                />
                <Toolbar>SCANBOT WEB SDK EXAMPLE</Toolbar>
            </div>
        );
    }
}

export default withRouter(NavigationContent)