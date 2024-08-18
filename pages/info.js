// pages/wallet.js
import Layout from "./layout/Layout";
import Image from "next/image";
import Link from "next/link";

const Info = () => {
  return (
    <>
      <Layout>
        <section>
          <div className="h1_akm">Contact</div>
          <div className="card_akm pad_akm flex flex-col gap_akm">
            <div>
              <span className="text_green font-bold">Phone:</span> +880
              1673-692997, +880 1910-355118
            </div>
            <div>
              <span className="text_green font-bold">WhatsApp:</span> +880
              1673-692997, +880 1910-355118
            </div>
          </div>
        </section>

        <section>
          <div className="h1_akm">How to use our app:</div>
          <div className="card_akm pad_akm flex flex-col gap_akm">
            <div>1) Login using your phone number.</div>
            <div>
              2) Enter your present address
              <span className="h4info_akm"> (important).</span>
            </div>
            <div>3) Visit the menu page and place your orders.</div>
            <div>
              4) Our delivery person will deliver your food on the days you
              ordered.
            </div>
          </div>
        </section>

        <section id="features">
          <div className="h1_akm">What makes us unique:</div>
          <div className="card_akm pad_akm flex flex-col gap_akm">
            {/* Daily meal catering facility is easier like never before, our service is carefully constructed which will let you */}
            <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div>
                <Image
                  src={"/images/delivery.png"}
                  height={400}
                  width={800}
                  alt=""
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex justify-center items-center pad_akm">
                <span className="h3_akm">
                  Wherever your block is, there will be no extra delivery fee
                  for your meal inside Bashundhara R/A.
                </span>
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div className="flex justify-center items-center pad_akm">
                <span className="h3_akm">
                  Unlike traditional catering services, you can pre-schedule
                  your meals and turn them on or off as needed.{" "}
                  <Link
                    href="/"
                    target="_blank"
                    className="text-blue-600 font-bold"
                  >
                    (Check our menu)
                  </Link>
                </span>
              </div>
              <div>
                <Image
                  src={"/images/calendar.png"}
                  height={400}
                  width={800}
                  alt=""
                  className="object-cover h-full w-full"
                />
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div>
                <Image
                  src={"/images/wallet.png"}
                  height={400}
                  width={800}
                  alt=""
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex justify-center items-center pad_akm">
                <span className="h3_akm">
                  Top up your built-in wallet to enable auto-pay. If sufficient
                  credit is available, the meal charge will be deducted from it,
                  and cash on delivery will not be applied.{" "}
                  <Link
                    href="/wallet"
                    target="_blank"
                    className="text-blue-600 font-bold"
                  >
                    (Visit wallet)
                  </Link>
                </span>
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div className="flex justify-center items-center pad_akm">
                <span className="h3_akm">
                  If you plan to use our service regularly, activate the mealbox
                  swap option to have your meals delivered in food-grade boxes
                  instead of polybags.{" "}
                  <Link
                    href="/settings#mealbox"
                    target="_blank"
                    className="text-blue-600 font-bold"
                  >
                    (Activate mealbox swap)
                  </Link>
                </span>
              </div>
              <div>
                <Image
                  src={"/images/mealbox_swap.png"}
                  height={400}
                  width={800}
                  alt=""
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Info;
