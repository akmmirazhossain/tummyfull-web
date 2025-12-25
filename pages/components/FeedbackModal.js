// components/FeedbackModal

import React, { useState, useContext, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";

export default function FeedbackModal({
  isOpen,
  orderId,
  dateAdded,
  message,
  onClose,
}) {
  const apiConfig = useContext(ApiContext);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const initialTags = [
    "Too spicy",
    "Too oily",
    "Bland taste",
    "Delivery delay",
    "Less salt",
    "Portion small",
    "Cold when delivered",
    "Loved it!❤️",
  ];
  const [tags, setTags] = useState(initialTags);

  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!isOpen || !orderId) return;

      setLoading(true);

      try {
        const res = await axios.post(`${apiConfig.apiBaseUrl}get-feedback`, {
          TFLoginToken: Cookies.get("TFLoginToken"),
          orderId,
        });

        setRating(res.data?.rating || 0);
        setFeedback(res.data?.feedback || "");

        // if (res.data) {
        //   if (res.data.rating) setRating(res.data.rating);
        //   if (res.data.feedback) setFeedback(res.data.feedback);
        // }
      } catch (err) {
        console.error("Error fetching existing feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [isOpen, orderId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setRatingError(true);
      return; // block submission
    } else {
      setRatingError(false);
      // proceed to submit
    }

    try {
      await axios.post(`${apiConfig.apiBaseUrl}give-feedback`, {
        TFLoginToken: Cookies.get("TFLoginToken"),
        orderId,
        rating,
        feedback,
      });

      setSuccessMsg("Thank you for your feedback!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose(); // close after delay
      }, 1500);
    } catch (error) {
      console.error("Feedback submit failed", error);
    } finally {
    }
  };

  if (!isOpen) return null;
  return (
    <div className="z-30 modal modal-open" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-2 text-lg font-bold">{message}</h3>
        <p className="">How would you rate this meal?</p>

        {/* Rating stars */}
        <div className="flex items-center justify-center min-h-40">
          {loading ? (
            <span className="loading loading-bars loading-xl text_green"></span>
          ) : (
            <div className="flex flex-col w-full">
              {ratingError && (
                <span className="mt-1 text_green h4_akm">
                  Please provide a rating.
                </span>
              )}
              <Rating
                size="large"
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 0);
                }}
                required
                max={5}
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    variant="flat"
                    className="cursor-pointer bg_green text_white"
                    onClick={() => {
                      if (!feedback.includes(tag)) {
                        setFeedback((prev) =>
                          prev.length > 0 ? `${prev}, ${tag}` : tag
                        );
                      }
                    }}
                    // onClose={() => {
                    //   setTags(tags.filter((t) => t !== tag));
                    // }}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>

              <textarea
                className="w-full mt-4 text-base textarea textarea-bordered"
                rows={3}
                placeholder="Leave a comment (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>

        <div>
          {" "}
          {successMsg && (
            <div className="mt-4 font-bold text_green">{successMsg}</div>
          )}
        </div>
        <div></div>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (orderId) {
                localStorage.setItem("skippedFeedbackOrderId", orderId);
              }
              onClose();
            }}
          >
            Cancel
          </button>

          <button className="btn btn-primary text_white" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
