import React from "react";
import {StorageService} from "../../service/storage-service";
import './main-menu-styles.scss'

export default class CrashReportingAlert extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            showAlert: !StorageService.instance.getShowAlert()
        };
    }

    onclick() {
        StorageService.instance.setShowAlert(true);
        this.setState({showAlert: false});
    }

    render() {
        const {language} = this.props;
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
