# workflow-database

Small, simple JSON file-based database for rapidly launching small projects requiring simple data storage.

---

## Installation

```bash
npm install workflow-database
```

---

## Usage

```javascript
const Database = require("workflow-database");

// Initialize database
const db = new Database("data");

// Insert a document
db.insertOne("users", { name: "Alice" });

// Find a document by ID
const user = db.findById("users", "123abc");

// Update a document
db.updateById("users", "123abc", { name: "Alice Smith" });

// Delete a document
db.deleteById("users", "123abc");
```

---

## Features

- 📦 **Zero dependencies**
- ⚡️ **Fast and lightweight**
- 📁 **JSON file-based storage**
- 🚀 **Ideal for prototypes and small apps**

---

## Author

- **Adam Ballinger**

---

## License

ISC
