let apiPassword = localStorage.getItem("api-password");
let users = null, usersLoaded = null;

async function loadUsers() {
  let resolve;
  ({ promise: usersLoaded, resolve } = Promise.withResolvers());

  const res = await fetch(`${API_URL}/users/`, {
    headers: { "api-auth": apiPassword },
  });
  users = await res.json();
  console.log(users);
  document.getElementById("users-table-body").innerHTML = "";

  for (let u of users) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${getUserById(u.target) ?? "—"}</td>
      <td>${u.email}</td>
      <td><div class="status ${u.alive ? "alive" : "dead"}"></div></td>
      <td><button class="remove-btn" onclick="removeUser('${u._id}')">Remove</button></td>
    `;
    document.getElementById("users-table-body").append(tr);
  }

  resolve();
}

async function loadReports() {
  const res = await fetch(`${API_URL}/reports/`, {
    headers: { "api-auth": apiPassword },
  });
  const reports = await res.json();
  await usersLoaded;

  console.log(reports);
  document.getElementById("requests").innerHTML = "";
  for (let r of reports) {
    if (!r.active) continue;
    let li = document.createElement("li");
    li.innerHTML = `${getUserById(r.name)} eliminated ${getUserById(r.target)}
      <button class="accept" onclick="blammoUser('${r.name}', '${r._id}')">Accept</button>
      <button class="reject" onclick="completeReport('${r._id}')">Reject</button>`;
    document.getElementById("requests").append(li);
  }
}

function getUserById(id) {
  return users?.find((u) => u._id === id)?.name;
}
async function blammoUser(user, report) {
  await fetch("https://blam.rkmr.dev/api/blammo/", {
    method: "POST",
    headers: { "api-auth": apiPassword, "Content-Type": "application/json" },
    body: JSON.stringify({ user: user }),
  });
  completeReport(report);
  loadUsers();
  loadReports();
}
async function completeReport(report) {
  await fetch("https://blam.rkmr.dev/api/reports/complete", {
    method: "POST",
    headers: { "api-auth": apiPassword, "Content-Type": "application/json" },
    body: JSON.stringify({ id: report }),
  });

  loadUsers();
  loadReports();
}
async function randomize() {
  await fetch(`${API_URL}/assign-targets/`, {
    method: "POST",
    headers: { "api-auth": apiPassword },
  });
  loadUsers();
}

async function addUser() {
  const name = document.getElementById("add-name").value.trim();
  const email = document.getElementById("add-email").value.trim();
  const grade = document.getElementById("add-grade").value.trim();
  const errorEl = document.getElementById("add-error");
  errorEl.style.display = "none";

  if (!name || !email || !grade) {
    errorEl.textContent = "All fields are required.";
    errorEl.style.display = "inline";
    return;
  }

  const res = await fetch("https://blam.rkmr.dev/api/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-auth": apiPassword },
    body: JSON.stringify({ name, email, grade }),
  });

  if (res.ok) {
    document.getElementById("add-name").value = "";
    document.getElementById("add-email").value = "";
    document.getElementById("add-grade").value = "";
    loadUsers();
  } else {
    errorEl.textContent = `error (${res.status})`;
    errorEl.style.display = "inline";
  }
}

async function removeUser(id) {
  const res = await fetch(`https://blam.rkmr.dev/api/users/${id}`, {
    method: "DELETE",
    headers: { "api-auth": apiPassword },
  });
  if (res.ok) {
    loadUsers();
  } else {
    alert(`Failed to remove user (${res.status})`);
  }
}

const passwordInput = document.getElementById("password-input")

async function attemptLogin(password) {
  const errorEl = document.getElementById("auth-error");
  errorEl.style.display = "none";
  let res;
  try {
    res = await fetch(`${API_URL}/auth`, {
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
    localStorage.setItem("api-password", password)
    document.getElementById("auth").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    loadUsers();
    loadReports();
  } else if (res.status === 401) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("unauthorized-msg").style.display = "block";
  } else {
    errorEl.textContent = `error (${res.status})`;
    errorEl.style.display = "inline";
  }
}

document.getElementById("login-btn").addEventListener("click", () => attemptLogin(passwordInput.value));
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptLogin(passwordInput.value);
});

if (apiPassword) attemptLogin(apiPassword); // from localStorage
