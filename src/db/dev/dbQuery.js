import pool from './pool';

export default {
    /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
    query(querText, params){
        return new Promise((resolve, reject) => {
            pool.query(querText, params)
                .then((res) => {
                    resolve(res);                    
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }
}