// pages/index.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import Slider from "./layout/Slider";
import MenuComp from "./components/menuComp";
import Announcement from "./components/Announcement";
import Link from "next/link";
import Head from "next/head";
import Cookies from "js-cookie";
import { useSettings } from "./contexts/SettingContext";

export default function Menu() {
  const [showModal, setShowModal] = useState(false);
  const { settings, loadingSettings } = useSettings();

  useEffect(() => {
    if (!Cookies.get("visited")) {
      //setShowModal(true);
    }
  }, []);

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  useEffect(() => {
    if (!Cookies.get("hideAnnouncement") && settings?.announcement) {
      setShowAnnouncement(true);
    }
  }, [settings?.announcement]);

  const handleCloseAnnouncement = () => {
    Cookies.set("hideAnnouncement", "true", { expires: 7 });
    setShowAnnouncement(false);
  };

  return (
    <>
      <Head>
        <title>Weekly Menu - Customize Your Meals | Dalbhath.com</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="description"
          content="Browse this week's menu and customize your meals to fit your taste."
        />
        <meta
          property="og:description"
          content="Browse this week's menu and customize your meals to fit your taste."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/menu" />
        <meta
          property="og:title"
          content="Weekly Menu - Customize Your Meals | dalbhath.com"
        />

        <meta
          property="og:image"
          content="https://dalbhath.com/images/premium_quality.png"
        />
      </Head>

      <Layout>
        {showModal && (
          <div
            className="modal modal-open "
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-box bg_beige"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg">
                {" "}
                ডালভাত ডটকমে আপনাকে স্বাগতম!
              </h3>
              <div className="py-4">
                আমরা একটি ওয়েব অ্যাপ ভিত্তিক ক্যাটারিং সার্ভিস, আমরা বসুন্ধরা
                আবাসিক এলাকায় লাঞ্চ/ডিনার সরবরাহ করি।
              </div>
              <div>যেভাবে অর্ডার করবেন:</div>
              <div>
                <ul className="steps steps-vertical ">
                  <li className="step step-primary ">
                    <div className="text-left">
                      লগইন করে ডেলিভারির ঠিকানা দিন
                    </div>

                    {/* <div className="flex items-center gap_akm">
                      {" "}
                      লগইন করুন
                      <button className="btn btn-xs bg_green text-white font-normal rounded_akm hover:bg_orange hover:text-inherit">
                        Login
                      </button>
                    </div> */}
                  </li>
                  <li className="step step-primary ">
                    <div className="text-left">
                      সাপ্তাহের প্রতিদিনই আমাদের মেনু রয়েছে, দিন এবং তারিখ
                      অনুযায়ী অর্ডার করুন
                    </div>
                  </li>
                  <li className="step step-primary ">
                    <div className="text-left">
                      অর্ডারের দিন ও ডেলিভারির সময় অনুযায়ী আপনার খাবার পৌঁছে
                      দেওয়া হবে
                    </div>
                  </li>
                </ul>
              </div>
              {/* <p className="mt_akm">
                {" "}
                আমরা আপনাকে প্রতিদিন লাঞ্চ/ডিনার দিতে প্রস্তুত।
              </p> */}
              <div className="modal-action flex justify-center">
                <button
                  className="btn bg_green text-white font-normal rounded_akm hover:bg_orange hover:text-inherit"
                  onClick={() => {
                    Cookies.set("visited", "true", { expires: 30 });
                    setShowModal(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M177-560q14-36 4.5-64T149-680q-33-40-43.5-75.5T102-840h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78Zm160 0q14-36 5-64t-32-56q-33-40-44-75.5t-4-84.5h78q-8 38-2.5 62t28.5 52q38 46 48.5 81.5t.5 84.5h-78ZM200-160q-50 0-85-35t-35-85v-200h561q5-34 27-59.5t54-36.5l185-62 25 76-185 62q-12 4-19.5 14.5T720-462v182q0 50-35 85t-85 35H200Zm0-80h400q17 0 28.5-11.5T640-280v-120H160v120q0 17 11.5 28.5T200-240Zm200-80Z" />
                  </svg>
                  Continue to the Menu!
                </button>
              </div>
            </div>
          </div>
        )}
        <Slider />
        {showAnnouncement && (
          <div className="alert bg_green text_white shadow-lg border-none mt-4 relative flex items-center gap-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm sm:text-base">
              {settings.announcement}
            </span>
            <button
              className="ml-auto text-lg leading-none"
              onClick={handleCloseAnnouncement}
            >
              ✕
            </button>
          </div>
        )}

        <MenuComp />
      </Layout>
    </>
  );
}
