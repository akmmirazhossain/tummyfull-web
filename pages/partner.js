// pages/wallet.js
import React from "react";
import Layout from "./layout/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

const Info = () => {
  return (
    <>
      <Layout>
        <section id="features">
          <div className="flex flex-col items-center justify-center gap_akm pad_akm card_akm mt_akm">
            <p className="h3_akm">
              ঘরে বসে শুধু কয়েক ঘন্টা রান্না করে মাসে ১০ হাজারেরও বেশি টাকা আয়
              করতে চান?
            </p>
            <p className="h2_akm">
              তাহলে এখনই আমাদের রাঁধুনি পার্টনার হয়ে যান!
            </p>
            <Link
              target="_blank"
              href={
                "https://docs.google.com/forms/d/e/1FAIpQLSdHomQ9gdHpBpiWW8eFxRsGsw8iof-_ad--r3aqoiacs49axw/viewform?vc=0&c=0&w=1&flr=0"
              }
            >
              <Button color="success" size="lg" className="text-white">
                Register here
              </Button>
            </Link>
          </div>
          <div className="h1_akm">ডালভাত ডট কমে পার্টনার হওয়ার সুবিধা:</div>
          <div className="card_akm pad_akm flex flex-col gap_akm">
            {/* Daily meal catering facility is easier like never before, our service is carefully constructed which will let you */}

            <div className="grid grid-cols-1 md:grid-cols-5 ">
              <div className="flex justify-center items-start pad_akm md:col-span-3 flex-col">
                <span className="h3_akm font-bold px_akm pb-1">
                  মার্কেটিং কিংবা ইউজার ম্যানেজ করার ঝামেলা নেই:
                </span>
                <span className="px_akm">
                  {" "}
                  ডালভাত ডট কমে সেফ হওয়ার স্বার্থে আপনাকে কোন প্রকার ইউজার
                  ম্যানেজ অথবা মার্কেটিং করার ঝামেলা পোহাতে হবে না। আমাদের বিশেষ
                  মার্কেটিং টিম এবং সাপোর্ট টিম মেসেজ, ফোন কল, ইমেইল,
                  হোয়াটসঅ্যাপ ইত্যাদিতে রিপ্লাই করবে এবং মার্কেটিং করবে।
                </span>
              </div>

              <div className="md:col-span-2 pad_akm">
                <Image
                  src={"/images/user_manage.png"}
                  height={400}
                  width={400}
                  alt=""
                  className="object-cover h-full w-full pad_akm"
                />
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-5 ">
              <div className="flex justify-center items-start pad_akm md:col-span-3 flex-col">
                <span className="h3_akm font-bold px_akm pb-1">
                  শুধু দুই বেলা রান্না:
                </span>
                <span className="px_akm">
                  {" "}
                  অন্যান্য ফুড সার্ভিস এর মত আপনাকে হুটহাট রান্না করতে হবে না,
                  আপনার কাজ হবে প্রতিদিন আমাদের সাপ্তাহিক মেনু অনুযায়ী দুই বেলা
                  লাঞ্চ ও ডিনার রান্না করা এবং তা প্যাকেট করা।
                </span>
              </div>

              <div className="md:col-span-2 pad_akm">
                <Image
                  src={"/images/chef_cooking_female.png"}
                  height={400}
                  width={400}
                  alt=""
                  className="object-cover h-full w-full pad_akm"
                />
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-5 ">
              <div className="flex justify-center items-start pad_akm md:col-span-3 flex-col">
                <span className="h3_akm font-bold px_akm pb-1">
                  পোর্টালে মিলের সংখ্যা দেখুন এবং রান্না করুন:
                </span>
                <span className="px_akm">
                  {" "}
                  প্রতিদিন কয়টা লাঞ্চ এবং ডিনার রান্না করতে হবে এটি আমাদের
                  পোর্টালে দেখতে পারবেন, যার ফলে আপনার অতিরিক্ত কিংবা আগ্রিম
                  রান্না করার প্রয়োজন হবে না।
                </span>
              </div>

              <div className="md:col-span-2 pad_akm">
                <Image
                  src={"/images/chef_portal_lunch.png"}
                  height={400}
                  width={400}
                  alt=""
                  className="object-cover h-full w-full pad_akm"
                />
              </div>
            </div>

            <span className="border-b-2"></span>

            <div className="grid grid-cols-1 md:grid-cols-5 ">
              <div className="flex justify-center items-start pad_akm md:col-span-3 flex-col">
                <span className="h3_akm font-bold px_akm pb-1">
                  সাপ্তাহিক পেমেন্ট:
                </span>
                <span className="px_akm">
                  {" "}
                  ডাল ভাত ডট কমে আপনার রান্না সংখ্যা অনুযায়ী প্রতি সপ্তাহে
                  আপনাকে বিকাশ অথবা নগদে পেমেন্ট করা হবে।
                </span>
              </div>

              <div className="md:col-span-2 pad_akm">
                <Image
                  src={"/images/get_paid.png"}
                  height={400}
                  width={400}
                  alt=""
                  className="object-cover h-full w-full pad_akm"
                />
              </div>
            </div>
            <div className="flex items-center justify-center flex-col">
              <p className="">যে কোন প্রশ্নের জন্য কল করুন:</p>
              <p className="h3_akm"> +880 1673-692997, +880 1910-355118</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Info;
