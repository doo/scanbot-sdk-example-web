import React from 'react';
import './main-menu-styles.scss'

export default class Header extends React.Component<any, any> {
    render() {
        return (
            <div className='logoContainer'>
                <img className='logo' src={require('../../assets/ScanbotSDKwhite.svg')} alt='Scanbot'/>
            </div>
        )
    }
}
