const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "react_form",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

app.use(bodyParser.json());

// get all data

app.get("/", (req, res) => {
  db.query(
    "SELECT c.class_id, d.department_id AS department_id, c.name AS class_name, d.name AS department_name FROM class AS c INNER JOIN department AS d ON c.department_id = d.department_id;",
    (err, result) => {
      if (err) {
        res.status(500).send("Error retrieving classes");
      } else {
        res.json(result);
      }
    }
  );
});

// Get all departments
app.get("/departments", (req, res) => {
  db.query("SELECT * FROM department", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving departments");
    } else {
      res.json(result);
    }
  });
});

// Get all classes
app.get("/classes", (req, res) => {
  db.query("SELECT * FROM class", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving classes");
    } else {
      res.json(result);
    }
  });
});

// Create a new class
app.post("/classes", (req, res) => {
  const { name, department_id } = req.body;
  if (!name || !department_id) {
    res.status(400).send("Name and department_id are required");
  } else {
    db.query(
      "INSERT INTO class (name, department_id) VALUES (?, ?)",
      [name, department_id],
      (err, result) => {
        if (err) {
          res.status(500).send("Error creating class");
        } else {
          res.status(201).send("Class created successfully");
        }
      }
    );
  }
});

// Update a class
app.put("/classes/:id", (req, res) => {
  const classId = req.params.id;
  const { name, department_id } = req.body;
  if (!name || !department_id) {
    res.status(400).send("Name and department_id are required");
  } else {
    db.query(
      "UPDATE class SET name=?, department_id=? WHERE class_id=?",
      [name, department_id, classId],
      (err, result) => {
        if (err) {
          res.status(500).send("Error updating class");
        } else {
          res.send("Class updated successfully");
        }
      }
    );
  }
});
app.get("/classes/:id", (req, res) => {
  const classId = req.params.id;

  db.query(
    `SELECT * FROM react_form.class WHERE class_id = ${classId}`,

    (err, result) => {
      if (err) {
        res.status(500).send("Error updating class");
      } else {
        res.send(result);
      }
    }
  );
});

// Delete a class
app.delete("/classes/:id", (req, res) => {
  const classId = req.params.id;
  db.query("DELETE FROM class WHERE class_id=?", [classId], (err, result) => {
    if (err) {
      res.status(500).send("Error deleting class");
    } else {
      res.send("Class deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
