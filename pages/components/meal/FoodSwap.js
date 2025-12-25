// pages/components/meal/FoodSwap.js

"use client";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "../ui/Snackbar";
import { createLogger } from "../../../lib/logger";

export default function FoodSwap({
  loginToken,
  date,
  day,
  mealPeriod,
  menuData,
  orderIsEnabled,
  onSwapUpdate,
  notifLoadTrigger,
}) {
  const logger = createLogger("FoodSwap");

  if (!menuData?.[day]?.[mealPeriod]?.foodItems) return null;
  // logger.api("menuData", menuData.mon.lunch.foodItems.curry);

  useEffect(() => {
    setFoodIndexes({});
  }, [menuData, day, mealPeriod]);

  const [foodIndexes, setFoodIndexes] = useState({});
  const { showSnackbar } = useSnackbar();

  return (
    <>
      {Object.entries(menuData[day][mealPeriod].foodItems).map(
        ([category, items]) => {
          const menuSerialSorting = [...items].sort(
            (a, b) => a.menu_serial - b.menu_serial
          );

          const currentIndex = foodIndexes[category] || 0;
          const currentFood = menuSerialSorting[currentIndex];

          //MARK: ON IMG CLICK
          const handleImageClick = () => {
            // calculate new index for this category
            const newIndex = (currentIndex + 1) % menuSerialSorting.length;
            // prepare the updated foodIndexes object
            const updatedFoodIndexes = {
              ...foodIndexes,
              [category]: newIndex,
            };

            // update state once
            setFoodIndexes(updatedFoodIndexes);
            // console.log("items ->", items);

            const swappedFoods = Object.entries(
              menuData[day][mealPeriod].foodItems
            ).map(([cat, items]) => {
              const sorted = [...items].sort(
                (a, b) => a.menu_serial - b.menu_serial
              );
              const index = updatedFoodIndexes[cat] || 0;
              const selected = sorted[index];

              return {
                menuSerial: selected.menuSerial,
                foodId: selected.foodId,
                foodName: selected.foodName,
                foodImage: selected.foodImage,
                foodPrice: parseFloat(selected.foodPrice),
                categoryName: selected.categoryName,
              };
            });

            const swappedFoodIds = Object.entries(
              menuData[day][mealPeriod].foodItems
            ).map(([cat, items]) => {
              const sorted = [...items].sort(
                (a, b) => a.menu_serial - b.menu_serial
              );
              const index = updatedFoodIndexes[cat] || 0;
              return sorted[index].foodId;
            });

            //MARK: DATA FOR PARENT
            const fullFoodList = Object.entries(
              menuData[day][mealPeriod].foodItems
            ).map(([cat, items]) => {
              const sorted = [...items].sort(
                (a, b) => a.menu_serial - b.menu_serial
              );
              const index = updatedFoodIndexes[cat] || 0;

              // rotate array based on selected index
              const rotated = [
                ...sorted.slice(index),
                ...sorted.slice(0, index),
              ];

              return {
                category: cat,
                foodItems: rotated.map((f) => ({
                  menuSerial: f.menuSerial,
                  foodId: f.foodId,
                  foodName: f.foodName,
                  foodImage: f.foodImage,
                  foodPrice: parseFloat(f.foodPrice),
                  categoryName: f.categoryName,
                })),
              };
            });
            if (onSwapUpdate)
              onSwapUpdate({
                date,
                day,
                mealPeriod,
                swappedFoods,
                fullFoodList,
              });
            //END

            if (loginToken && orderIsEnabled) {
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-food-swap`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: loginToken,
                },
                body: JSON.stringify({
                  date,
                  day,
                  mealPeriod,
                  swappedFoodIds, // send all currently visible/swapped food IDs
                }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  showSnackbar(
                    data.message || "Something went wrong",
                    data.type || "error"
                  );
                  notifLoadTrigger();
                })
                .catch((err) => {
                  showSnackbar(
                    "There was an error, please try again or contact support.",
                    "error"
                  );
                  console.error(err);
                });
            }
          };

          return (
            <div key={category} style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  textTransform: "capitalize",
                  marginBottom: "0.5rem",
                }}
              >
                {category}
              </h3>

              {currentFood && (
                <div
                  key={currentFood.foodId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.3rem",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      onClick={handleImageClick}
                      src={`/images/food/${currentFood.foodImage}`}
                      alt={currentFood.foodName}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    />

                    {/* Count badge */}
                    {items.length > 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "black",
                          color: "white",
                          fontSize: "10px",
                          padding: "2px 5px",
                          borderRadius: "10px",
                        }}
                      >
                        {items.length}
                      </div>
                    )}
                  </div>

                  <div style={{ marginLeft: "0.5rem" }}>
                    <div>{currentFood.foodName}</div>
                    <small>৳{currentFood.foodPrice}</small>
                  </div>
                </div>
              )}
            </div>
          );
        }
      )}
    </>
  );
}
