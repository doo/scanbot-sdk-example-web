import React from 'react';
import './main-menu-styles.scss'

import Section from './main-menu-section'
import {sectionContent} from './main-menu-model'

import Header from "./header";
import Footer from "./footer";
import CrashReportingAlert from "./crash-reporting-alert";

export default class MainMenu extends React.Component<any, any> {

    render() {
        const {language} = this.props;
        const content = sectionContent({...this.props});
        return (
            <>
                <Header />
                <CrashReportingAlert language={language}/>
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
