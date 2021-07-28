import React from "react";
import "./css/About.css";


function About() {
  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src="https://www.vmcdn.ca/f/files/shared/miscellaneous-stock-images/archive-adobestock.jpg;w=710;h=400"
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">על הפרוייקט</h1>
            <p class="about">
              במהלך השנים האחרונות ארכיון המדינה עובר תהליך דיגיטזציה על מנת להתאים את עצמו לעולם הדיגיטלי.<br></br>
              כחלק מתהליך זה, מדי חודש מפורסמת באתר הארכיון רשימה של התיקים שנסרקו בחודש החולף.<br></br>
              במהלך שיטוטינו באתר, מצאנו את החיפוש בתיקים שפורסמו לאחרונה מסורבל ואינו מאפשר מעקב אחר נושאים ספציפיים.
              בפרוייקט זה אנו מנסים לפתור את הבעיה הזו ולהציע ממשק משתמש נוח יותר. <br></br><br></br>
              <a href="https://github.com/yaelgeis/DigitalHumanitiesJS">לצפייה בקוד המקור</a>

            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;