
import React from 'react';

import Carousel from 'nuka-carousel';

import OnboardingPage from './onboarding-page';
import OnboardingModel from "./onboarding-model";
import './onboarding-styles.scss'

class Onboarding extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			slideIndex: 0,
			language: this.languageOrDefault(),
		};
	}

	languageOrDefault(): string {
		const split = window.location.href.split('?lang=');
		if (split.length > 1) {
			return split[1];
		}
		return 'en';
	}

	handleSlide() {
		this.setState({slideIndex: this.state.slideIndex + 1});
	}

	setSlide(id: number) {
		this.setState({slideIndex: id});
	}

	isEven(n: number) {
		return n % 2 === 0;
	}

	render() {
		return (
			<div className='carouselContainer'>
				<Carousel
					slideIndex={this.state.slideIndex}
					afterSlide={(slideIndex) => this.setSlide(slideIndex)}
					beforeSlide={(before: number, after: number) => {
						this.setSlide(after);
					}}
					enableKeyboardControls={false}
					withoutControls={true}
					disableAnimation={true}
					disableEdgeSwiping={true}
				>
					{[0, 1, 2, 3].map((id: number) => {
						return <OnboardingPage
							handleSlide={this.handleSlide.bind(this)}
							setSlide={this.setSlide.bind(this)}
							id={id}
							lang={this.state.language}
							skip={this.props.skip}
						/>
					})}
				</Carousel>
				<div className='listContainer'>
					<ul className='list'>
						{[0, 1, 2, 3].map(number => {
							return (
								<li style={{padding: '0 5px'}}>
									<button
										className='listItem'
										style={
											this.state.slideIndex === number
												? {
													backgroundColor: this.isEven(this.state.slideIndex) ? 'white' : '#C8193C',
													color: this.isEven(this.state.slideIndex) ? 'white' : '#C8193C'
												}
												: {borderColor: this.isEven(this.state.slideIndex) ? 'white' : '#C8193C',}
										}
										onClick={() => this.setSlide(number)}
									/>
								</li>
							);
						})}
					</ul>
					{this.state.slideIndex < 3 ? (
						<a href='#' className='link'
						   style={{color: this.isEven(this.state.slideIndex) ? 'white' : '#C8193C'}}
						   onClick={this.props.skip}>
							{OnboardingModel.TEXT[this.state.language].buttonText[0]}
						</a>
					) : (
						<a href='#' className='link'
						   style={{color: this.isEven(this.state.slideIndex) ? 'white' : '#C8193C'}}
						   onClick={this.props.skip}>
							{OnboardingModel.TEXT[this.state.language].buttonText[1]}
						</a>
					)}
				</div>
			</div>
		);
	}
}

export default Onboarding
