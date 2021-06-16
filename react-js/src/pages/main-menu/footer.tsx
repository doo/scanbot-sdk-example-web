import React from "react";
import './main-menu-styles.scss'

export default class Footer extends React.Component<any, any> {
    render() {
        const appVersion = "1.4.0.60";
        const sdkVersion = "1.78.0";
        const rights = this.props.language === "de" ? "Alle Rechte vorbehalten" : "All rights reserved";
        const text = `App version ${appVersion}<br />Scanbot SDK version ${sdkVersion}<br />© 2020 doo GmbH. ${rights}`;
        return <div className='footer'><p dangerouslySetInnerHTML={{__html: text}}/></div>;
    }
}
