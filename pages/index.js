// pages/index.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import Slider from "./layout/Slider";
import MenuComp from "./components/menu";
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
              <p className="py-4">
                আমরা একটি ওয়েব অ্যাপ ভিত্তিক ক্যাটারিং সার্ভিস, আমরা বসুন্ধরা
                আবাসিক এলাকায় স্টুডেন্ট/ব্যাচেলরদের স্বল্প মূল্যে স্বাস্থ্যকর ও
                সুস্বাদু খাবার সরবরাহ করি।
              </p>
              {/* কেন আমাদের সার্ভিস ব্যবহার করবেন?
              <ul className="list-disc pl_akm">
                <li>বাজার করা লাগছে না</li>
                <li>রান্নার জন্য আলাদা কাউকে লাগছে না</li>

                <li>রান্নায় গ্যাস বা বিদ্যুৎ খরচ হচ্ছে না</li>
                <li>ব্যয়বহুল কিচেন সেটআপের প্রয়োজন নেই</li>
                <li>স্বাস্থ্যসম্মত খাবার সুলভ মূল্যে পাচ্ছেন</li>
              </ul> */}
              <p className="mt_akm">
                {" "}
                আমরা আপনাকে প্রতিদিন লাঞ্চ/ডিনার দিতে প্রস্তুত।
              </p>
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
