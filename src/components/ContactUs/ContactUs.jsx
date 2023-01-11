import React from "react";
import './ContactUs.scss';

import {CustomButton} from "../CustomButton/CustomButton";

export const ContactUs = () => {

  return (
    <div className="contact-us">
      <h1 className="contact-us__title">
        Зворотній зв'язок
      </h1>

      <div className="contact-us__text">
        Якщо у Вас залишилися питання або є індивідуальне замовлення,
        що вимагає розмови з менеджером – залиште свій контакт і ми
        зв'яжемося з Вами.
      </div>

      <form
        className="contact-us__form"
        action=""
      >
        <input
          type="text"
          className="contact-us__form-input"
          placeholder="Повне Ім’я:"
          required
        />

        <input
          type="text"
          className="contact-us__form-input"
          placeholder="Телефон:"
          required
        />

        <textarea
          name=""
          id=""
          rows="5"
          className="contact-us__form-input"
          placeholder="Повідомлення:"
          required
        >
        </textarea>

        <div
          className="contact-us__form-button"
        >
          Надіслати заявку
        </div>
      </form>

    </div>
  );
};
