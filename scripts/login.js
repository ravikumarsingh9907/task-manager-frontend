const emailIn = document.querySelector(".email");
const passwordIn = document.querySelector(".password");
const loginBtn = document.querySelector(".submit");

(function checkAuth() {
  if (localStorage.getItem("token") !== null) {
    window.location.href = "./home.html";
  }
})();

// LOGIN USER
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailIn.value;
  const password = passwordIn.value;

  const response = await fetch("http://localhost:3300/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!data.token) return alert(data);

  localStorage.setItem("token", data.token);
  window.location.href = "./home.html";
});
