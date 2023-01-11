import React from "react";
import './BenefitsListItem.scss';

export const BenefitsListItem = ({
  content,
  icon,
  setBenefit
}) => {

  return (
    <li
      className="list-item"
      onClick={() => setBenefit(icon)}
    >
      <div className="list-item__img-wrap">
        <img
          src={`./assets/images/icons/benefits-${icon}.svg`}
          alt={icon}
          className="list-item__img"
        />
      </div>

      <span className="list-item__text">
        {content}
      </span>
    </li>
  );
};
