import React from "react";
import './Order.scss';
import { Ordering } from "../Ordering/Ordering";
import { CityCard } from "../CityCard/CityCard";

export const Order = () => {


  return (
    <div className="order">
      <h1 className="order__title">
        Придбай квиток на автобус та вирушай у подорож!
      </h1>

      <div className="order__description">
        Luna’s performance is balanced and smooth
        in all frequency ranges which makes the
        music both naturally pleasant and distinctly
        more layered.
      </div>

      <div className="order__ordering">
        <Ordering />
      </div>

      <div className="order__circle">
        <div className="order__circle-circle">

        </div>
        <div className="order__circle-core">

        </div>

        <div className="order__circle-card-bottom">
          <CityCard/>
        </div>

        <div className="order__circle-card-top">
          <CityCard/>
        </div>
      </div>

    </div>
  );
}
