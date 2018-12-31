const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/**
 * Creates hash from plain text
 * @param {String} password
 * @returns {String}
 */
async function createHash(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Return true/false if same
 * @param {String} password
 * @param {String} hash
 * @returns {Boolean}
 */
async function compareHash(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    createHash,
    compareHash
};
