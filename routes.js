const express = require('express');
const router = express.Router();
const client = require('./db');
//const { localOne } = require('cassandra-driver').types.consistencies.localOne;

router.post('/search', async (req, res) => {
    const { emb, limit } = req.body;

    const preparedQuery = `SELECT id FROM ${process.env.DSE_VECTOR_TABLE} ORDER BY emb ANN OF ? LIMIT ${limit}`;

    try {
        const result = await client.execute(preparedQuery,
            [new Float32Array(emb)],
                { 
                //    consistency: localOne, 
                    prepare: true 
                }
        );
        res.json(result.rows.map(row => row.id));
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
