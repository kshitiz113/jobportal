import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234", 
  database: "job",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export default pool;




