const nameIn = document.querySelector(".name");
const emailIn = document.querySelector(".email");
const passwordIn = document.querySelector(".password");
const submitBtn = document.querySelector(".submit");

(function checkAuth() {
  if (localStorage.getItem("token") !== null) {
    window.location.href = "./home.html";
  }
})();

// SIGNUP USER
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const name = nameIn.value;
  const email = emailIn.value;
  const password = passwordIn.value;

  const response = await fetch("http://localhost:3300/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!data.token) return alert(data);

  localStorage.setItem("token", data.token);
  window.location.href = "./home.html";
});
