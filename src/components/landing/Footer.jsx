import React from "react";
import clubcallin from "../../assets/club-callin.png";
import bg from "../../assets/hero.jpg";
import apple from "../../assets/landingicons/Apple.png";
import google from "../../assets/landingicons/Playstore.png";

const Footer = () => {
  return (
    <div className="max-w-7xl mx-auto sm:py-10 py-4 sm:px-0 px-2">
      <footer
        className="bg-cover bg-center text-white rounded-[16px] sm:px-0 px-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-5xl mx-auto pt-12">
          <div className="w-full lg:w-auto">
            <h2 className="text-4xl font-semibold text-[#57C113] mb-2">
              Join Today
            </h2>
            <p className="text-base font-light mb-6 max-w-md mx-auto">
              Whether you're a homeowner or a club member, the AVIE Pro app
              keeps everything organized, secure, and simple to manage—no matter
              where you are.
            </p>

            <h3 className="sm:text-4xl text-3xl font-normal sm:mb-4 mb-6">Download Mobile App</h3>
            <div className="flex sm:items-center items-start justify-start gap-2.5 flex-col sm:flex-row">
              {/* Google Play Button */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2 w-auto"
              >
                <img
                  src={google}
                  alt="Google Play"
                  className="w-6 h-6 object-contain"
                />
                <div className="text-left text-sm leading-tight">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-base font-semibold">Google Play</div>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-black rounded-lg px-4 py-2 w-auto"
              >
                <img
                  src={apple}
                  alt="App Store"
                  className="w-6 h-6 object-contain changeColor"
                />
                <div className="text-left text-sm leading-tight">
                  <div className="text-xs">Download on the</div>
                  <div className="text-base font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
          <div className="w-full lg:w-[480px] mt-6 lg:mt-0">
            <img
              src={clubcallin}
              className="w-full h-full object-contain"
              alt="clubcallin"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
