# NodeJS Vector Search API

Sample code for deploying a API that performs Vector Search on a DataStax Enterprise table

# API

endpoint: /api/search
parameters:
- emb: Array of Floats with the embedding generated by a model
- limit: Number of records to return