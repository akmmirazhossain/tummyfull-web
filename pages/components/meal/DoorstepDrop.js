import { useState } from "react";
import { useGlobalModal } from "../ui/Modal";

export default function DoorstepDrop() {
  const { openModal } = useGlobalModal();
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleToggle = () => {
    openModal({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => setIsSwitchOn(true),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div className="h2_akm">Doorstep Drop</div>
        </div>
        <div className="flex items-center gap-2 ">
          <Switch
            //MARK: DoorDrop SW

            isSelected={isSwitchOn}
            onChange={handleToggle}
            size="lg"
            color="success"
          ></Switch>
        </div>
      </div>
      <div className="my_akm">
        Doorstep Drop is a quick and convenient delivery option where your meal
        is placed right at your doorstep.{" "}
      </div>
      <div>
        <div className="col-span-5 md:col-span-3">
          <p className="h3_akm pt_akm md:pt-0">Benefits:</p>
          <ul className="p-4 list-disc">
            <li>Meals are dropped at your door without direct contact</li>
            <li>No need to wait or coordinate with the delivery person.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
