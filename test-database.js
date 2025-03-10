const Database = require("./database");
const dataUtil = require("./data-util");

db = new Database("database");

const family = [
  { name: "Adam Ballinger", title: "Dad", birthday: new Date(1993, 11, 1) },
  { name: "Anna Marie", title: "Mom", birthday: new Date(1998, 0, 7) },
  { name: "Aida Marie", title: "Sister", birthday: new Date(2018, 7, 5) },
  { name: "Carter Beth", title: "Sister", birthday: new Date(2021, 10, 19) },
  { name: "John Ballinger", title: "Son", birthday: new Date(2023, 8, 2) },
];

db.insertMany("family", [family[0], family[2], family[3]]);
