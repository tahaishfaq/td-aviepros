import React from "react";
import downloadApp from "../../assets/download-app.png";
import { Apple, Play } from "lucide-react";
import apple from "../../assets/landingicons/Apple.png";
import google from "../../assets/landingicons/Playstore.png";

const DownloadApp = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-0 px-4">
      <div className="flex items-center justify-center flex-col sm:gap-y-10 gap-y-4">
        <div className="max-w-[997px]">
          <img src={downloadApp} alt="downlaod-app" className="w-full h-full" />
        </div>
        <div className="text-center sm:space-y-4 space-y-2.5">
          <h1 className="sm:text-4xl text-2xl font-medium">
            Download the Mobile App
          </h1>
          <div className="flex items-center justify-center gap-2.5">
            {/* Google Play Button */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-900 transition"
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
              className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-900 transition"
            >
              <img
                src={apple}
                alt="App Store"
                className="w-6 h-6 object-contain"
              />
              <div className="text-left text-sm leading-tight">
                <div className="text-xs">Download on the</div>
                <div className="text-base font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
