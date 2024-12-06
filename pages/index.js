// pages/index.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import Slider from "./layout/Slider";
import MenuComp from "./components/menu";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Menu() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!Cookies.get("visited")) {
      setShowModal(true); // Show modal on first visit
    }
  }, []);

  return (
    <>
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
        <MenuComp />
      </Layout>
    </>
  );
}
