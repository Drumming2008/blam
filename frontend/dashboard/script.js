let apiPassword = null;
let users = null;

async function loadUsers() {
  const res = await fetch("https://blam.rkmr.dev/api/users/", {
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
      <td><button class="remove-btn" onclick="removeUser('${u._id}')">Remove</button></td>
    `;
    document.getElementById("users-table-body").append(tr);
  }
}

async function loadReports() {
  const res = await fetch("https://blam.rkmr.dev/api/reports/", {
    headers: { "api-auth": apiPassword },
  });
  const reports = await res.json();
  console.log(reports);
  document.getElementById("requests").innerHTML = "";
  for (let r of reports) {
    let li = document.createElement("li");
    li.innerHTML = `${getUserById(r.name)} eliminated ${getUserById(r.target)}
      <button class="accept" onclick="blammoUser('${r.name}')">Accept</button>
      <button class="reject">Reject</button>`;
    document.getElementById("requests").append(li);
  }
}

function getUserById(id) {
  return users?.find((u) => u._id === id)?.name;
}
async function blammoUser(user) {
  await fetch("https://blam.rkmr.dev/api/blammo/", {
    method: "POST",
    headers: { "api-auth": apiPassword, "Content-Type": "application/json" },
    body: JSON.stringify({ user: user }),
  });

  loadUsers();
}
async function randomize() {
  await fetch("https://blam.rkmr.dev/api/assign-targets/", {
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
    loadReports();
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
