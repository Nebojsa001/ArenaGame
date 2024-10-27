const playBtn = document.querySelector("#play-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const loadingPage = document.querySelector("#loading-page");
const instructionsPage = document.getElementById("instructions-page");
const closeScore = document.querySelector("#close-score");
const nextToShare = document.querySelector("#next-to-share");
const scorePage = document.querySelector("#score-page");
const sharePage = document.querySelector("#share-page");
const facebookBtn = document.querySelector(".facebook");
let token;
const hide = (el) => {
  el.classList.remove("visible");
  el.classList.add("hide");
};
closeScore.addEventListener("click", () => hide(scorePage));
instructionsBtn.addEventListener("click", () => hide(instructionsPage));

nextToShare.addEventListener("click", () => {
  stopCounting();
  scorePage.classList.remove("visible");
  scorePage.classList.add("hide");
  sharePage.classList.add("visible");
});

document
  .querySelector("#play-btn")
  .addEventListener("click", async function () {
    const ime = document.querySelector("#ime").value;
    const prezime = document.querySelector("#prezime").value;
    const email = document.querySelector("#email").value;
    const telefon = document.querySelector("#telefon").value;
    let phone = telefon.replace(/\s/g, "");
    const potvrda = document.querySelector("#potvrda").checked;

    //hide(loadingPage); //pomjeriti dole
    if (!ime) {
      markAsRequired("ime");
      return false;
    }

    if (!prezime) {
      markAsRequired("prezime");
      return false;
    }

    if (!email) {
      markAsRequired("email");
      return false;
    }

    if (!telefon) {
      markAsRequired("telefon");
      return false;
    }

    if (!potvrda) {
      alert("Prihvati uslove da bi igrao igricu");
      return;
    }

    const data = {
      firstName: ime,
      lastName: prezime,
      email: email,
      phone: phone,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/store-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // hide(loadingPage);
      hide(loadingPage);
      const responseData = await response.json();
      token = responseData.token;
      // Ovdje možete obraditi responseData
    } catch (err) {
      alert(
        "Nalog već postoji: Ulogovao si se sa ovim imenom i e-mail adresom."
      );
    }
  });

facebookBtn.addEventListener("click", async () => {
  updateShare(token);
});

//api funkcije
async function updateShare(token) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/users/update-share",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Greška prilikom dohvatanja podataka sa API-ja:", error);
  }
}

//funckija za validaciju forme
function markAsRequired(fieldId) {
  let field = document.getElementById(fieldId);
  field.classList.add("required");
}
$(document).ready(function () {
  var oMain = new CMain({
    area_goal: [
      { id: 0, probability: 100 },
      { id: 1, probability: 80 },
      { id: 2, probability: 60 },
      { id: 3, probability: 80 },
      { id: 4, probability: 100 },
      { id: 5, probability: 75 },
      { id: 6, probability: 60 },
      { id: 7, probability: 50 },
      { id: 8, probability: 60 },
      { id: 9, probability: 75 },
      { id: 10, probability: 80 },
      { id: 11, probability: 65 },
      { id: 12, probability: 70 },
      { id: 13, probability: 65 },
      { id: 14, probability: 80 },
    ], //PROBABILITY AREA GOALS START TO LEFT UP TO RIGHT DOWN
    //0  1  2  3  4
    //5  6  7  8  9
    //10 11 12 13 14
    num_of_penalty: 15, //MAX NUMBER OF PENALTY FOR END GAME
    multiplier_step: 0.1, //INCREASE MULTIPLIER EVERY GOAL
    audio_enable_on_startup: false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS
    fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
    check_orientation: true, //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
    num_levels_for_ads: 2, //NUMBER OF TURNS PLAYED BEFORE AD SHOWING //
    //////// THIS FEATURE  IS ACTIVATED ONLY WITH CTL ARCADE PLUGIN.///////////////////////////
    /////////////////// YOU CAN GET IT AT: /////////////////////////////////////////////////////////
    // http://codecanyon.net/item/ctl-arcade-wordpress-plugin/13856421 ///////////
  });
  $(oMain).on("start_session", function (evt) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeStartSession();
    }
  });

  $(oMain).on("end_session", function (evt) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeEndSession();
    }
  });

  $(oMain).on("start_level", function (evt, iLevel) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeStartLevel({ level: iLevel });
    }
  });

  $(oMain).on("restart_level", function (evt, iLevel) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeRestartLevel({ level: iLevel });
    }
  });

  $(oMain).on("end_level", function (evt, iLevel) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeEndLevel({ level: iLevel });
    }
  });

  $(oMain).on("save_score", function (evt, iScore, szMode) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeSaveScore({ score: iScore, mode: szMode });
    }
  });

  $(oMain).on("show_interlevel_ad", function (evt) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeShowInterlevelAD();
    }
  });

  $(oMain).on("share_event", function (evt, iScore) {
    if (getParamValue("ctl-arcade") === "true") {
      parent.__ctlArcadeShareEvent({
        img: TEXT_SHARE_IMAGE,
        title: TEXT_SHARE_TITLE,
        msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
        msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1,
      });
    }
  });

  if (isIOS()) {
    setTimeout(function () {
      sizeHandler();
    }, 200);
  } else {
    sizeHandler();
  }
});
