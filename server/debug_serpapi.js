import { createRequire } from "module";
const require = createRequire(import.meta.url);
const GoogleSearch = require("google-search-results-nodejs");

console.log("Type of GoogleSearch:", typeof GoogleSearch);
console.log("GoogleSearch export:", GoogleSearch);

try {
    const search = new GoogleSearch("test_key");
    console.log("Successfully created instance");
} catch (e) {
    console.log("Error creating instance:", e.message);
}
