import React from "react";
import './ScrollBlock.scss';

export const ScrollBlock = () => {

  return (
    <div className="scrollblock">
      <div className="scrollblock__scrollmap">
        ТУТ МАЄ БУТИ СЛАЙДЕР
      </div>


      <div className="scrollblock__content">
        <h1  className="scrollblock__content-title">
          Завозимо прямо за адресою!
        </h1>
        <p  className="scrollblock__content-text">
          Як це відбувається? Нашим комфортабельним великим автобусом
          із двома досвідченими водіями, ви з комфортом прибвуаєте до
          м.Таллінн прямим рейсом, де на Вас вже будуть чекати наші
          мікроавтобуси Mercedes-Benz Sprinter на 8 місць, які
          відвезуть вас, та ваші валізи в будь який куточок цього
          міста! Такі рейси працюють у багатьох містах країн Балтії,
          тож замовляйте квиток та подорожуйте з комфортом!
        </p>
      </div>



    </div>
  );
};
