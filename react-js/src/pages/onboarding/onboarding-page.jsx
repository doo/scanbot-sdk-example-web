import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as Swiper } from '../../assets/swiper.svg';

function isEven(n) {
	return n % 2 === 0;
}

const useStyles = makeStyles((theme) => ({
	root: (id) => ({
		backgroundColor: isEven(id) ? '#C8193C' : 'white',
		color: 'white',
	}),
	innerContainer: {
		textAlign: 'center',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '40px 16px 20px 16px',
		maxWidth: '690px',
		margin: '0 auto',
		justifyContent: 'space-between',
		[theme.breakpoints.up('sm')]: {
			padding: '80px 0',
		},
		['@media (min-height:720px) and (max-width: 640px)']: {
			padding: '80px 16px 40px 16px',
		},
	},
	logo: {
		marginBottom: '24px',
		[theme.breakpoints.up('sm')]: {
			marginBottom: '40px',
			width: '250px',
		},
	},
	illustration: {
		width: '90%',
		marginBottom: '24px',
		[theme.breakpoints.up('md')]: {
			maxWidth: '550px',
			height: '550px',
			objectFit: 'contain',
			marginTop: '32px',
			marginBottom: '-80px',
		},
		['@media (min-height:550px) and (max-width: 350px)']: {
			maxHeight: '225px',
			marginBottom: '16px',
		},
	},
	title: (id) => ({
		fontSize: '24px',
		lineHeight: '24px',
		letterSpacing: '0.18px',
		color: isEven(id) ? 'white' : '#C8193C',
		marginBottom: '14.3px',
		[theme.breakpoints.up('sm')]: {
			fontSize: '38px',
			lineHeight: '38px',
		},
	}),
	description: (id) => ({
		fontSize: '14px',
		lineHeight: '20px',
		letterSpacing: '0.25px',
		opacity: '.7',
		color: isEven(id) ? 'white' : '#6e7375',
	}),
	link: (id) => ({
		position: 'absolute',
		right: '0',
		textDecoration: 'none',
		color: isEven(id) ? 'white' : '#C8193C',
		paddingRight: '10px',
	}),
	swiperContainer: {
		height: '100%',
		position: 'absolute',
		top: '0',
		right: '0',
	},
	swiper: (id) => ({
		'&& path': {
			fill: isEven(id) ? 'white' : '#C8193C',
		},
		right: '0',
		top: '0',
		height: '100%',
	}),
	nextButton: {
		top: '55%',
		right: '15%',
		position: 'absolute',
		width: '60%',
	},
	listContainer: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
	},
	listItem: (id) => ({
		border: '0.5px solid',
		borderColor: isEven(id) ? 'white' : '#C8193C',
		borderRadius: '50%',
		backgroundColor: 'transparent',
		padding: '6px',
		verticalAlign: 'middle',
		cursor: 'pointer',
	}),
	listCurrent: (id) => ({
		backgroundColor: isEven(id) ? 'white' : '#C8193C',
		cursor: 'pointer',
	}),
	list: {
		listStyleType: 'none',
		display: 'flex',
		padding: '0',
	},
}));

const content = {
	en: {
		title: {
			0: 'Welcome to Scanbot SDK',
			1: 'Optimize your workflow',
			2: 'State-of-the-art technology',
			3: 'We protect your data',
		},
		description: {
			0: 'A tailored digitization solution for your business to improve operational efficiency, gain massive cost savings, and boost customer as well as employee satisfaction.',
			1: 'With the Scanbot Scanner SDK, your employees and customers can scan documents right from their smartphone.',
			2: 'Our intelligent solutions use latest Machine Learning algorithms and OCR Text Recognition to ensure near perfect results.',
			3: 'Our ML-based solutions offer fast and powerful, image, text, and data capture capabilities while keeping your data safely encrypted.',
		},
		buttonText: {
			0: 'Skip',
			1: 'Try now',
		},
	},
	de: {
		title: {
			0: 'Willkommen bei Scanbot SDK',
			1: 'Workflow-Optimierung ',
			2: 'Hochmoderne Technologie',
			3: 'Wir schützen Ihre Daten',
		},
		description: {
			0: 'Eine maßgeschneiderte Digitalisierungslösung für Ihr Unternehmen. Verbessern Sie die betriebliche Effizienz, während Sie massive Kosteneinsparungen erzielen und die Kunden- sowie Mitarbeiterzufriedenheit steigern.',
			1: 'Mit dem Scanbot Scanner SDK können Ihre Mitarbeiter und Kunden Dokumente direkt von ihrem Smartphone aus scannen.',
			2: 'Unsere intelligenten Lösungen nutzen die neuesten Algorithmen des Machine-Learning und der OCR-Texterkennung, um nahezu perfekte Ergebnisse zu gewährleisten.',
			3: 'Unsere ML-basierten Lösungen bieten schnelle und leistungsstarke Funktionen zur Bild-, Text- und Datenerfassung und halten Ihre Daten sicher verschlüsselt.',
		},
		buttonText: {
			0: 'Überspringen',
			1: 'Testen',
		},
	},
};

const Content = ({ id, lang, handleSlide, setSlide, skip }) => {
	const classes = useStyles(id);

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
					<h2 className={classes.title}>{content[lang].title[id]}</h2>
					<p className={classes.description}>{content[lang].description[id]}</p>
				</div>
				<div className={classes.listContainer}>
					<ul className={classes.list}>
						<li style={{ padding: '0 5px' }}>
							<button
								className={
									id === 0
										? `${classes.listCurrent} ${classes.listItem}`
										: classes.listItem
								}
								onClick={() => setSlide(0)}
							/>
						</li>
						<li style={{ padding: '0 5px' }}>
							<button
								className={
									id === 1
										? `${classes.listCurrent} ${classes.listItem}`
										: classes.listItem
								}
								onClick={() => setSlide(1)}
							/>
						</li>
						<li style={{ padding: '0 5px' }}>
							<button
								className={
									id === 2
										? `${classes.listCurrent} ${classes.listItem}`
										: classes.listItem
								}
								onClick={() => setSlide(2)}
							/>
						</li>
						<li style={{ padding: '0 5px' }}>
							<button
								className={
									id === 3
										? `${classes.listCurrent} ${classes.listItem}`
										: classes.listItem
								}
								onClick={() => setSlide(3)}
							/>
						</li>
					</ul>
					{id < 3 ? (
						<a href='#' className={classes.link} onClick={skip}>
							{content[lang].buttonText[0]}
						</a>
					) : (
						<a href='#' className={classes.link} onClick={skip}>
							{content[lang].buttonText[1]}
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
