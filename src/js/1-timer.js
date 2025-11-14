import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const dateInput = document.querySelector("#datetime-picker");

let userSelectedDate = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const picked = selectedDates[0];

    if (picked <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });

      startBtn.disabled = true;
    } else {
      userSelectedDate = picked;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

// Таймер
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  dateInput.disabled = true;

  const intervalId = setInterval(() => {
    const delta = userSelectedDate - new Date();

    if (delta <= 0) {
      clearInterval(intervalId);
      updateTimer(0);
      dateInput.disabled = false;
      return;
    }

    updateTimer(delta);
  }, 1000);
});

// Конвертация времени из ТЗ
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

// Обновление UI
function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  document.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
  document.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  document.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
  document.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
}
