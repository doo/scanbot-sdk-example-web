import React from 'react';

import Carousel from 'nuka-carousel';

import OnboardingPage from './onboarding-page';
import OnboardingModel from './onboarding-model';
import './onboarding-styles.scss';
import { StorageService } from '../../service/storage-service';
import { RoutingService } from '../../service/routing-service';

function isEven(n: number) {
	return n % 2 === 0;
}

class SkipButton extends React.Component<any, any> {
	render() {
		const color = isEven(this.props.index) ? 'white' : '#C8193C';
		const text =
			OnboardingModel.TEXT[this.props.language].buttonText[
				this.props.index < 3 ? 0 : 1
			];
		return (
			<a
				href='/#'
				className='link'
				style={{ color: color }}
				onClick={this.props.skip}
			>
				{text}
			</a>
		);
	}
}

class ProgressDot extends React.Component<any, any> {
	render() {
		const color = isEven(this.props.index) ? 'white' : '#C8193C';
		const activeStyle = { backgroundColor: color, color: color };
		const inactiveStyle = { borderColor: color };
		const style =
			this.props.index === this.props.number ? activeStyle : inactiveStyle;
		return (
			<li style={{ padding: '0 5px' }}>
				<button
					className='listItem'
					style={style}
					onClick={() => this.props.onClick(this.props.number)}
				/>
			</li>
		);
	}
}

class Onboarding extends React.Component<any, any> {
	indices = [0, 1, 2, 3];

	constructor(props: any) {
		super(props);
		this.state = {
			slideIndex: 0,
		};
	}

	handleSlide() {
		let next = this.state.slideIndex + 1;
		if (next - 1 === this.indices[this.indices.length - 1]) {
			next = 0;
		}

		this.setState({ slideIndex: next });
	}

	setSlide(id: number) {
		this.setState({ slideIndex: id });
	}

	onOnboardingSkip() {
		StorageService.instance.setHasVisited();
		RoutingService.instance.home();
	}

	render() {
		return (
			<div className='component-carousel'>
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
					{this.indices.map((id: number) => {
						return (
							<OnboardingPage
								handleSlide={this.handleSlide.bind(this)}
								setSlide={this.setSlide.bind(this)}
								id={id}
								lang={this.props.language}
								skip={this.onOnboardingSkip.bind(this)}
							/>
						);
					})}
				</Carousel>
				<div className='listContainer'>
					<ul className='list'>
						{this.indices.map((number) => {
							return (
								<ProgressDot
									index={this.state.slideIndex}
									number={number}
									onClick={() => this.setSlide(number)}
								/>
							);
						})}
					</ul>
					<SkipButton
						index={this.state.slideIndex}
						language={this.props.language}
						skip={this.onOnboardingSkip.bind(this)}
					/>
				</div>
			</div>
		);
	}
}

export default Onboarding;
