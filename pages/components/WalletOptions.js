import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";
import { Skeleton, Button } from "@nextui-org/react";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CreditDisplay = () => {
  const apiConfig = useContext(ApiContext);
  const [userCredit, setUserCredit] = useState(null);

  useEffect(() => {
    const fetchUserCredit = async () => {
      if (!apiConfig) return;
      const token = Cookies.get("TFLoginToken");

      if (token) {
        const response = await fetch(`${apiConfig.apiBaseUrl}user-fetch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserCredit(data.data.mrd_user_credit);
        }
      }
    };

    fetchUserCredit();
  }, [apiConfig]);

  if (userCredit === null)
    return (
      <>
        <div className="h1_akm ">Wallet</div>
        <div className="card_akm   p-8 ">
          <Skeleton className="rounded-lg h-12" />
        </div>
      </>
    );

  return (
    <>
      <div className="h1_akm ">Wallet</div>
      <div className="card_akm   p-8">
        <div className="h3_akm "> Current credit</div>
        <div className="flex items-center justify-between">
          <div>
            ৳<span className="h2_akm">{userCredit}</span>
          </div>
          {/* <div>
            {" "}
            <Button color="primary">Withdraw</Button>
          </div> */}
        </div>
      </div>

      <div className="h1_akm ">Recharge Wallet</div>
      <div className="card_akm  p-8">
        <div className="">
          We accept cash on delivery and MFS payments. To simplify regular
          payments, you can periodically recharge your wallet. If your wallet
          has a balance, the payment will be deducted from it instead of cash on
          delivery.
        </div>

        <div className=" mt_akm py_akm h2_akm">Steps to recharge wallet:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <p className="h3_akm font-semibold">
          Note: We will recharge your wallet within one hour of receiving the
          money.
        </p>
      </div>
    </>
  );
};

export default CreditDisplay;
