import React from 'react';
import SlideImage from "../../assets/images/logo.jpg";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";


function LoginSlider() {
    var settings = {
        dots: true,
        infinite: false,
        nav: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div className="border signin-slider">
            <Slider {...settings}>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
                <div>
                    <img src={SlideImage} alt="Slider image" />
                </div>
            </Slider>
        </div>
    )
}

export default LoginSlider
