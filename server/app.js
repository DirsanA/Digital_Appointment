const express = require("express");
const app = express();

const doctors = [
  {
    id: 1,
    name: "Dr. Abreham",
  },
  {
    id: 2,
    name: "Dr. Desu",
  },
  {
    id: 3,
    name: "Dr. Dirsan",
  },
];

// return all doctors
app.get("/doctors", function (req, res) {
  return res.status(200).json(doctors);
});

// return a single doctor

app.get("/doctors/:id", function (req, res) {
  const id = Number(req.params.id);
  const singleDoctor = doctors.find(function (doctor) {
    return doctor.id === id;
  });
  if (singleDoctor) {
    return res.status(200).send({
      message: "data is found",
      data: singleDoctor,
    });
  } else {
    return res.status(404).send({
      message: "data is not found",
    });
  }
});

module.exports = app;
