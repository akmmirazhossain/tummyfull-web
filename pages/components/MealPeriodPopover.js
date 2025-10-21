import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Switch,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function MealPeriodPopover({ mealDay, mealType, LoginToken }) {
  const toggleAutoOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auto-order-toggle`,
        { status: true }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error toggling auto order:", error);
    }
  };

  return (
    <Popover offset={10} placement="bottom" className="text-black">
      <PopoverTrigger>
        <Button isIconOnly variant="light" radius="full">
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pad_akm">
        <div className="flex items-center justify-center gap_akm">
          <span>
            Auto-order upcoming {mealDay}'s {mealType}
          </span>
          <Switch
            aria-label="Automatic updates"
            color="success"
            onClick={toggleAutoOrder}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
