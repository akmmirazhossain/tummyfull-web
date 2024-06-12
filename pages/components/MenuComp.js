// MenuComp.js
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie"; // Importing the useCookies hook
import Image from "next/image";
import {
  Button,
  Switch,
  Card,
  Chip,
  Spinner,
  Spacer,
  Checkbox,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTruckFast } from "@fortawesome/free-solid-svg-icons";

const MenuComp = () => {
  const [cookies] = useCookies(["TFLoginToken"]); // Getting the TFLoginToken cookie
  const [menu, setMenu] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchStates, setSwitchStates] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const menuRes = await fetch(
          "http://192.168.0.216/tf-lara/public/api/menu"
        );
        const menuData = await menuRes.json();
        setMenu(menuData);

        const settingsRes = await fetch(
          "http://192.168.0.216/tf-lara/public/api/setting"
        );
        const settingsData = await settingsRes.json();
        setSettings(settingsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  //MARK: SwitchStatus
  useEffect(() => {
    async function fetchSwitchStates() {
      // Simulate fetching the initial switch states
      // For now, we'll just set a dummy value. Replace this with an actual API call.
      const initialStates = {
        // Assuming you have menu IDs to check their state
        // For example:
        menu_id_1: true,
        menu_id_2: false,
        // Add more as needed
      };
      setSwitchStates(initialStates);
    }
    fetchSwitchStates();
  }, []);

  //MARK: SwitchChange
  const handleSwitchChange = async (day, menuId, value) => {
    setSwitchStates((prev) => ({
      ...prev,
      [menuId]: value,
    }));
    // Prepare data for API call
    const data = {
      menuId,
      TFLoginToken: cookies.TFLoginToken,
      date: menu[day].date,
      makeOrder: value,
    };

    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/order-place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        <Spinner size="md" />
        <Spacer x={4} />
        Loading...
      </div>
    );
  }

  if (!menu || !settings) {
    return <p>Failed to load data</p>;
  }

  const days = Object.keys(menu);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weekly Menu</h1>
      {days.map((day) => (
        <Card key={day} shadow bordered className="mb-8 p-8">
          <div className="flex items-center mb-2">
            <h2 className="text-2xl mr-2">{`${menu[day].menu_of} `}</h2>
            <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                content: "drop-shadow shadow-black text-white",
              }}
            >{`${day.charAt(0).toUpperCase()}${day.slice(1)} , ${
              menu[day].date
            }`}</Chip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu[day].menu_active_lunch === "yes" && (
              <div className="border-b md:border-b-0 border-r-0 md:border-r">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg mb-1">Lunch</h3>
                  <span className="pr-4 text-sm">
                    <FontAwesomeIcon icon={faTruckFast} size="1x" />
                    &nbsp;
                    {settings.delivery_time_lunch}
                  </span>
                </div>
                <div className="grid grid-cols-1 pb-6 md:pb-0 md:pr-0">
                  <div className="h-80 flex justify-center items-center">
                    <div className=" gap-0">
                      {menu[day].lunch.length > 0 && (
                        <div className="flex gap-4 px-8">
                          {/* Left Column A */}
                          <div className="w-1/2 gap-4">
                            {/* Top Row with first image */}
                            {menu[day].lunch.length > 0 && (
                              <div className="flex justify-center items-center">
                                <div className="flex flex-col w-auto h-auto items-center justify-center">
                                  <Image
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: "100%", height: "auto" }}
                                    src={`http://192.168.0.216/tf-lara/public/assets/images/${menu[day].lunch[0].food_image}`}
                                    alt={menu[day].lunch[0].food_name}
                                    className="rounded-full"
                                    priority={true}
                                  />
                                  <span className="text-center mt-1">
                                    {menu[day].lunch[0].food_name}
                                  </span>
                                </div>
                              </div>
                            )}
                            {/* Bottom Row with the next two images */}
                            <div className="flex justify-around gap-4">
                              {menu[day].lunch
                                .slice(1, 3)
                                .map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col w-auto h-auto items-center justify-center"
                                  >
                                    <Image
                                      width="0"
                                      height="0"
                                      sizes="100vw"
                                      style={{ width: "100%", height: "auto" }}
                                      src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
                                      alt={item.food_name}
                                      className="rounded-full"
                                      priority={true}
                                    />
                                    <span className="text-center mt-1">
                                      {item.food_name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Right Column B */}
                          <div className="w-1/2 flex items-center justify-center">
                            {menu[day].lunch.length > 3 && (
                              <div className="flex flex-col w-auto h-auto items-center justify-center">
                                <Image
                                  width="0"
                                  height="0"
                                  sizes="100vw"
                                  style={{ width: "100%", height: "auto" }}
                                  src={`http://192.168.0.216/tf-lara/public/assets/images/${menu[day].lunch[3].food_image}`}
                                  alt={menu[day].lunch[3].food_name}
                                  className="rounded-full"
                                  priority={true}
                                />
                                <span className="text-center mt-1">
                                  {menu[day].lunch[3].food_name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center ">
                    <div className="flex items-center justify-center text-xl my-2">
                      <p className=" ">&#2547;</p>
                      <p className=" ">{menu[day].menu_price_lunch}</p>
                    </div>
                    <div className="flex items-center justify-between border rounded-full pr-2">
                      {
                        //MARK: Switch
                      }
                      <Switch
                        size="lg"
                        color="success"
                        startContent={
                          <FontAwesomeIcon icon={faCheck} size="2x" />
                        }
                        isSelected={switchStates[menu[day].menu_id_lunch]}
                        onValueChange={(value) => {
                          const TFLoginToken =
                            cookies.TFLoginToken && cookies.TFLoginToken !== "";
                          if (TFLoginToken) {
                            handleSwitchChange(
                              day,
                              menu[day].menu_id_lunch,
                              value
                            );
                          } else {
                            router.push("/login");
                          }
                        }}
                      >
                        {switchStates[menu[day].menu_id_lunch]
                          ? "Meal Enabled"
                          : "Enable Meal"}
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">Dinner</h3>
              {menu[day].menu_active_dinner === "yes" && (
                <div className="grid grid-cols-1 pb-6 md:pb-0 md:pr-0">
                  <div className="flex justify-center gap-6">
                    {menu[day].dinner.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end"
                      >
                        <Image
                          src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
                          alt={item.food_name}
                          width="0"
                          height="0"
                          sizes="100vw"
                          style={{ width: "100%", height: "auto" }}
                          className="rounded-full mr-2"
                          priority={true}
                        />
                        <span>{item.food_name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center mt-6">
                    <p className="font-semibold text-lg ">
                      Price: {menu[day].menu_price_dinner} BDT
                    </p>
                    <p className="font-semibold text-sm my-2">
                      Delivery time: {settings.delivery_time_dinner}
                    </p>
                    <Button
                      radius="full"
                      className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                      onClick={() => handleOrderClick(day, "dinner")}
                    >
                      Proceed to order
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MenuComp;
