// imports
import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

//configs

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

//server set-up
app.listen(8080, () => {
  console.log("Server is running in port 8080");
});

//GET
app.get("/", function (request, response) {
  response.json({ message: "welcome to my server. This is the root route!" });
});

app.post("/newTrip", function (request, response) {
  const body = request.body;
  console.log(body);
  const query = db.query(
    `INSERT INTO travel_journal ( destination,
    date_of_visit,
    stay_length,
    favourite_experience,
    visit_again,
    general_thoughts) VALUES($1, $2, $3, $4, $5, $6)`,
    [
      body.destination,
      body.date_of_visit,
      body.stay_length,
      body.favourite_experience,
      body.visit_again,
      body.general_thoughts,
    ]
  );
  response.json(query);
});

//setting up a route to READ data from the database
app.get("/trips", async (req, res) => {
  // query database
  const query = await db.query(`SELECT * FROM travel_journal`);
  //parse the query into JSON
  const data = res.json(query.rows);
  console.log(data);
});

app.delete("/trips/:id", async (req, res) => {
  const id = req.params.id;

  const result = await getTripById(id);

  const tripId = result.rows[0].id;

  await db.query(`DELETE FROM travel_journal WHERE id = $1`, [tripId]);

  res.json({ message: "hello" });
});

const getTripById = async (tripId) => {
  const result = await db.query(`SELECT * FROM travel_journal WHERE id = $1`, [
    tripId,
  ]);
  return result;
};
