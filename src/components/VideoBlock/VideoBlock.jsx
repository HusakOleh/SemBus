import React from "react";
import './VideoBlock.scss';

import { CustomButton } from "../CustomButton/CustomButton";

export const VideoBlock = () => {

  return (
    <div className="videoblock">
      <div className="videoblock__content">
        <h2 className="videoblock__title">
          Щоденні прямі рейси з Литви, Латвії
          та Естонії без поседерників та
          предоплат за квиток
        </h2>

        <p className="videoblock__text">
          здійснює щоденні поїздки до Литви,
          Латвії, Естонії.
          <br/>
          Ми відповідаємо за комфорт, сервіс та
          безпеку наших пасажирів.
        </p>

        <div className="videoblock__button">
          <CustomButton
            content="Замовити"
            onClick={() => alert("ADD FUNCTION")}
          />
        </div>
      </div>

      <div className="videoblock__player"></div>
    </div>
  )
};
