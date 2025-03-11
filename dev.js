// dev.js
import Database from "./index.js"; // Adjust the path if necessary

// Initialize a new database in the "data" directory
const db = new Database("./dev-database");

// Insert a single user
console.log("=== Insert One ===");
db.insertOne("users", { name: "Alice" });
let user = db.findOne("users", { name: "Alice" });
console.log("Inserted user:", user);

// Update the inserted user
console.log("=== Update User ===");
db.updateById("users", user._id, { name: "Alice Smith" });
user = db.findById("users", user._id);
console.log("Updated user:", user);

// Insert multiple users
console.log("=== Insert Many ===");
db.insertMany("users", [{ name: "Bob" }, { name: "Charlie" }]);
const allUsers = db.findMany("users", {});
console.log("All users:", allUsers);

// Delete a user by ID
console.log("=== Delete By ID ===");
db.deleteById("users", user._id);
console.log("Remaining users:", db.findMany("users", {}));
