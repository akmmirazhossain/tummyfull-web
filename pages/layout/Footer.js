// components/HelloComponent.js
import Image from "next/image";
import Link from "next/link";

const FooterMain = () => {
  const navSections = [
    {
      title: "APP",
      links: [
        { href: "./", label: "Menu" },
        { href: "/settings", label: "Settings" },
        { href: "/wallet", label: "Wallet" },
      ],
    },
    {
      title: "PAGES",
      links: [
        { href: "/partner", label: "Be our Partner" },
        { href: "/info", label: "Contact" },
        { href: "/info#features", label: "Our Uniqueness" },
      ],
    },
    {
      title: "LINKS",
      links: [
        {
          href: "https://www.facebook.com/dalbhath",
          label: "Facebook",
          target: "_blank",
        },
        { href: "/policies#return", label: "Return Policy" },
        { href: "/policies", label: "Other Policies" },
      ],
    },
  ];
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

              <p className="mt-2 text-sm text-gray-500 max-w-80">
                DalBhath is an easy meal management app for students, job
                holders, and families seeking convenient daily meal options.
              </p>
            </div>
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="col-span-1">
                <h2 className="title-font tracking-widest mb-3">
                  {section.title}
                </h2>
                <nav className="list-none">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="py-0.5">
                      <Link href={link.href} target={link.target || "_self"}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterMain;
