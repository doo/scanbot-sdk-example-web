import React from 'react';
import './main-menu-styles.scss'
import { withRouter } from 'react-router-dom'
import { RoutingService, RoutePath } from '../../service/routing-service';

class Header extends React.Component<any, any> {
    render() {
        return (
            <div className='header'>
                {this.props.back && <button
                    className='backButton'
                    onClick={this.props.path ? () => RoutingService.instance.goTo(this.props.path) : () => RoutingService.instance.back()}
                    dangerouslySetInnerHTML={{__html: "&#8592"}}
                />}
                <img className='logo' src={require('../../assets/ScanbotSDKwhite.svg')} alt='Scanbot logo' onClick={() => RoutingService.instance.home()} />
            </div>
        )
    }
}

export default withRouter(Header)