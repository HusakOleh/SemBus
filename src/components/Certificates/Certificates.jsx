import React from "react";
import './Certificates.scss';

const certificatesList = [
  "certificate1",
  "certificate2",
  "certificate3",
  "certificate4",
  "certificate5",
  "certificate6"
];

export const Certificates = () => {

  return (
    <div className="certificates">
      <h2 className="certificates__title">
        Сертифікати комфортності
      </h2>

      <div className="certificates-items">
        {certificatesList.map((cert, index) => (
          <img
            src={`./assets/images/certificate/${cert}.png`}
            alt="certificate1"
            className="certificates-items__item"
            key={`${cert.substring(0, 2)}-${index}`}
          />
        ))}







      </div>
    </div>
  );
};
