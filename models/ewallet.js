const axios = require("axios");

module.exports = class ewallet {
    static authenticate(ename, password) {
        console.info(`Authenticating E-wallet id ...`);
        const EWALLET_URL_AUTHENTICATE = process.env.EWALLET_URL_AUTHENTICATE;
        console.debug(
            `Using E-wallet URL: ${EWALLET_URL_AUTHENTICATE}`
        );
        return axios.post(EWALLET_URL_AUTHENTICATE, { username: ename, password: password });
    }

    static order(ename, transactionId, amount) {
        console.info(`Debiting from E-wallet ...`);
        const EWALLET_URL_ORDER = process.env.EWALLET_URL_ORDER;
        console.debug(
            `Using E-wallet URL: ${EWALLET_URL_ORDER}`
        );
        return axios.post(EWALLET_URL_ORDER, { username: ename, transactionId: transactionId, amount: amount });
    }
    static prepare(transactionId) {
        console.info(`Preparing... ${transactionId} in E-wallet`);
        const EWALLET_URL_PREPARE = process.env.EWALLET_URL_PREPARE;
        console.debug(
            `Using E-wallet URL: ${EWALLET_URL_PREPARE}`
        );

        return axios.post(EWALLET_URL_PREPARE, { transactionId: transactionId });
    }
    static commit(transactionId) {
        console.info(`Commiting... ${transactionId} in E-wallet`);
        const EWALLET_URL_COMMIT = process.env.EWALLET_URL_COMMIT;
        console.debug(
            `Using E-wallet URL: ${EWALLET_URL_COMMIT}`
        );

        return axios.post(EWALLET_URL_COMMIT, { transactionId: transactionId });
    }
    static rollback(transactionId) {
        console.info(`Rolling back... ${transactionId} in E-wallet`);
        const EWALLET_URL_ROLLBACK = process.env.EWALLET_URL_ROLLBACK;
        console.debug(
            `Using E-wallet URL: ${EWALLET_URL_ROLLBACK}`
        );
        return axios.post(EWALLET_URL_ROLLBACK, { transactionId: transactionId });
    }
};
