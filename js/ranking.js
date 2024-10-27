const players = document.getElementById("players");
let counter = 1;

async function fetchUsers() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/users/top-users?limit=10&socMediaShare=true"
    );

    const users = await response.json();
    console.log(users);

    users.users.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${counter}. ${user.nickName}</span><span>${user.gameScore} bodova</span>`;
      counter++;
      players.appendChild(listItem);
    });
  } catch (err) {
    console.error(err);
  }
}

fetchUsers();
