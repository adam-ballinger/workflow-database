const Database = require("../index.js");

const db = new Database("__tests__/database");

const family = [
  {
    name: "Alice",
    age: 35,
    relation: "mother",
    occupation: "Teacher",
  },
  {
    name: "Ben",
    age: 37,
    relation: "father",
    occupation: "Engineer",
  },
  {
    name: "Olivia",
    age: 10,
    relation: "daughter",
    occupation: "Student",
  },
  {
    name: "Liam",
    age: 7,
    relation: "son",
    occupation: "Student",
  },
  {
    name: "Max",
    age: 4,
    relation: "son",
    occupation: "Preschooler",
  },
];

db.delete("fam", {});
db.insertMany("fam", family);
db.delete("fam", { name: "Liam" });
db.update("fam", { name: "Max" }, { name: "Maxwell" });
const sons = db.findMany("fam", { relation: "son" });

console.log(sons);
