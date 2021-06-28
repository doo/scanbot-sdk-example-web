import React from 'react';
import './main-menu-styles.scss'

import Section from './main-menu-section'
import {sectionContent} from './main-menu-model'

import Header from "./header";
import Footer from "./footer";

export default class MainMenu extends React.Component<any, any> {

    render() {
        const {language, version} = this.props;
        const content = sectionContent({...this.props});
        return (
            <div className ='component-mainMenu'>
                <Header />
                <div className='contentContainer'>
                    <Section {...content.documentScanner} />
                    <Section {...content.dataDetectors} />
                    <Section {...content.about} />
                    <Section {...content.legal} />
                    <Footer language={language} version={version} />
                </div>
            </div>
        )
    }
}
