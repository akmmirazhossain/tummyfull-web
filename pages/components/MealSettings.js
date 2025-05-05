import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Image,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { ApiContext } from "../contexts/ApiContext";
import { useUser } from "../contexts/UserContext"; // Adjust the path

const MealSettings = () => {
  const [isOn, setIsOn] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDeactivation, setPendingDeactivation] = useState(false);

  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiConfig = useContext(ApiContext);
  const { refreshUser } = useUser();

  const [config, setConfig] = useState(null);
  const { shakeBell, notifLoadTrigger } = useNotification();
  const [showEnforceMessage, setShowEnforceMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setConfig("");
  }, []);

  useEffect(() => {
    if (router.isReady && "mealboxEnforceLimit" in router.query) {
      setShowEnforceMessage(true);
    }
  }, [router.isReady, router.query]);

  //MARK: FETCH USER
  const fetchUserData = async () => {
    if (!apiConfig) return;
    const token = Cookies.get("TFLoginToken");
    try {
      const resUserData = await axios.get(`${apiConfig.apiBaseUrl}user-fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mealboxStatus = resUserData.data.data.mrd_user_mealbox;

      setUserData(resUserData.data.data);
      setLoading(false);
      setIsOn(mealboxStatus);
    } catch (error) {
      console.error("fetchUserData -> API Error:", error);
      setLoading(false);
    }
  };

  //MARK: FETCH SETTINGS
  const fetchSettings = async () => {
    if (!apiConfig) return;

    try {
      const resSettings = await axios.get(`${apiConfig.apiBaseUrl}setting`);

      setSettings(resSettings.data);
    } catch (error) {
      console.error("fetchSettings -> API Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && apiConfig) {
        fetchSettings();
        fetchUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [apiConfig]);

  useEffect(() => {
    fetchSettings();
    fetchUserData();
  }, [apiConfig]);

  //MARK: mealboxSw
  const handleSwitchChange = (value) => {
    if (value === true) {
      // Activating the mealbox - no confirmation needed
      mealboxSwitchChange(true);
    } else {
      // Deactivating the mealbox - show confirmation modal
      setPendingDeactivation(true);
      setShowConfirmModal(true);
    }
    setShowEnforceMessage(false);
  };

  const confirmDeactivation = () => {
    if (pendingDeactivation) {
      mealboxSwitchChange(false);
      setPendingDeactivation(false);
    }
    setShowConfirmModal(false);
  };

  const cancelDeactivation = () => {
    setPendingDeactivation(false);
    setShowConfirmModal(false);
  };

  const mealboxSwitchChange = async (value) => {
    shakeBell();
    notifLoadTrigger();

    setIsOn(value);

    if (value == true) {
      setPopOverOpen(true);
      setTimeout(() => {
        setPopOverOpen(false);
      }, 10000);
    } else {
      setPopOverOpen(false);
    }

    try {
      const response = await axios.post(
        `${apiConfig.apiBaseUrl}mealbox-switch`,
        {
          switchValue: value,
          TFLoginToken: Cookies.get("TFLoginToken"),
        }
      );
      console.log("Mealbox:", response.data);
    } catch (error) {
      console.error("mealboxSwitchChange -> API Error:", error);
    }
    fetchUserData();
    refreshUser();
  };

  return (
    <>
      <div className="h1_akm">Meal Settings</div>
      <div className="card_akm p-8">
        <div>
          {" "}
          {showEnforceMessage && (
            <div role="alert" className="alert alert-warning mb_akm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                {" "}
                Please activate mealbox swap to continue placing orders.
              </span>
            </div>
          )}{" "}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
            <span className="h2_akm">Activate mealbox swap</span>
            <span className="ml-2 text-xl">
              (৳{settings && <>{settings.mealbox_price})</>}
            </span>
          </div>
          <div className=" flex items-center gap-2">
            <Popover
              color="foreground"
              isOpen={popOverOpen}
              offset={26}
              crossOffset={22}
            >
              <PopoverTrigger>
                <Switch
                  //MARK: MEALBOX SW
                  isSelected={isOn}
                  size="lg"
                  color="success"
                  onValueChange={handleSwitchChange}
                ></Switch>
              </PopoverTrigger>
              <PopoverContent className="w-64 ">
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Mealbox activated!</div>
                  <div className="text-tiny">
                    Your upcoming meals will be delivered in a mealbox.
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap_akm">
          <div className="mt_akm">
            <p>
              Once activated, each meal will be delivered in a food-grade
              mealbox. Future meals will arrive in a fresh mealbox in exchange
              for the previous one.
            </p>

            <p>
              If you deactivate the mealbox at any time,{" "}
              <span className="font-bold">৳{settings?.mealbox_price}</span> will
              be refunded.
            </p>
          </div>
          <div className=" flex flex-col gap_akm">
            <div className="flex gap_akm items-center bg-[#cce8cd] h4_akm py-2 px-4  rounded_akm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
              >
                <path d="M312-240h338l19-280H292l20 280Zm-26-360h389l3-50-112-110H394L282-650l4 50Zm-76 68L80-662l56-56 64 64-2-24 162-162h240l162 162-2 24 64-64 56 56-130 130H210Zm28 372-28-372h540l-28 372H238Zm242-440Zm1 80Z" />
              </svg>
              {typeof userData?.mrd_user_has_mealbox === "number" ? (
                `You have ${userData.mrd_user_has_mealbox} mealbox${
                  userData.mrd_user_has_mealbox !== 1 ? "es" : ""
                } with you.`
              ) : (
                <Spinner size="sm" />
              )}
            </div>
            {/* 
            {userData?.mrd_user_mealbox === 1 ? (
              <div className="flex gap_akm items-center bg-[#b8e7fb] h4_akm py-2 px-4  rounded_akm">
                {" "}
                <FontAwesomeIcon icon={faMoneyBill} />
                Mealbox payment:{" "}
                {userData?.mrd_user_mealbox_paid === 1 ? "Paid" : "Unpaid"}
              </div>
            ) : null} */}
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-5 md:col-span-2">
              <Image src="/images/mealbox_exchage.webp" />
            </div>
            <div className="col-span-5 md:col-span-3">
              <p className="h3_akm pt_akm md:pt-0">Why choose a mealbox?</p>
              <ul className="list-disc p-4">
                <li>
                  A healthier alternative to single-use plastic containers.
                </li>

                <li>Simple, clean, and ready to eat.</li>
                <li>Less plastic in landfills. Better for the planet.</li>
                {/* <li>
                  A refund of ৳{settings && <>{settings.mealbox_price}</>} is
                  available if you deactivate the mealbox at any time.
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deactivation */}
      <Modal
        isOpen={showConfirmModal}
        onClose={cancelDeactivation}
        backdrop="blur"
      >
        <ModalContent className="text_black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                Deactivate Mealbox
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to deactivate your mealbox?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={cancelDeactivation}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmDeactivation}>
                  Yes, Deactivate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MealSettings;
