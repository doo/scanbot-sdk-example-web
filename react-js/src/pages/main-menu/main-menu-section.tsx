import React from 'react';
import './main-menu-section-styles.scss'

export default class Section extends React.Component<any, any> {

    render() {
        const {icon, title, cards, links} = this.props;
        return (
            <div className='sectionContainer'>
                <div className='titleContainer'>
                    <img src={icon} alt="icon" className='icon'/>
                    <h2 className='title'>{title}</h2>
                </div>
                {cards && <div className='cardsContainer'>
                    {cards.map((card: any, index: number) => {
                        const {image, title, description, onclick, tooltip} = card;
                        return (
                            <div key={index} className='card' onClick={onclick}>
                                <div className='imageContainer'>
                                    {tooltip > 0 && <div className='tooltip'>{tooltip}</div>}
                                    <img src={image} alt="card illustration" className='image'/>

                                </div>
                                <div className='textContainer'>
                                    <h3 className='title'>{title}</h3>
                                    <p className='description'>{description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>}
                {links && <div className='linksContainer'>
                    {links.map((link: any, index: number) => {
                        const {text, onclick} = link;
                        const clickEvent = typeof onclick === "string" ? () => {} : onclick;
                        const href = typeof onclick === 'string' ? onclick : undefined;
                        return (<a key={index} href={href} className='link' onClick={clickEvent}>{text}</a>)
                    })}
                </div>}
            </div>
        )
    }
}
