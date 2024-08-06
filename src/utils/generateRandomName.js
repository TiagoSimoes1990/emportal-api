const crypto = require('crypto')

const generateRandomName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = generateRandomName;