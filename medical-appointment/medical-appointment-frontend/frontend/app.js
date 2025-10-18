const container = document.querySelector(".container");

// Load doctors and slots
async function loadDoctors() {
  try {
    const res = await fetch("/api/doctors");
    const doctors = await res.json();

    doctors.forEach(doc => {
      const card = document.createElement("div");
      card.className = "doctor-card";
      card.innerHTML = `
        <h3>${doc.name}</h3>
        <p><strong>Specialty:</strong> ${doc.specialty}</p>
        <p><strong>Qualifications:</strong> ${doc.qualifications}</p>
        <p><strong>Education:</strong> ${doc.education || "N/A"}</p>
        <p><strong>Experience:</strong> ${doc.experience || "N/A"}</p>
        <div class="slots" id="slots-${doc.id}">Loading slots...</div>
      `;
      container.appendChild(card);

      // Load slots for this doctor
      const slotDiv = card.querySelector(`#slots-${doc.id}`);
      fetch(`/api/slots/${doc.id}`)
        .then(res => res.json())
        .then(slots => {
          if(slots.length === 0) {
            slotDiv.innerHTML = "<p>No available slots</p>";
          } else {
            slots.forEach(slot => {
              const btn = document.createElement("button");
              btn.textContent = new Date(slot.slot_time).toLocaleString();
              btn.className = "slot-btn";
              btn.onclick = async () => {
                const patient_name = prompt("Enter your name:");
                const patient_email = prompt("Enter your email:");
                if (!patient_name || !patient_email) return;

                const res = await fetch("/api/appointments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    doctor_id: doc.id,
                    slot_id: slot.id,
                    patient_name,
                    patient_email
                  })
                });
                const data = await res.json();
                alert(data.message);
                btn.remove(); // hide booked slot
              };
              slotDiv.appendChild(btn);
            });
          }
        });
    });
  } catch (err) {
    console.error(err);
    container.innerHTML += "<p>⚠️ Error loading doctors or slots</p>";
  }
}

// Call on page load
loadDoctors();
