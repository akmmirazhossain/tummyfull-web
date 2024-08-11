import Image from "next/image";
import Link from "next/link";

const items = [
  {
    src: "/images/delivery.png",
    alt: "Free Delivery",
    className: "",
    link: null, // No link for this item
    hiddenOnMd: false,
  },
  {
    src: "/images/calendar.png",
    alt: "Hot Homecooked",
    className: "relative",
    link: null,
    hiddenOnMd: false,
  },
  {
    src: "/images/chef.png",
    alt: "Hot Homecooked",
    className: "relative hidden md:block",
    link: null,
    hiddenOnMd: true,
  },
  {
    src: "/images/wallet.png",
    alt: "Hot Homecooked",
    className: "hidden md:block",
    link: "/wallet",
    hiddenOnMd: true,
  },
];

export default function Slider() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap_akm pt_akm">
      {items.map((item, index) =>
        item.link ? (
          <Link key={index} href={item.link} className={item.className}>
            <div className="relative">
              <div className="bg-gradient-to-r from-rose-100 to-teal-100 rounded_akm shadow_akm h-auto flex items-center justify-center overflow-hidden">
                <Image
                  src={item.src}
                  height={400}
                  width={800}
                  alt={item.alt}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </Link>
        ) : (
          <div key={index} className={item.className}>
            <div className="bg-gradient-to-r from-rose-100 to-teal-100 rounded_akm shadow_akm h-auto flex items-center justify-center overflow-hidden">
              <Image
                src={item.src}
                height={400}
                width={800}
                alt={item.alt}
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
