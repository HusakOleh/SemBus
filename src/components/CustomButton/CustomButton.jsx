import React from "react";
import './CustomButton.scss';

export const CustomButton = ({
  onClick,
  content,
                             }) => {

  return (
    <div
      className="custom-button"
      onClick={onClick}
    >
      {content}
    </div>
  );
};
