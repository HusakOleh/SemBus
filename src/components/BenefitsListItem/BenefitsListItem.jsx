import React from "react";
import './BenefitsListItem.scss';

export const BenefitsListItem = ({content, icon}) => {

  return (
    <li className="list-item">
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
