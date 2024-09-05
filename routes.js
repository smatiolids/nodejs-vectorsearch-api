const express = require('express');
const router = express.Router();
const client = require('./db');

router.post('/search_text', async (req, res) => {
    const { text, limit } = req.body;

    const preparedQuery = `SELECT id, title FROM ${process.env.DSE_VECTOR_TABLE} WHERE title : ? LIMIT ${limit}`;

    try {
        const result = await client.execute(preparedQuery,
            [text],
                { 
                //    consistency: localOne, 
                    prepare: true 
                }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/search_tags', async (req, res) => {
    const { tag, limit } = req.body;

    const preparedQuery = `SELECT id, title, tags FROM ${process.env.DSE_VECTOR_TABLE} WHERE tags CONTAINS ? LIMIT ${limit}`;

    try {
        const result = await client.execute(preparedQuery,
            [tag],
                { 
                //    consistency: localOne, 
                    prepare: true 
                }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/search_metadata', async (req, res) => {
    const { key, value, limit } = req.body;

    const preparedQuery = `SELECT id, title, metadata FROM ${process.env.DSE_VECTOR_TABLE} WHERE metadata[?] = ? LIMIT ${limit}`;

    try {
        const result = await client.execute(preparedQuery,
            [key, value],
                { 
                //    consistency: localOne, 
                    prepare: true 
                }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


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

function summarizeMetadata(metadata) {
    return metadata.reduce((summary, obj) => {
      Object.keys(obj).forEach((key) => {
        if (!summary[key]) {
          summary[key] = {};
        }
        const value = obj[key];
        summary[key][value] = (summary[key][value] || 0) + 1;
      });
      return summary;
    }, {});
  }

router.post('/search_agg', async (req, res) => {
    const { emb, limit } = req.body;

    const preparedQuery = `SELECT metadata FROM ${process.env.DSE_VECTOR_TABLE} ORDER BY emb ANN OF ? LIMIT ${limit}`;

    try {
        const result = await client.execute(preparedQuery,
            [new Float32Array(emb)],
                { 
                //    consistency: localOne, 
                    prepare: true 
                }
        );
        res.json(summarizeMetadata(result.rows.map(row => row.metadata)));
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
