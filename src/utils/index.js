const {JWT} = require('google-auth-library')

const getFirebaseAccessToken = async () => {
    return new Promise(function(resolve, reject) {
        const key = require('../../firebase_pk.json');
        const jwtClient = new JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES= process.env.FIREBASE_SCOPES,
            null
        )
        jwtClient.authorize(function(err, tokens) {
            if (err) {
            reject(err);
            return;
            }
            resolve(tokens.access_token);
        })
    })
}

const convertTime = () => {
    const date = new Date(); // Create a new Date object
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours() + 7).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Format: hh:mm:ss dd/MM/yyyy
    const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    return formattedDate;
}

module.exports = {
    getFirebaseAccessToken,
    convertTime
}