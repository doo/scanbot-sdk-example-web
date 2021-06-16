import React from 'react';
import './main-menu-styles.scss'

import Section from './main-menu-section'
import {sectionContent} from './main-menu-model'
import {StorageService} from "../../service/storage-service";

class Header extends React.Component<any, any> {
	render() {
		return (
            <div className='logoContainer'>
                <img
                    className='logo'
                    src={require('../../assets/ScanbotSDKwhite.svg')}
                    alt='Scanbot logo'
                />
            </div>
        )
	}
}

class Footer extends React.Component<any, any> {
	render() {
		return (
            <div className='footer'>
                <p dangerouslySetInnerHTML={{__html: this.props.language === 'de' 
                    ? `App version 1.4.0.60<br />
                    Scanbot SDK version 1.78.0<br />
                    © 2020 doo GmbH. Alle Rechte vorbehalten.`
                    : `App version 1.4.0.60<br />
                    Scanbot SDK version 1.78.0<br />
                    © 2020 doo GmbH. All rights reserved.`
                }}/>
            </div>
        )
	}
}

class Alert extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            showAlert: !StorageService.instance.getShowAlert()
        };
    }

    onclick() {
        StorageService.instance.setShowAlert(true)
        this.setState({showAlert: false})
    }

	render() {
        const {language} = this.props
		return (
            <>
                { this.state.showAlert && <div className='alertContainer'>
                    <p className='alert'>{language === 'de'
                        ? 'Dürfen wir anonyme Absturzberichte erstellen, um die Benutzererfahrung zu verbessern?'
                        : 'Can we create anonymous crash reports, helping us improve your user experience?'
                    }</p>
                    <div className='alertButtonContainer'>
                        <button className='alertButton' onClick={this.onclick.bind(this)}>{language === 'de' ? 'ABLEHNEN' : 'DENY'}</button>
                        <button className='alertButton' onClick={this.onclick.bind(this)}>{language === 'de' ? 'ERLAUBEN' : 'ALLOW'}</button>
                    </div>
                </div>}
            </>
        )
	}
}
export default class MainMenu extends React.Component<any, any> {

    render() {
        const {language} = this.props
        const content = sectionContent({...this.props})
        return (
            <>
                <Header />
                <Alert language={language}/>
                <div className='contentContainer'>
                    <Section {...content.documentScanner} />
                    <Section {...content.dataDetectors} />
                    <Section {...content.about} />
                    <Section {...content.legal} />
                    <Footer language={language} />
                </div>
            </>
        )
    }
}
