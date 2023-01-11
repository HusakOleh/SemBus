import React from "react";
import "./BusPark.scss";



const listItems = [
  "Зручні сидіння з регулюванням;",
  "Регулюючі столики з підстаканниками для вашого напою;",
  "Клімат контроль, кондиціонер, автономне опалення салону;",
  "TV та WiFi для різноманіття поїздки;",
  "USB-роз’єми для підзарядки пристроів;",
  "Туалет в автобусі;",
  "Містке бажане відділення;",
];


export const BusPark = () => {

  return (
    <div className="buspark">
      <div className="buspark__slider">
        ТУТ МАЄ БУТИ СЛАЙДЕР
      </div>

      <div className="buspark__park">
        <h1  className="buspark__park-title">
          Автопарк SEM BUS
        </h1>
        <p className="buspark__park-text">
          Автопарк нашої компанії складається з комфортабельних
          автобусів та мікроавтобусів марки Mercedes-Benz Sprinter,
          Volkswagen Crafter та Setra, на яких поїздки
          запам’ятовуються виключним комфортом.
        </p>
        <p className="buspark__park-text">
          Це вже відчувається при посадці в автобус. Велика
          4кількість продуманих деталей доповнює картину.
        </p>

        <span className="buspark__park-list-title">
          А саме:
        </span>

        <ul className="buspark__park-list">
          {listItems.map((item, i) => (
            <li
              className="buspark__park-list-item"
              key={i}
            >
              {item}
            </li>
          ))}
        </ul>

      </div>


    </div>
  );
};
