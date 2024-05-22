const express = require('express');
const router = express.Router();
const client = require('./db');

router.post('/search', async (req, res) => {
    const { emb, limit } = req.body;

    const query = `SELECT id FROM {process.env.DSE_VECTOR_TABLE}
    ORDER BY emb ANN OF :embedding LIMIT ${limit}`;

    try {
        const result = await client.execute(query, { embedding: new Float32Array(emb) }, { prepare: true });
        res.json(result.rows.map(e => e.id));
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
