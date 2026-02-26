let apiPassword = null;

async function loadUsers() {
  const res = await fetch("https://blam.rkmr.dev/api/users/", {
    headers: { "api-auth": apiPassword },
  });
  const users = await res.json();
  console.log(users);
  document.getElementById("users-table-body").innerHTML = "";
  for (let u of users) {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.name}</td><td>${u.target}</td>`;
    document.getElementById("users-table-body").append(tr);
  }
}

async function randomize() {
  await fetch("https://blam.rkmr.dev/api/assign-targets/", {
    method: "POST",
    headers: { "api-auth": apiPassword },
  });
  loadUsers();
}

async function attemptLogin() {
  const password = document.getElementById("password-input").value;
  const errorEl = document.getElementById("auth-error");
  errorEl.style.display = "none";
  let res;
  try {
    res = await fetch("https://blam.rkmr.dev/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-auth": password },
    });
  } catch (e) {
    errorEl.textContent = e;
    errorEl.style.display = "inline";
    return;
  }
  if (res.ok) {
    apiPassword = password;
    document.getElementById("auth").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    loadUsers();
  } else if (res.status === 401) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("unauthorized-msg").style.display = "block";
  } else {
    errorEl.textContent = `error (${res.status})`;
    errorEl.style.display = "inline";
  }
}

document.getElementById("login-btn").addEventListener("click", attemptLogin);
document.getElementById("password-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptLogin();
});
