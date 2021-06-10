import React from 'react';

import { ReactComponent as Swiper } from '../../assets/swiper.svg';
import OnboardingModel from "./onboarding-model";
import './onboarding-styles.scss'

function isEven(n: number) {
	return n % 2 === 0;
}

const screens = [
	require(`../../assets/newscreen${0}.svg`),
	require(`../../assets/newscreen${1}.svg`),
	require(`../../assets/newscreen${2}.svg`),
	require(`../../assets/newscreen${3}.svg`)
];

const background = {
	white: require('../../assets/ScanbotSDKwhite.svg'),
	red: require('../../assets/ScanbotSDKred.svg')
};

const button = {
	next: {
		red: require('../../assets/nextButtonRed.png'),
		white: require('../../assets/nextButtonWhite.png')
	}
};

export default class OnboardingPage extends React.Component<any, any> {

	render() {
		const {id, lang, handleSlide} = this.props;
		const headerText = isEven(id) ? background.white : background.red;

		return (
			<div className='root' style={{backgroundColor: isEven(id) ? '#C8193C' : 'white'}}>
				<div className='innerContainer'>
					<div>
						<img className='logo' src={headerText} alt='Scanbot logo'/>
						<img className='illustration' src={screens[id]} alt='Illustration'/>
					</div>
					<div>
						<h2 className='title' style={{color: isEven(id) ? 'white' : '#C8193C'}}>
							{OnboardingModel.TEXT[lang].title[id]}
						</h2>
						<p className='description'
						   style={{color: isEven(id) ? 'white' : '#6e7375',}}>
							{OnboardingModel.TEXT[lang].description[id]}
						</p>
					</div>
				</div>

				<div className='swiperContainer'>
					<Swiper className='swiper' style={{fill: isEven(id) ? 'white' : '#C8193C'}}/>
						<img
							className='nextButton'
							onClick={() => handleSlide()}
							src={isEven(id) ? button.next.red : button.next.white}
							alt='next button'
						/>
				</div>
			</div>
		);
	}
}
