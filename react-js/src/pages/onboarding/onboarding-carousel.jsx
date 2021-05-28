import React, { useState } from 'react'

import Content from './onboarding-page'
import Carousel from 'nuka-carousel'

const Onboarding = () => {
    const [slideIndex, setSlideIndex] = useState(0);

    const handleSlide = () => {
        setSlideIndex(slideIndex + 1)
    };

    const setSlide = (id) => {
        setSlideIndex(id)
    };

    return (
        <Carousel
            slideIndex={slideIndex}
            afterSlide={(slideIndex) => setSlideIndex(slideIndex)}
            enableKeyboardControls={false}
        >
            <Content handleSlide={handleSlide} setSlide={setSlide} id={0} lang='en' />
            <Content handleSlide={handleSlide} setSlide={setSlide} id={1} lang='en' />
            <Content handleSlide={handleSlide} setSlide={setSlide} id={2} lang='en' />
            <Content handleSlide={handleSlide} setSlide={setSlide} id={3} lang='en' />
        </Carousel>
    )
};

export default Onboarding
