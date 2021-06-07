import React from 'react';

import { ReactComponent as Swiper } from '../../assets/swiper.svg';
import OnboardingModel from "./onboarding-model";

function isEven(n) {
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

const Content = ({ id, lang, handleSlide, setSlide, skip }) => {
	const classes = OnboardingModel.STYLE(id);

	return (
		<div className={classes.root}>
			<div className={classes.innerContainer}>
				<div>
					<img
						className={classes.logo}
						src={isEven(id) ? background.white : background.red}
						alt='Scanbot logo'
					/>
					<img
						className={classes.illustration}
						src={screens[id]}
						alt='Illustration'
					/>
				</div>
				<div>
					<h2 className={classes.title}>{OnboardingModel.TEXT[lang].title[id]}</h2>
					<p className={classes.description}>{OnboardingModel.TEXT[lang].description[id]}</p>
				</div>
				<div className={classes.listContainer}>
					<ul className={classes.list}>
						{[0, 1, 2, 3].map(number => {
							return (
								<li style={{ padding: '0 5px' }}>
									<button
										className={
											id === number
												? `${classes.listCurrent} ${classes.listItem}`
												: classes.listItem
										}
										onClick={() => setSlide(number)}
									/>
								</li>
							);
						})}
					</ul>
					{id < 3 ? (
						<a href='#' className={classes.link} onClick={skip}>
							{OnboardingModel.TEXT[lang].buttonText[0]}
						</a>
					) : (
						<a href='#' className={classes.link} onClick={skip}>
							{OnboardingModel.TEXT[lang].buttonText[1]}
						</a>
					)}
				</div>
			</div>

			<div className={classes.swiperContainer}>
				<Swiper className={classes.swiper} />
				{isEven(id) ? (
					<img
						className={classes.nextButton}
						onClick={() => handleSlide()}
						src={button.next.red}
						alt='next button'
					/>
				) : (
					<img
						className={classes.nextButton}
						onClick={() => handleSlide()}
						src={button.next.white}
						alt='next button'
					/>
				)}
			</div>
		</div>
	);
};

export default Content;
