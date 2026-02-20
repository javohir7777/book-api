const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const books = await pool.query("SELECT * FROM books");
    res.status(200).json(books.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BOOKS BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book topilmadi" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD NEW BOOKS
router.post("/add", async (req, res) => {
  try {
    const { name, salary, degree } = req.body;
    const newBooks = await pool.query(
      `
      INSERT INTO books (name, degree, salary) VALUES ($1, $2, $3) RETURNING *
      `,
      [name, degree, salary]
    );

    res.status(201).json(newBooks.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE BOOKS
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, degree } = req.body;

    const oldEmployer = await pool.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);

    const updateBooks = await pool.query(
      `
      UPDATE books SET name = $1, degree = $2, salary = $3 WHERE id = $4 RETURNING *
      `,
      [
        name ? name : oldEmployer.rows[0].name,
        degree ? degree : oldEmployer.rows[0].degree,
        salary ? salary : oldEmployer.rows[0].salary,
        id,
      ]
    );

    res.status(201).json(updateBooks.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE BOOKS
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);

    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
