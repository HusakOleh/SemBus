import React, {useContext, useState, useEffect} from 'react';
import classNames from 'classnames';
import './Header.scss';
import {Link} from "react-router-dom";
import {SocialBar} from "../SocialBar/SocialBar";

import {auth, logOut} from "../../utils/firebaseConfigAndFunctions";
import {AppContext} from "../../context/appContext";


export const Header = () => {
  //#region Get user from app context
  const {user} = useContext(AppContext);
  //#endregion

  const [openMenu, setOpenMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const body = document.querySelector("body");

    if (openMenu) {
      body.style.overflow = "hidden";
    } else {body.style.overflow = "inherit"}

  }, [openMenu])

  //#region Render
  return (
    <header className={classNames(
      "header",
      {"header-is-open": openMenu}
    )}>

      {/*#region button check user*/}
      {/*  <div>*/}
      {/*      <button*/}
      {/*          onClick={() => console.log(auth.currentUser)}*/}
      {/*      >*/}
      {/*          Check auth*/}
      {/*      </button>*/}
      {/*      <button*/}
      {/*          onClick={() => console.log(user)}*/}
      {/*      >*/}
      {/*          Check user*/}
      {/*      </button>*/}
      {/*  </div>*/}
      {/*#endregion*/}

    <div className="header__top">
      <Link to={'/'}>
        <img
          className="header__logo"
          src="./assets/images/logo.svg"
          alt="logo"
        />
      </Link>

      <button
        className={classNames(
          "header__opener",
          {"header__opener-open": openMenu}
        )}
        onClick={(e) => setOpenMenu(!openMenu)}
      >
      </button>
    </div>

    <nav className="header__nav">
      <ul className="header__list">
        <li className="header__list-item">
          <a
            href=""
            className="header__list-link"
          >
            Про нас
          </a>
        </li>

        <li className="header__list-item">
          <a
            href=""
            className="header__list-link"
          >
            Чат
          </a>
        </li>

        <li
          className="header__list-item header__list-item-active"
        >
          <a
            href="tel:+6494461709"
            className="header__list-link"
          >
            Телефон
          </a>
        </li>
      </ul>
    </nav>

    <div className="header__login">
      {!isLogged
        ?
        (
          <>

            <div className="header__login-item header__login-item-white">
              <Link
                to={'/login'}
              >
                Вхід
              </Link>
            </div>


            <div className="header__login-item">
              <Link
                to={'/register'}
              >
                Реєстрація
              </Link>
            </div>
          </>
        )

        :
        (
          <>
            <div className="header__login-item">
              <Link
                to={'/'}
                onClick={() => logOut()
                }
              >
                Вихід
              </Link>
            </div>
          </>
        )

      }

    </div>

    <div className="header__socials">
      <SocialBar
        greyIcon={true}
      />
    </div>
    </header>
  );
  //#endregion
};
