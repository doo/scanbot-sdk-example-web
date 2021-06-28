import React from 'react';
import './main-menu-styles.scss'
import { withRouter } from 'react-router-dom'
import { RoutingService } from '../../service/routing-service';

class Header extends React.Component<any, any> {

    render() {
        const logo = require('../../assets/ScanbotSDKwhite.svg');
        return (
            <div className='header'>
                {this.props.back && <button
                    className='backButton'
                    onClick={this.onBackClick.bind(this)}
                    dangerouslySetInnerHTML={{__html: "&#8592"}}
                />}
                <img className='logo' src={logo} alt='ScanbotSDK' onClick={this.onHomeClick.bind(this)} />
            </div>
        )
    }

    onBackClick() {
        if (this.props.path) {
            RoutingService.instance.goTo(this.props.path);
        } else {
            RoutingService.instance.back()
        }
    }

    onHomeClick() {
        RoutingService.instance.home();
    }
}

export default withRouter(Header)
