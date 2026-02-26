let names = [], nameToUserId = new Map()

async function loadNames() {
  const res = await fetch(`${API_URL}/leaderboard/`);
  const users = await res.json();

  for (let u of users) {
    names.push(u.name)
    nameToUserId.set(u.name.toLowerCase(), u._id)
  }
}

loadNames().then(onNamesLoaded)

function onNamesLoaded() {
  for (let i of document.querySelectorAll(".autocomplete")) {
    let menu = document.createElement("div")
    menu.classList.add("autocomplete-menu")
    i.after(menu)

    menu.classList.add("hidden")
    menu.style.display = "none"

    for (let n of names) {
      let menuItem = document.createElement("button")
      menuItem.type = "button" // <button type="button"> 🔥
      menuItem.classList.add("autocomplete-menu-item")
      menuItem.innerText = n
      menuItem.tabIndex = -1
      menu.append(menuItem)
      menuItem.onclick = () => {
        i.value = n
        hideMenu()
      }
    }

    addEventListener("resize", () => {
      let box = i.getBoundingClientRect()
      menu.style.left = box.left + "px"
      menu.style.top = box.bottom + "px"
      menu.style.width = box.width + 4 + "px"
    })

    let timeout

    i.onkeydown = e => {
      if (e.code === "Escape") hideMenu()
    }

    i.onfocus = () => {
      let box = i.getBoundingClientRect()
      menu.style.left = box.left + "px"
      menu.style.top = box.bottom + "px"
      menu.style.width = box.width + 4 + "px"
      menu.style.display = ""

      clearTimeout(timeout)
      void menu.offsetWidth // force css recalc
      menu.classList.remove("hidden")
      timeout = setTimeout(() => {
        menu.style.display = ""
      }, 200)
    }

    if (document.activeElement === i) i.onfocus()

    let label = i.closest("label")

    i.onblur = e => {
      let newFocus = e.relatedTarget
      console.log(newFocus)
      if (newFocus === i || label?.contains(newFocus)) return

      hideMenu()
    }

    function hideMenu() {
      clearTimeout(timeout)
      menu.classList.add("hidden")
      timeout = setTimeout(() => {
        menu.style.display = "none"
      }, 200)
    }
  }

  id("form").onsubmit = e => {
    e.preventDefault()

    let name = id("name").value.trim()
    let target = id("target").value.trim()
    let method = id("method").value.trim()

    let invalidNames = [name, target].filter(n => !nameToUserId.has(n.toLowerCase()))
    if (invalidNames.length) {
      id("form-error").innerText = `Unknown name${invalidNames.length > 1 ? "s" : ""} ${invalidNames.map(n => `“${n}”`).join(" and ")}. Use the dropdown selector to ensure that names are spelled correctly.`
      return
    }

    id("form-error").innerText = ""

    fetch(`${API_URL}/reports/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: nameToUserId.get(name.toLowerCase()),
        target: nameToUserId.get(target.toLowerCase()),
        method: method
      })
    })
  }
}
