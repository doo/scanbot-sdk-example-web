import React from 'react';

import { ReactComponent as Swiper } from '../../assets/swiper.svg';
import OnboardingModel from "./onboarding-model";

function isEven(n) {
	return n % 2 === 0;
}

const Content = ({ id, lang, handleSlide, setSlide, skip }) => {
	const classes = OnboardingModel.STYLE(id);

	return (
		<div className={classes.root}>
			<div className={classes.innerContainer}>
				<div>
					<img
						className={classes.logo}
						src={
							isEven(id)
								? require('../../assets/ScanbotSDKwhite.svg')
								: require('../../assets/ScanbotSDKred.svg')
						}
						alt='Scanbot logo'
					/>
					<img
						className={classes.illustration}
						src={require(`../../assets/newscreen${id}.svg`)}
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
						src={require('../../assets/nextButtonRed.png')}
						alt='next button'
					/>
				) : (
					<img
						className={classes.nextButton}
						onClick={() => handleSlide()}
						src={require('../../assets/nextButtonWhite.png')}
						alt='next button'
					/>
				)}
			</div>
		</div>
	);
};

export default Content;
