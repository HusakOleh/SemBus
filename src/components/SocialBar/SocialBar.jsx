import React from "react";
import './SocialBar.scss';
import classNames from 'classnames';

const socialsList = ["fb", "insta", "viber", "whatsapp", "telegram"];
const socialsLink = {
  fb: "https://www.messenger.com/t/jack.malbon.3",
  insta: "https://www.instagram.com/",
  viber: "viber://chat?number=%2B4957777777",
  whatsapp: "https://wa.me/380971111111",
  telegram: "https://telegram.me/jack_malbon"
};


export const SocialBar = ({
  fullWidth=false,
  greyIcon = false
}) => {

  const isGrey = greyIcon ? "-gr" : "";

  return (
      <ul className={classNames("socials",
        {"socials-full-width": fullWidth}
      )}>
        {socialsList.map((soc, i) => (
          <li
            key={`${soc}-${i}`}
          >
            <a href={socialsLink[soc]}>
              <img
                className="socials__img"
                src={`./assets/images/icons/icon-${soc}${isGrey}.svg`}
                alt="soc"
              />
            </a>
          </li>
        ))}
      </ul>
  );
}
