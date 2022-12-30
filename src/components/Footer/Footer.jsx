import React from 'react';
import './Footer.scss';
import { SocialBar } from "../SocialBar/SocialBar";

import {Link} from "react-router-dom";

export const Footer = () => {


    //#region Render
    return (
        <footer className="footer">
          <Link to={'/'}>
            <img
              className="footer__logo"
              src="./assets/images/logo.svg"
              alt="logo"
            />
          </Link>

          <div className="footer__socials">
            <span
              className="footer__socials-title"
            >
              Медіа:
            </span>
            <SocialBar
            />
          </div>

          <nav className="footer__nav">
            <ul className="footer__list">
              <li className="footer__list-item">
                <a
                  href="tel:+6494461709"
                  className="footer__list-link"
                >
                  Телефон: <span className="no-wrap">+38(096) 754 02 71</span>
                </a>
              </li>

              <li className="footer__list-item">
                <a
                  href="viber://chat?number=%2B4957777777"
                  className="footer__list-link"
                >
                  Viber/Telegram: <span className="no-wrap">+38(097) 501 30 93</span>
                </a>
              </li>

              <li
                className="footer__list-item footer__list-item-hide"
              >
                <a
                  href="mailto:labus.com.ua@gmail.com"
                  className="footer__list-link"
                >
                  E-mail: <span className="no-wrap">labus.com.ua@gmail.com</span>
                </a>
              </li>
            </ul>
          </nav>
        </footer>
    );
    //#endregion
};

