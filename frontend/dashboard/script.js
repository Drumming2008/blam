(async () => {
  const res = await fetch("https://blam.rkmr.dev/api/leaderboard")
  const users = await res.json()

  console.log(users)

  for (let u of users) {
    let tr = document.createElement("tr")
    tr.innerHTML = `<td>${u.name}</td><td>Target</td>`
    document.getElementById("users-table-body").append(tr)
  }
})()
