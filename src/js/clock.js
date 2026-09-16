const clockTime = document.querySelector(".calculator__time");

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  clockTime.classList.remove("clock-update");

  void clockTime.offsetWidth;

  clockTime.textContent = time;

  clockTime.classList.add("clock-update");
}

updateClock();

setInterval(updateClock, 1000);
