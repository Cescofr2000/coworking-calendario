// script.js

// Nomi delle persone (colonne)
const people = ["Elilatene", "Menghini", "Condancuri", "Pinto", "Fattorini", "Bocchino"];

// Stato prenotazioni (caricato da localStorage o nuovo)
let reservations = JSON.parse(localStorage.getItem("reservations")) || {};

// Riferimenti al DOM
const tbody = document.querySelector("#calendar tbody");
const monthTitle = document.querySelector("#monthTitle");
const prevBtn = document.querySelector("#prevMonth");
const nextBtn = document.querySelector("#nextMonth");

// Data di partenza: Settembre 2025
let currentYear = 2025;
let currentMonth = 8; // 0=Gennaio, quindi 8=Settembre

// Salvataggio su localStorage
function saveReservations() {
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

// Funzione per generare il calendario
function generateCalendar(year, month) {
  tbody.innerHTML = ""; // pulisce tabella

  // Titolo mese
  const monthNames = [
    "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
  ];
  monthTitle.textContent = `Calendario Co-Working - ${monthNames[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const key = `${year}-${String(month+1).padStart(2,"0")}`;

  // Se il mese non ha ancora dati, inizializzalo
  if (!reservations[key]) {
    reservations[key] = {};
    people.forEach(p => reservations[key][p] = []);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay(); // 0=Dom, 6=Sab

    const tr = document.createElement("tr");

    // Giorno
    const tdDay = document.createElement("td");
    tdDay.textContent = day;
    tr.appendChild(tdDay);

    // Celle persone
    people.forEach(person => {
      const td = document.createElement("td");
      td.classList.add("cell");

      // Se prenotazione già esistente -> metti X
      if (reservations[key][person].includes(day)) {
        td.textContent = "X";
      }

      td.addEventListener("click", () => {
        const isSelected = td.textContent === "X";

        if (isSelected) {
          // Rimuovo
          td.textContent = "";
          reservations[key][person] = reservations[key][person].filter(d => d !== day);
          saveReservations();
        } else {
          // Controllo max 5 giorni per persona
          if (reservations[key][person].length >= 5) {
            alert(`${person} ha già raggiunto il limite di 5 giorni!`);
            return;
          }

          // Controllo max 3 persone in quel giorno
          const rowCells = tr.querySelectorAll("td.cell");
          const bookedCount = Array.from(rowCells).filter(c => c.textContent === "X").length;
          if (bookedCount >= 3) {
            alert(`Il giorno ${day} ha già 3 persone prenotate!`);
            return;
          }

          // Aggiungo
          td.textContent = "X";
          reservations[key][person].push(day);
          saveReservations();
        }
      });

      tr.appendChild(td);
    });

    // Weekend evidenziato
    if (weekday === 0 || weekday === 6) {
      tr.classList.add("weekend");
    }

    tbody.appendChild(tr);
  }
}

// Eventi pulsanti
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
});

// Avvio su Settembre 2025
generateCalendar(currentYear, currentMonth);
