import React from 'react';
import './main-menu-styles.scss'

import Section from './main-menu-section'
import {sectionContent} from './main-menu-model'


export default class MainMenu extends React.Component<any, any> {

    render() {
        return (
            <>
                <div className='logoContainer'>
                    <img
                        className='logo'
                        src={require('../../assets/ScanbotSDKwhite.svg')}
                        alt='Scanbot logo'
                    />
                </div>
                <div className='contentContainer'>
                    <Section {...sectionContent({...this.props}).documentScanner} />
                    <Section {...sectionContent({...this.props}).dataDetectors} />
                    <Section {...sectionContent({...this.props}).about} />
                    <Section {...sectionContent({...this.props}).legal} />
                    <div className='footer'>
                        <p dangerouslySetInnerHTML={{__html:
                                `App version 1.4.0.60<br />
                                 Scanbot SDK version 1.78.0<br />
                                 © 2020 doo GmbH. All rights reserved.`
                        }}/>
                    </div>
                </div>
            </>
        )
    }
}
