
import React from 'react'

import Content from './onboarding-page'
import Carousel from 'nuka-carousel'

class Onboarding extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            slideIndex: 0,
            language: this.languageOrDefault()
        }
    }

    languageOrDefault(): string {
        const split = window.location.href.split("?lang=");
        if (split.length > 1) {
            return split[1];
        }
        return "en";
    }
    handleSlide() {
        this.setState({slideIndex: this.state.slideIndex + 1})
    };

    setSlide(id: number) {
        this.setState({slideIndex: id})
    };

    render() {
        return (
            <Carousel
                slideIndex={this.state.slideIndex}
                afterSlide={(slideIndex) => this.setSlide(slideIndex)}
                enableKeyboardControls={false}
            >
                <Content handleSlide={this.handleSlide.bind(this)} setSlide={this.setSlide.bind(this)} id={0} lang={this.state.language}/>
                <Content handleSlide={this.handleSlide.bind(this)} setSlide={this.setSlide.bind(this)} id={1} lang={this.state.language}/>
                <Content handleSlide={this.handleSlide.bind(this)} setSlide={this.setSlide.bind(this)} id={2} lang={this.state.language}/>
                <Content handleSlide={this.handleSlide.bind(this)} setSlide={this.setSlide.bind(this)} id={3} lang={this.state.language}/>
            </Carousel>
        );
    }
}

export default Onboarding
