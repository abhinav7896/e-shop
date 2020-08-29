const axios = require("axios");

module.exports = class warehouse {
    static order(pName, transactionId, qty) {
        console.info(`Deducting quantity from warehouse...`);
        const WAREHOUSE_URL_ORDER = process.env.WAREHOUSE_URL_ORDER;
        console.debug(
            `Using Warehouse URL: ${WAREHOUSE_URL_ORDER}`
        );
        var data = JSON.stringify({ "title": pName, "quantity": qty, "transactionId": transactionId });
        var config = {
            method: 'post',
            url: WAREHOUSE_URL_ORDER,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(config);
    }
    static fetchAllProducts() {
        console.info(`Fetching all products...`);
        const WAREHOUSE_URL_FETCHALL = process.env.WAREHOUSE_URL_FETCHALL;
        console.debug(
            `Using Warehouse URL: ${WAREHOUSE_URL_FETCHALL}`
        );
        return axios.get(WAREHOUSE_URL_FETCHALL);
    }
    static prepare(transactionId) {
        console.info(`Preparing... ${transactionId} in Warehouse`);
        const WAREHOUSE_URL_PREPARE = process.env.WAREHOUSE_URL_PREPARE;
        console.debug(
            `Using Warehouse URL: ${WAREHOUSE_URL_PREPARE}`
        );

        return axios.post(WAREHOUSE_URL_PREPARE, { transactionId: transactionId });
    }
    static commit(transactionId) {
        console.info(`Commiting... ${transactionId} in Warehouse`);
        const WAREHOUSE_URL_COMMIT = process.env.WAREHOUSE_URL_COMMIT;
        console.debug(
            `Using Warehouse URL: ${WAREHOUSE_URL_COMMIT}`
        );

        return axios.post(WAREHOUSE_URL_COMMIT, { transactionId: transactionId });
    }
    static rollback(transactionId) {
        console.info(`Rolling back... ${transactionId} in Warehouse`);
        const WAREHOUSE_URL_ROLLBACK = process.env.WAREHOUSE_URL_ROLLBACK;
        console.debug(
            `Using Warehouse URL: ${WAREHOUSE_URL_ROLLBACK}`
        );
        return axios.post(WAREHOUSE_URL_ROLLBACK, { transactionId: transactionId });
    }
};
