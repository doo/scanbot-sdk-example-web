import React from "react";
import './main-menu-styles.scss'

export default class Footer extends React.Component<any, any> {
    render() {
        const {version} = this.props;
        const rights = this.props.language === "de" ? "Alle Rechte vorbehalten" : "All rights reserved";
        const copyright = `© ${new Date().getFullYear()} doo GmbH. ${rights}`;
        const text = `App version ${version.app}<br />Scanbot SDK version ${version.sdk}<br />${copyright}`;
        return <div className='footer'><p dangerouslySetInnerHTML={{__html: text}}/></div>;
    }
}
