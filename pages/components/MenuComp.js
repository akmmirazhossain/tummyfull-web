// MenuComp.js
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { Button, Switch, Card, Chip, Spinner, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTruckFast } from "@fortawesome/free-solid-svg-icons";

const MenuComp = () => {
  const [isLoggedInTF] = useCookies(["isLoggedInTF"]);

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

  //MARK: Switch Handle
  const handleSwitchChange = (day, menuId, value) => {
    console.log("Menu ID:", menuId);
    console.log("Value:", value);
    // setSwitchStates((prevStates) => ({
    //   ...prevStates,
    //   [menuId]: value,
    // }));
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
          <h2 className="text-xl font-semibold mb-2">
            {`${menu[day].menu_of} `}
            <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                content: "drop-shadow shadow-black text-white",
              }}
            >{`${day.charAt(0).toUpperCase()}${day.slice(1)} , ${
              menu[day].date
            }`}</Chip>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu[day].menu_active_lunch === "yes" && (
              <div className="border-b md:border-b-0 border-r-0 md:border-r">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold mb-1">Lunch</h3>
                  <span className="pr-4 text-sm">
                    <FontAwesomeIcon icon={faTruckFast} size="" />
                    &nbsp;
                    {settings.delivery_time_lunch}
                  </span>
                </div>
                <div className="grid grid-cols-1 pb-6 md:pb-0 md:pr-0">
                  <div className="flex justify-center  gap-6">
                    {menu[day].lunch.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end"
                      >
                        <Image
                          width={100}
                          height={100}
                          src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
                          alt={item.food_name}
                        />
                        <span>{item.food_name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center mt-6">
                    <div className="flex items-center justify-center">
                      <p className="font-bold text-3xl ">&#2547;</p>
                      <p className="font-semibold text-lg ">
                        {menu[day].menu_price_lunch}
                      </p>
                    </div>
                    <div className="flex  items-center justify-between border rounded-full mt-2 pr-2">
                      {/* MARK: Switch */}
                      <Switch
                        size="lg"
                        color="success"
                        startContent={
                          <FontAwesomeIcon icon={faCheck} size="2x" />
                        }
                        isSelected={
                          switchStates[menu[day].menu_id_lunch] || false
                        }
                        onValueChange={(value) => {
                          // Check if the user is logged in
                          const isLoggedIn =
                            document.cookie.includes("isLoggedInTF=true");

                          console.log("Is logged in:", isLoggedIn);
                          if (isLoggedIn) {
                            // Proceed with handling the switch change and pass 'day' as an argument
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
                  <div className="flex justify-center  gap-6">
                    {menu[day].dinner.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end"
                      >
                        <Image
                          src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
                          alt={item.food_name}
                          width={100}
                          height={100}
                          className="rounded-full mr-2"
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
