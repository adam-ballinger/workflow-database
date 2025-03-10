/**
 * @fileoverview Small, simple JSON file-based database for
 * rapidly launching small projects requiring simple data storage.
 *
 * @module database
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const wdata = require("workflow-data");

/**
 * Generates a random hex string
 * @param {number} bytes - The number of bytes the hex string should represent
 * @returns {string} A hex string
 */
function randomHex(bytes) {
  const buffer = new Uint8Array(bytes); // 12 bytes = 24 hex characters
  crypto.getRandomValues(buffer);

  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Ensures a directory exists before initializing or writing.
 */
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Checks if a string contains only alphabetical characters (A-Z, a-z).
 * @param {string} str - The input string to validate.
 * @returns {boolean} - Returns true if the string is alphabetical, otherwise false.
 */
function validateAlphabetical(str) {
  return /^[A-Za-z]+$/.test(str);
}

/**
 * Writes JSON data to the file.
 * @param {any} data - The JSON data to write.
 */
function writeFile(filepath, data) {
  console.log(filepath);
  ensureDirectoryExists(path.dirname(filepath));
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, jsonData, "utf8");
}

/**
 * Reads and returns the JSON data from the file.
 * @returns {any} - The parsed JSON object or an empty array if the file does not exist.
 */
function readFile(filepath) {
  if (!fs.existsSync(filepath)) {
    return [];
  }

  try {
    const jsonData = fs.readFileSync(filepath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading file ${filepath}:`, error);
    return [];
  }
}

/**
 * Validates an Object is ready to be implemented as a document
 * @param {Object} document
 * @returns {Object} the validated document
 */
function validateDoc(document) {
  if (
    typeof document !== "object" ||
    document === null ||
    Array.isArray(document)
  ) {
    throw new TypeError(
      "Failed to validate document, received a non-object value."
    );
  }
  if (!document._id) {
    document._id = randomHex(8);
  }
  return document;
}

class Database {
  /**
   * Creates an instance of Database.
   * @param {string} directory - The path to database directory.
   */
  constructor(directory) {
    ensureDirectoryExists(directory);
    this.directory = directory;
  }

  /**
   * Saves a new document into a collection.
   * @param {string} collection - The collection the document belongs to.
   * @param {Object} document - The document to be saved.
   */
  insertOne(collection, document) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    if (
      typeof document !== "object" ||
      document === null ||
      Array.isArray(document)
    ) {
      throw new TypeError(
        "Expected an object for 'document', but received a non-object value."
      );
    }
    document = validateDoc(document);
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    data.push(document);
    writeFile(filepath, data);
  }

  /**
   * Saves multiple documents into a collection.
   * @param {string} collection - The collection name.
   * @param {Object[]} docs - An array of documents to save.
   * @throws {TypeError} If docs is not an array of objects.
   */
  insertMany(collection, docs) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    if (
      !Array.isArray(docs) ||
      !docs.every(
        (document) => typeof document === "object" && document !== null
      )
    ) {
      throw new TypeError("Expected an array of objects for 'docs'.");
    }
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    for (let document of docs) {
      document = validateDoc(document);
      data.push(document);
    }
    writeFile(filepath, data);
  }

  /**
   * Finds a document in a collection by its ID.
   * @param {string} collection - The collection name.
   * @param {string} _id - The ID of the document to find.
   * @returns {Object|undefined} - The document if found, otherwise undefined.
   */
  findById(collection, _id) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    return wdata.filter(data, { _id })[0];
  }

  /**
   * Finds multiple documents in a collection matching a filter.
   * @param {string} collection - The collection name.
   * @param {Object} filter - The filter criteria.
   * @returns {Object[]} - An array of matching documents.
   */
  findMany(collection, filter) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    return wdata.filter(data, filter);
  }

  /**
   * Finds a single document in a collection matching a filter.
   * @param {string} collection - The collection name.
   * @param {Object} filter - The filter criteria.
   * @returns {Object|undefined} - The first matching document or undefined if none found.
   */
  findOne(collection, filter) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    return wdata.filter(data, filter)[0];
  }

  /**
   * Updates a document in a collection by its ID.
   * @param {string} collection - The collection name.
   * @param {string} _id - The ID of the document to update.
   * @param {Object} updates - The updates to apply.
   */
  updateById(collection, _id, updates) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    wdata.update(data, { _id }, updates);
    writeFile(filepath, data);
  }

  /**
   * Updates multiple documents in a collection matching a filter.
   * @param {string} collection - The collection name.
   * @param {Object} filter - The filter criteria.
   * @param {Object} updates - The updates to apply.
   */
  update(collection, filter, updates) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    wdata.update(data, filter, updates);
    writeFile(filepath, data);
  }

  /**
   * Deletes multiple documents in a collection matching a filter.
   * @param {string} collection - The collection name.
   * @param {Object} filter - The filter criteria.
   */
  delete(collection, filter) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    wdata.erase(data, filter);
    writeFile(filepath, data);
  }

  /**
   * Deletes a document in a collection by its ID.
   * @param {string} collection - The collection name.
   * @param {string} _id - The ID of the document to delete.
   */
  deleteById(collection, _id) {
    if (!validateAlphabetical(collection)) throw CollectionError;
    const filepath = `${this.directory}/${collection}.json`;
    const data = readFile(filepath);
    wdata.erase(data, { _id });
    writeFile(filepath, data);
  }
}

module.exports = Database;
