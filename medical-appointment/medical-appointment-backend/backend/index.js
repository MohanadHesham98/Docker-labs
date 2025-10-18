const express = require("express");
const cors = require("cors");
const db = require("./db"); // pool

const app = express();
app.use(cors());
app.use(express.json());

// Get all doctors
app.get("/api/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, results) => {
    if (err) {
      console.error("❌ DB query error:", err);
      return res.status(500).json({ error: "DB query failed", details: err.message });
    }
    res.json(results);
  });
});

// Get available slots for a doctor
app.get("/api/slots/:doctor_id", (req, res) => {
  const { doctor_id } = req.params;
  db.query(
    "SELECT * FROM slots WHERE doctor_id = ? AND booked = FALSE",
    [doctor_id],
    (err, results) => {
      if (err) {
        console.error("❌ DB query error:", err);
        return res.status(500).json({ error: "DB query failed", details: err.message });
      }
      res.json(results);
    }
  );
});

// Add new appointment
app.post("/api/appointments", (req, res) => {
  const { patient_name, patient_email, doctor_id, slot_id } = req.body;

  if (!patient_name || !patient_email || !doctor_id || !slot_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Mark slot as booked
  db.query("UPDATE slots SET booked = TRUE WHERE id = ?", [slot_id], (err) => {
    if (err) {
      console.error("❌ Update slot error:", err);
      return res.status(500).json({ message: "Database error", details: err.message });
    }

    // Insert appointment
    const query = `
      INSERT INTO appointments (patient_name, patient_email, doctor_id, slot_id, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;
    db.query(query, [patient_name, patient_email, doctor_id, slot_id], (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).json({ message: "Database error", details: err.message });
      }
      res.status(201).json({ message: "✅ Appointment booked", id: result.insertId });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
