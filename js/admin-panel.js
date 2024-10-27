const loginBtn = document.querySelector("#login-btn");
const loginForm = document.querySelector("#login-form");
const userData = document.querySelector("#user-data");
const showAll = document.querySelector("#show-all");
const showShare = document.querySelector("#show-share");
let token;
document
  .querySelector("#login-btn")
  .addEventListener("click", async function () {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // hide(loadingPage);
      const responseData = await response.json();
      if (responseData.data.user.role === "admin") {
        console.log("Ulogovani ste kao admin");
        token = responseData.token;
        hide(loginForm);
        show(userData);
      } else {
        alert("Nemate ovlaštenja za pristup");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Proverite email ili password");
    }
  });

//funkcije
const hide = (el) => {
  el.classList.remove("visible");
  el.classList.add("hide");
};

const show = (el) => {
  el.classList.add("visible");
  el.classList.remove("hide");
};

showAll.addEventListener("click", async function () {
  await fetchUserData(token);
});

showShare.addEventListener("click", async function () {
  await fetchUserDataShare(token);
});
//generisanje pdf-a
function generatePDF(fileName) {
  const element = document.getElementById("user-table");
  const pdfOptions = {
    filename: `${fileName}.pdf`, // Postavite ime dokumenta ovde
  };
  html2pdf().from(element).set(pdfOptions).save();
}
//ispis svih korisnika
async function fetchUserData(token) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/users",
      //"http://localhost:3000/api/v1/users?fields=gameScore,firstName,lastName,email,phone",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
      console.log(response);
    }

    const responseData = await response.json();
    console.log(responseData);
    const usersData = responseData.users;

    console.log(usersData);

    /////////////// formatiranje podataka i smijestanje u clipboard ////////////////////////
    const formattedData = usersData.map((user) => {
      return `Ime: ${user.firstName}, Prezime: ${user.lastName}, E-mail: ${
        user.email
      }, Br. telefona: ${user.phone}, Game Score: ${user.gameScore || ""}`;
    });
    const dataToCopy = formattedData.join("\n");
    await navigator.clipboard.writeText(dataToCopy);
    alert("Podaci korisnika su kopirani u clipboard.");
    ////////////// formatiranje i smijestanje zavrseno /////////////////////////

    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = ""; //prazni tabelu
    // Kreirajte redove za svakog korisnika i dodajte ih u tabelu
    usersData.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${user.firstName}</td>
  <td>${user.lastName}</td>
  <td>${user.email}</td>
  <td>${user.phone}</td>
  <td>${user.gameScore || ""}</td>
`;
      tableBody.appendChild(row);
    });
    //pozivamo funkciju i dodjeljujemo ime nakon unosa svih podataka
    generatePDF("ArenaGame_SviKorisnici");
  } catch (error) {
    console.error("Greška prilikom dohvatanja podataka sa API-ja:", error);
  }
}

async function fetchUserDataShare(token) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/users?socMediaShare=true&fields=firstName,lastName,email,phone,gameScore,socMediaShare",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
      console.log(response);
    }

    const responseData = await response.json();
    const usersData = responseData.users;

    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = ""; //prazni tabelu
    // Kreirajte redove za svakog korisnika i dodajte ih u tabelu
    usersData.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${user.firstName}</td>
  <td>${user.lastName}</td>
  <td>${user.email}</td>
  <td>${user.phone}</td>
  <td>${user.gameScore || ""}</td>
`;
      tableBody.appendChild(row);
    });
    generatePDF("ArenaGame_Share_Korisnici");
  } catch (error) {
    console.error("Greška prilikom dohvatanja podataka sa API-ja:", error);
  }
}
