import React from "react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext";

const MealboxNavTop = () => {
  // const extraMealboxes = Math.max(mealsOrdered - assignedMealboxes, 0);

  const { user, loading, error, refreshUser } = useUser();

  const [unseenCount, setUnseenCount] = useState(0);
  const hasMealbox = user?.data?.mrd_user_has_mealbox;

  useEffect(() => {
    const lastSeenCount = parseInt(
      Cookies.get("mealbox_seen_count") || "0",
      10
    );
    if (hasMealbox && hasMealbox !== lastSeenCount) {
      setUnseenCount(hasMealbox);
    }
  }, [hasMealbox]);

  const handleMealboxClick = () => {
    Cookies.set("mealbox_seen_count", hasMealbox?.toString() || "0", {
      expires: 7, // optional
    });
    setUnseenCount(0);
  };

  return (
    <Popover offset={10} placement="bottom">
      <PopoverTrigger>
        <Button
          radius="full"
          isIconOnly
          variant="light"
          onClick={handleMealboxClick}
          size="lg"
          className="relative"
        >
          <Badge
            badgeContent={hasMealbox}
            invisible={unseenCount === 0}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#004225",
                color: "#f4f4f4",
              },
            }}
          >
            <FontAwesomeIcon
              className={`text_black font-awesome-icon cursor-pointer  text-lg `}
              icon={faBox}
              size="2x"
            />
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="px-1 py-2 text_black">
          You have {hasMealbox} mealbox{hasMealbox === 1 ? "" : "es"} with you.
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MealboxNavTop;
