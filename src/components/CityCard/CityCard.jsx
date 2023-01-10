import React from "react";
import './CityCard.scss';

export const CityCard = () => {

  return (
    <div className="city-card">
      <img
        className="city-card__img"
        src="./assets/images/panorama-city.png"
        alt=""
      />
      <h4 className="city-card__title">Луцьк - Латвія</h4>
      <div className="city-card__price">Від 60 &euro;</div>
      <p className="city-card__content">Щоденні виїзди о 09:00</p>
    </div>
  );
};
