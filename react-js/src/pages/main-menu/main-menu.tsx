import React from 'react';
import './main-menu-styles.scss'

import Section from './main-menu-section'
import {sectionContent, cardContent, linkContent} from './main-menu-model'


export default class MainMenu extends React.Component<any, any> {

    render() {
        const {language, callDocument, callBarcode, viewDocuments} = this.props;
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
                    <Section {...sectionContent(language).documentScanner}
                             cards={[
                                 {...cardContent(language).scanDocuments, onclick: callDocument},
                                 {...cardContent(language).viewDocuments, onclick: viewDocuments},
                             ]}
                    />
                    <Section {...sectionContent(language).dataDetectors}
                             cards={[
                                 {...cardContent(language).barcode, onclick: callBarcode},
                             ]}
                    />
                    <Section {...sectionContent(language).about}
                             links={[
                                 {...linkContent(language).learnMore}
                             ]}
                    />
                    <Section {...sectionContent(language).legal}
                             links={[
                                 {...linkContent(language).terms},
                                 {...linkContent(language).privacy},
                                 {...linkContent(language).imprint},
                                 {...linkContent(language).acknowledgements}
                             ]}
                    />
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
