import React from "react";
import './Feedbacks.scss';
import { FeedbackItem } from "../FeedbackItem/FeedbackItem";

export const Feedbacks = () => {

  return (
    <div className="feedbacks">
      <h1 className="feedbacks__title">
        Відгуки наших клієнтів
      </h1>

      <div className="feedbacks__slider">
        <FeedbackItem
          photo="client1"
          name="Eleanor Pena"
          city="Київ"
          rate={3}
          content="
            Дякую вам за хорошого водія, який сьогодні віз
            Київ - Варшава. Водій від Бога. Ввічливий,
            уважний і дуже гарна людина.
          "
        />
      </div>
    </div>
  );
};
