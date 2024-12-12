// pages/credits.js
import Image from "next/image";
import Layout from "./layout/Layout";

export default function Credits() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center py-10 px-5 text-base-content">
        <div className="bg-base-100 shadow-xl rounded-lg p-8 w-full max-w-3xl">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src="/images/PassportSizePhoto.jpg" // Replace with your actual profile picture path
                  alt="Miraz's Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-4">AKM Miraz Hossain</h1>
            <p className="text-gray-600 text-center mt-2">
              Developer, Designer, and Product Manager of the Dalbhath App.
            </p>
          </div>

          {/* About the App */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              About the App
            </h2>
            <p className="leading-relaxed">
              Our meal management app is designed to provide delicious,
              home-style meals to individuals and families facing meal
              challenges. From bachelor students to office staff and families,
              our app simplifies meal planning and ensures fresh, affordable
              meals delivered right to your door.
            </p>
          </section>

          {/* Roles Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              Roles and Contributions
            </h2>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Frontend Developer:</strong> React/Next.js, Tailwind
                CSS, NextUI, Material UI
              </li>
              <li>
                <strong>Backend Developer:</strong> PHP, Laravel, MySQL
              </li>
              <li>
                <strong>UI/UX Designer:</strong> Figma, Photoshop
              </li>

              <li>
                <strong>Product Manager:</strong> Defining the vision and
                strategy for the app
              </li>
              <li>
                <strong>Project Manager:</strong> Ensuring smooth execution and
                timely delivery
              </li>
            </ul>
          </section>

          {/* Closing Note */}
          <section>
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              Special Thanks
            </h2>
            <p>
              Thank you for visiting and supporting this project. It has been a
              journey of passion and dedication, and I hope this app makes a
              meaningful impact on your life.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
