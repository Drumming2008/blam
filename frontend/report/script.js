let names = [
  "Finn",
  "Sam",
  "Ravi",
  "Yush",
  "Donald Ray Burger"
]

for (let i of document.querySelectorAll(".autocomplete")) {
  let menu = document.createElement("div")
  menu.classList.add("autocomplete-menu")
  i.after(menu)

  menu.classList.add("hidden")
  menu.style.display = "none"

  for (let n of names) {
    let menuItem = document.createElement("button")
    menuItem.classList.add("autocomplete-menu-item")
    menuItem.innerText = n
    menuItem.tabIndex = -1
    menu.append(menuItem)
    menuItem.onclick = () => {
      i.value = n
      menu.classList.add("hidden")
      setTimeout(() => {
        menu.style.display = "none"
      }, 200)
    }
  }

  addEventListener("resize", () => {
    let box = i.getBoundingClientRect()
    menu.style.left = box.left + "px"
    menu.style.top = box.bottom + "px"
    menu.style.width = box.width + 4 + "px"
  })

  i.onfocus = () => {
    let box = i.getBoundingClientRect()
    menu.style.left = box.left + "px"
    menu.style.top = box.bottom + "px"
    menu.style.width = box.width + 4 + "px"
    menu.style.display = ""
    setTimeout(() => {
      menu.classList.remove("hidden")
    })
    setTimeout(() => {
      menu.style.display = ""
    }, 200)
  }

  addEventListener("click", e => {
    if (e.target == i || e.target == menu || menu.contains(e.target)) return
    setTimeout(() => {
      menu.classList.add("hidden")
      setTimeout(() => {
        menu.style.display = "none"
      }, 200)
    })
  })
}
