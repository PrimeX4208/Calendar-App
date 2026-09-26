// static/script.js
import { Calendar } from 'https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/+esm';

let dateValue = null;

const calendar = new Calendar('#calendar');
calendar.init();

function formatTime(time) {
    const [hour, minute] = time.split(':');
    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
}

const allDayCheckbox = document.getElementById('all-day-checkbox');
const timeInput = document.getElementById('time-input');

allDayCheckbox.addEventListener('change', () => {
    timeInput.disabled = allDayCheckbox.checked;
});

document.querySelector('#calendar').addEventListener('click', (e) => {
    const day = e.target.closest('[data-date], [data-vc-date], .vc-day');

    if (day) {
        dateValue = day.dataset.date || day.dataset.vcDate || day.textContent.trim();
        loadEvents(dateValue);
        
    }
});

fetch('/event-dates')
    .then(res => res.json())

document.getElementById('save-btn').addEventListener('click', () => {
    const text = document.getElementById('event-input').value;
    const all_day = document.getElementById('all-day-checkbox').checked;

    let time = null

    if (!all_day) {
    time = document.getElementById('time-input').value;
    if (!time) return;
    }

    if (!text) return;

    if (!all_day && !time) return;

    console.log("All Day:", all_day);

    fetch('/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: dateValue,
            text: text,
            time: time,
            all_day: all_day ? 1 : 0
        })
    })
    .then(res => res.json())
    .then(() => loadEvents(dateValue));
});

async function loadEvents(date) {
    const res = await fetch(`/get-events/${date}`);
    const events = await res.json();

    const list = document.getElementById('event-list');
    list.innerHTML = '';

    events.forEach(event => {
    const li = document.createElement('li');

    const time = event[0];
    const allDay = event[1];
    const text = event[2];
    
    if (allDay) {
        li.textContent = `All Day - ${text}`;
    } else {
        li.textContent = `${time} - ${text}`;
    }

    list.appendChild(li);
});
}

