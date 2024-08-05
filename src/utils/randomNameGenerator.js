const crypto = require('crypto')

const randomNameGenerator = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = randomNameGenerator;