import React, {useState} from "react";
import './Benefits.scss';
import {BenefitsListItem} from "../BenefitsListItem/BenefitsListItem";

const listItems = [
  "Завозимо пасажирів у країни Балтії прямо за адресою;",
  "Їдемо прямими рейсами прямо на місце призначення;",
  "Досвідчені водії зі стажем, які залишать після себе приємне враження;",
  "Одразу декілька водіїв;",
  "Комфортабельний транспорт;",
  "Діє система знижок для людей з обмеженими можливостями, дітей та літніх людей;",
  "Працюємо без передоплат та посередників, оплата здійснюється при посадці в автобус;",
  "Поїздки на мікроавтобусах марки Mercedes-Benz Sprinter, Volkswagen Crafter;"
];

export const Benefits = () => {

  const [benefit, setBenefit] = useState("like");

  return (
    <div className="benefits">
      <div className="benefits__visual">

        <div className="benefits__visual-img">
          <img
            src={`./assets/images/benefits-${benefit}.png`}
            alt="main-benefit"
            className="benefits__visual-img-main"
          />
        </div>

        <ul className="benefits__visual-list">
          <BenefitsListItem
            content="популярне"
            icon="like"
            setBenefit={setBenefit}
          />
          <BenefitsListItem
            content="USB-зарядки"
            icon="usb"
            setBenefit={setBenefit}
          />
          <BenefitsListItem
            content="Зручні сидіння"
            icon="seats"
            setBenefit={setBenefit}
          />
          <BenefitsListItem
            content="Кондиціонер"
            icon="conditioner"
            setBenefit={setBenefit}
          />
          <BenefitsListItem
            content="Туалети"
            icon="wc"
            setBenefit={setBenefit}
          />
          <BenefitsListItem
            content="WIFI"
            icon="wifi"
            setBenefit={setBenefit}
          />
        </ul>
      </div>

      <div className="benefits__text">
        <h1 className="benefits__text-title">
          Компанія SEM BUS
        </h1>
        <h4 className="benefits__text-subtitle">
          здійснює щоденні поїздки до Литви, Латвії, Естонії.
          Ми відповідаємо за комфорт, сервіс та безпеку наших пасажирів.
        </h4>

        <h4 className="benefits__text-listtitle">
          Наші особливості:
        </h4>

        <ul className="benefits__text-list">
          {listItems.map((item, i) => (
            <li
              className="benefits__text-list-item"
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
