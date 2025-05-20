import React from "react";
import HeroSection from "../components/landing/HeroSection";
import HomeownerInfo from "../components/landing/HomeownerInfo";
import DownloadApp from "../components/landing/DownloadApp";
import HowItWorks from "../components/landing/HowItWorks";
import ClubInfo from "../components/landing/ClubInfo";
import Footer from "../components/landing/Footer";

export const LandingPage = () => {
  return (
    <div className="">
        <HeroSection/>
        <HomeownerInfo/>
        <DownloadApp/>
        <HowItWorks/>
        <ClubInfo/>
        <Footer/>
    </div>
  );
};
