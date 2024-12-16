// pages/wallet.js
import Layout from "./layout/Layout";
import React from "react";

const Policies = () => {
  return (
    <>
      <Layout title="Policies - ডালভাত">
        <section>
          <div className="h1_akm">Our Policies</div>
          <div className="card_akm pad_akm flex flex-col gap_akm" id="return">
            <div className="h2_akm">Return Policy:</div>
            <div>
              In cases where you wish to return food, we will accept it under
              the following conditions.
              <ul className="mt_akm">
                <li>
                  {" "}
                  <span className="text_green font-bold">
                    The food was delivered stale:
                  </span>{" "}
                  You must inform us within 4 hours of the meal delivery.
                </li>
                <li>
                  {" "}
                  <span className="text_green font-bold">
                    The food quantity was inadequate:
                  </span>{" "}
                  In such cases, please take a picture and send it to our
                  WhatsApp number immediately after opening the box/container
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Policies;
