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
	render() {
        console.log('here')
        const {language} = this.props
		return (
            <div className='alert'>
                <p>{language === 'de'
                    ? 'Dürfen wir anonyme Absturzberichte erstellen, um die Benutzererfahrung zu verbessern?'
                    : 'Can we create anonymous crash reports, helping us improve your user experience?'
                }</p>
                <button>{language === 'de' ? 'ABLEHNEN' : 'DENY'}</button>
                <button>{language === 'de' ? 'ERLAUBEN' : 'ALLOW'}</button>
            </div>
        )
	}
}
export default class MainMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            showAlert: StorageService.instance.getShowAlert()
        };
    }

    render() {
        const {language} = this.props
        return (
            <>
                <Header />
                {this.state.showAlert && <Alert language={language}/>}
                <div className='contentContainer'>
                    <Section {...sectionContent({...this.props}).documentScanner} />
                    <Section {...sectionContent({...this.props}).dataDetectors} />
                    <Section {...sectionContent({...this.props}).about} />
                    <Section {...sectionContent({...this.props}).legal} />
                    <Footer language={language} />
                </div>
            </>
        )
    }
}
