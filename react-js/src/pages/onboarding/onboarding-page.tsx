import React from 'react';

import { ReactComponent as Swiper } from '../../assets/swiper.svg';
import { ImageUtils } from '../../utils/image-utils';
import OnboardingModel from "./onboarding-model";
import './onboarding-styles.scss'

function isEven(n: number) {
	return n % 2 === 0;
}

const screens = [
	ImageUtils.loadImageFromAssets(`newscreen${0}.svg`),
	ImageUtils.loadImageFromAssets(`newscreen${1}.svg`),
	ImageUtils.loadImageFromAssets(`newscreen${2}.svg`),
	ImageUtils.loadImageFromAssets(`newscreen${3}.svg`)
];

const background = {
	white: ImageUtils.loadImageFromAssets('ScanbotSDKwhite.svg'),
	red: ImageUtils.loadImageFromAssets('ScanbotSDKred.svg')
};

const button = {
	next: {
		red: ImageUtils.loadImageFromAssets('nextButtonRed.png'),
		white: ImageUtils.loadImageFromAssets('nextButtonWhite.png')
	}
};

export default class OnboardingPage extends React.Component<any, any> {

	render() {
		const {id, lang, handleSlide, skip} = this.props;
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
							onClick={id === 3 ? skip : () => handleSlide()}
							src={isEven(id) ? button.next.red : button.next.white}
							alt='next button'
						/>
				</div>
			</div>
		);
	}
}
