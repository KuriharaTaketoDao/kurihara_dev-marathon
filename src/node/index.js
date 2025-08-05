const express = require("express");
const app = express();

const port = 5059;

const cors = require("cors");
app.use(cors());

//  app.use(cors()) はルーティングの前に置く(念のため)// 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { Pool } = require("pg");
const pool = new Pool({
  user: "5059", // PostgreSQLのユーザー名に置き換えてください
  host: "postgres",
  database: "5059", // PostgreSQLのデータベース名に置き換えてください
  password: "postgres", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});



app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});