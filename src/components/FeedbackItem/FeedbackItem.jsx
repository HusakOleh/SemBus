import React from "react";
import './FeedbackItem.scss';

export const FeedbackItem = ({
  photo,
  name,
  city,
  rate,
  content
}) => {

  return (
    <div className="feedback-item">
      <img
        className="feedback-item__photo"
        src={`./assets/images/photo/${photo}.png`}
        alt={photo}
      />

      <h2
        className="feedback-item__name"
      >
        {name}
      </h2>

      <div
        className="feedback-item__city"
      >
        {city}
      </div>

      <div className={`feedback-item__rate stars--${rate}`}>
        <div className="feedback-item__rate-star"></div>
        <div className="feedback-item__rate-star"></div>
        <div className="feedback-item__rate-star"></div>
        <div className="feedback-item__rate-star"></div>
        <div className="feedback-item__rate-star"></div>
      </div>

      <p
        className="feedback-item__content"
      >
        {content}
      </p>
    </div>
  );
};
