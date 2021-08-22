let form = document.getElementById("loginForm");
// let apiUrl = `https://yesh-netflix-api.herokuapp.com/`;
let apiUrl = `http://localhost:3000/`;

// https://yesh-netflix-api.herokuapp.com/

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
const existingEmail = urlParams.get("existingEmail");
const registered = urlParams.get("registered");
const alreadyRegistered = urlParams.get("user");
console.log(registered);
// console.log(urlParams)
if (existingEmail) {
  form.email.value = existingEmail;
}

if (registered) {
  document.querySelector(".registered-alert").style.display = "block";
}

if (alreadyRegistered) {
  document.querySelector(".already-registered").style.display = "block";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let payload = {
    email: form.email.value,
    password: form.password.value,
  };
  console.log(payload);

  fetch(`${apiUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((response) => {
      localStorage.setItem("token", response.token);
      location.href = "/";
    })
    // .then((data) => {
    //     console.log(data);
    // })
    .catch((err) => {
      console.log(err);
    });
});
