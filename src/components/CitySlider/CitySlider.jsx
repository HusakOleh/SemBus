import React from "react";
import './CitySlider.scss';
import { CityCard } from "../CityCard/CityCard";

export const CitySlider = () => {

  return (
    <div className="city-slider">
      <div className="city-slider__wrap">
        <CityCard />
      </div>
    </div>
  );
};
