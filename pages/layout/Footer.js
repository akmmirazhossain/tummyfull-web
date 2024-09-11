// components/HelloComponent.js
import Image from "next/image";
import Link from "next/link";

const FooterMain = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="max-w-5xl  w-full py-12">
          <div className="grid grid-cols-5  pad_akm">
            <div className="col-span-2">
              <Image
                className="mr-1"
                width={50}
                height={50}
                src="/logo.png"
                alt={"logo"}
              />

              <Link color="foreground" href="./">
                <p className=" font-niljannati text-2xl">ডালভাত.com</p>
              </Link>

              <p class="mt-2 text-sm text-gray-500 max-w-80">
                DalBhath is an easy meal management app for students, job
                holders, and families seeking convenient daily meal options.
              </p>
            </div>
            <div className="col-span-1">
              <h2 class="title-font  tracking-widest  mb-3">APP</h2>
              <nav class="list-none ">
                <li className="py-0.5">
                  <Link href="./">Menu</Link>
                </li>
                <li className="py-0.5">
                  <Link href="/settings">Settings</Link>
                </li>
                <li className="py-0.5">
                  <Link href="/wallet">Wallet</Link>
                </li>
              </nav>
            </div>
            <div className="col-span-1">
              <h2 class="title-font  tracking-widest  mb-3">PAGES</h2>
              <nav class="list-none">
                <li className="py-0.5">
                  <Link href="/partner">Be our Partner</Link>
                </li>
                <li className="py-0.5">
                  <Link href="/info">Contact</Link>
                </li>
                <li className="py-0.5">
                  <Link href="/info#features">Our Uniqueness</Link>
                </li>
              </nav>
            </div>
            <div className="col-span-1">
              <h2 class="title-font  tracking-widest  mb-3">LINKS</h2>
              <nav class="list-none ">
                <li className="py-0.5">
                  <Link
                    target="_blank"
                    href="https://www.facebook.com/dalbhath"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="py-0.5">
                  <Link href="/policies#return">Return Policy</Link>
                </li>
                <li className="py-0.5">
                  <Link href="/policies">Other Policies</Link>
                </li>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterMain;
