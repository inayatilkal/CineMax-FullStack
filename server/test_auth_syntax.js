import { protectAdmin } from './middleware/auth.js';

console.log("Successfully imported protectAdmin:", typeof protectAdmin);

if (typeof protectAdmin !== 'function') {
    console.error("protectAdmin is not a function!");
    process.exit(1);
}

console.log("Syntax check passed.");
