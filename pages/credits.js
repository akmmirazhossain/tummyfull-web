// pages/credits.js
import Image from "next/image";
import Link from "next/link";
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
              Developer, Designer, and Product Manager of the Dalbhath.com.
            </p>
          </div>

          {/* About the App */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              About the App
            </h2>
            <p className="leading-relaxed">
              Dalbhath.com is a meal management platform designed to solve the
              meal challenges faced by students & bachelors living far away from
              their families. <br />
              {/* <br />
              Think about the hassle of managing groceries, hiring a maid,
              setting up a kitchen, or refilling gas cylinders just to prepare
              meals. We're here to take care of all those so that you can focus
              on your work and enjoy delicious food effortlessly. <br /> */}
              <br />
              Here is why we are different from food delivery serives like
              Foodpanda, Pathao Foods or other catering services: <br />
              Each day, we offer a fixed menu for lunch and dinner, and after
              receiving group orders for that same menu, our chefs cook in bulk.
              This approach not only ensures fresh meals but also significantly
              reduces costs, making quality food affordable.
            </p>
          </section>

          {/* Roles Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              My Roles and Contributions
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

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              App Functionalities
            </h2>

            <div class="p-4 max-w-md ">
              <ul class="space-y-2">
                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Login with OTP</span>
                </li>
                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Weekly meal pre-order system</span>
                </li>
                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Quantity changer</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Wallet recharge system</span>
                </li>
                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Auto pay from wallet on delivery</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span> Admin Panel (Entire site management)</span>
                </li>
                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span> Chef's Panel</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span> Delivery Person Panel</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>SMS reminder on delivery day</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span> Lunch box activation</span>
                </li>

                <li class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span> Lunch box collection method (by Delivery Person)</span>
                </li>
                <li class="flex items-center">
                  <span> And more...</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Closing Note */}
          <section>
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-primary pb-2">
              Special Thanks
            </h2>
            <p>
              Thank you very much for visiting my website dalbhath.com, the
              frontend source code is provided here. <br />
              <Link
                href={"https://github.com/akmmirazhossain/tummyfull-web"}
                target="_blank"
                className="link"
              >
                https://github.com/akmmirazhossain/tummyfull-web
              </Link>
            </p>

            <div className=" mt_akm font-bold pt_akm">Find me in: </div>
            <div className="grid grid-cols-3 gap_akm">
              {/* LinkedIn */}
              <div className="flex items-center space-x-2 btn">
                <svg
                  className="w-6 h-6 text-blue-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 23h5V7H0v16zm7.05 0h4.98V14c0-2.37 1.87-4 4.18-4 2.27 0 3.77 1.53 3.77 4v9h4.98V13.4C25 8.55 22.42 6 17.82 6c-3.55 0-5.18 1.5-6.06 2.55v.03H11V7H7.05v16z" />
                </svg>
                <Link
                  href={"https://www.linkedin.com/in/akmmirazh/"}
                  target="_blank"
                  className="text-blue-700 hover:underline"
                >
                  LinkedIn
                </Link>
              </div>

              {/* GitHub */}
              <div className="flex items-center space-x-2 btn">
                <svg
                  className="w-6 h-6 text-gray-800"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.296 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577v-2.169c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.23 1.838 1.23 1.07 1.833 2.809 1.305 3.495.998.111-.775.419-1.306.763-1.606-2.665-.3-5.466-1.333-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.177 0 0 1.008-.324 3.3 1.23.957-.267 1.983-.4 3.003-.404 1.02.004 2.047.137 3.005.404 2.29-1.554 3.295-1.23 3.295-1.23.656 1.654.245 2.874.12 3.177.77.84 1.236 1.911 1.236 3.221 0 4.61-2.804 5.625-5.475 5.919.429.37.811 1.101.811 2.221v3.293c0 .32.216.694.825.577C20.565 22.09 24 17.589 24 12.297 24 5.67 18.627.297 12 .297z" />
                </svg>
                <Link
                  href={"https://github.com/akmmirazhossain"}
                  target="_blank"
                  className="text-gray-800 hover:underline"
                >
                  GitHub
                </Link>
              </div>

              {/* YouTube */}
              <div className="flex items-center space-x-2 btn">
                <svg
                  className="w-6 h-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.005 3.005 0 0 0-2.116-2.116C19.502 3.5 12 3.5 12 3.5s-7.502 0-9.383.57A3.005 3.005 0 0 0 .5 6.186C0 8.068 0 12 0 12s0 3.932.5 5.814a3.005 3.005 0 0 0 2.116 2.116C4.498 20.5 12 20.5 12 20.5s7.502 0 9.383-.57a3.005 3.005 0 0 0 2.116-2.116C24 15.932 24 12 24 12s0-3.932-.502-5.814zM9.545 15.455v-6.91l6.363 3.455-6.363 3.455z" />
                </svg>
                <Link
                  href={"https://www.youtube.com/@akmmirazh"}
                  target="_blank"
                  className="text-red-600 hover:underline"
                >
                  YouTube
                </Link>
              </div>
            </div>

            <div className=" mt_akm font-bold pt_akm">Contact: </div>
            <div>Email: akmmirazhossain@gmail.com</div>
            <div>Phone: +8801673692997</div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
