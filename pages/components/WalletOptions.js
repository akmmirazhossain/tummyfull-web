import { React, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";
import Image from "next/image";
import WalletCredit from "./WalletCredit";

const CreditDisplay = () => {
  // const apiConfig = useContext(ApiContext);
  // const [userCredit, setUserCredit] = useState(null);
  const router = useRouter();
  const [showEnforceMessage, setShowEnforceMessage] = useState(false);

  useEffect(() => {
    if (router.isReady && "rechargeWallet" in router.query) {
      setShowEnforceMessage(true);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <div className="h1_akm ">Wallet</div>

      {showEnforceMessage && (
        <div role="alert" className="alert alert-warning mb_akm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 stroke-current shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            {" "}
            Your wallet balance is too low. Please recharge to continue
            ordering.{" "}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between p-8 card_akm">
        <div className="flex flex-col items-start justify-start">
          <div className="h3_akm">Current credit</div>
          <span className="h2_akm">
            <WalletCredit />
          </span>
        </div>

        {/* <Button size="lg" className="bg_green text_white">
          Request Withdrawal
        </Button> */}
      </div>

      <div className="h1_akm ">Recharge Wallet</div>
      <div className="p-8 card_akm">
        <div className="">
          We accept cash on delivery and MFS payments. To simplify regular
          payments, you can periodically recharge your wallet. If your wallet
          has a balance, the payment will be deducted from it instead of cash on
          delivery.
        </div>

        <div className=" mt_akm py_akm h2_akm">Steps to recharge wallet:</div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div>
              <Image
                className="rounded_akm shadow_akm"
                src={"/images/payment/bkash/1.png"}
                alt=""
                width={500}
                height={400}
              />
            </div>
            <div className="pad_akm">
              1) Open the bKash app and tap on{" "}
              <span className="font-semibold">Send money</span>.
            </div>
          </div>

          <div>
            <div>
              <Image
                className="rounded_akm shadow_akm"
                src={"/images/payment/bkash/2.png"}
                alt=""
                width={500}
                height={400}
              />
            </div>
            <div className="pad_akm">
              2) In the <span className="font-extrabold">To</span> field, enter
              our payment gateway number{" "}
              <span className="font-extrabold">0167 369 2997</span> and click on
              the next arrow{" "}
              <FontAwesomeIcon color="#D93568" icon={faArrowRight} />
            </div>
          </div>

          <div>
            <div>
              <Image
                className="rounded_akm shadow_akm"
                src={"/images/payment/bkash/3.png"}
                alt=""
                width={500}
                height={400}
              />
            </div>
            <div className="pad_akm">
              3) Enter your desired amount (above ৳300) and click on the next
              arrow <FontAwesomeIcon color="#D93568" icon={faArrowRight} />.
              <br />
              <span className="h4info_akm">
                {" "}
                ৳1000 = 5 to 8 meals (Shipping charge inclusive)
              </span>
            </div>
          </div>

          <div>
            <div>
              <Image
                className="rounded_akm shadow_akm"
                src={"/images/payment/bkash/4.png"}
                alt=""
                width={500}
                height={400}
              />
            </div>
            <div className="pad_akm">
              4) Enter the phone number linked to your account in the
              <span className="font-extrabold"> Reference</span> field and click
              the next arrow{" "}
              <FontAwesomeIcon color="#D93568" icon={faArrowRight} />
            </div>
          </div>

          <div>
            <div>
              <Image
                className="rounded_akm shadow_akm"
                src={"/images/payment/bkash/5.png"}
                width={500}
                alt=""
                height={400}
              />
            </div>
            <div className="pad_akm">
              5){" "}
              <span className="font-extrabold">
                {" "}
                Tap and hold to Send Money
              </span>{" "}
              until the payment is successful.{" "}
            </div>
          </div>
        </div>
        <p className="font-semibold h3_akm">
          Note: We will recharge your wallet within one hour of receiving the
          money.
        </p>
      </div>
    </>
  );
};

export default CreditDisplay;
