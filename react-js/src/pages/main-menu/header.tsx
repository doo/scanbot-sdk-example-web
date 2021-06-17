import React from 'react';
import './main-menu-styles.scss'
import {Styles} from "../../model/styles";
import { withRouter } from 'react-router-dom'

class Header extends React.Component<any, any> {
    render() {
        return (
            <div className='header'>
                {this.props.back && <button
                    style={Styles.backButton}
                    onClick={() => this.props.history.goBack()}
                    dangerouslySetInnerHTML={{__html: "&#8249"}}
                />}
                <img className='logo' src={require('../../assets/ScanbotSDKwhite.svg')} alt='Scanbot'/>
            </div>
        )
    }
}

export default withRouter(Header)