const API_URL = "https://blam.rkmr.dev/api"

const id = id => document.getElementById(id)

if (document.referrer.includes(location.host)) {
  id("header")?.classList.add("no-anim")
}
