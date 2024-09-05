CREATE TABLE product_catalog_emb_v2 (
  id       text PRIMARY KEY,
  emb      vector<float, 384>,
  title    text,
  tags     SET<TEXT>,
  metadata MAP<TEXT,TEXT>
);

CREATE CUSTOM INDEX product_catalog_emb_v2_vector_idx 
  ON product_catalog_emb_v2 (emb) 
  USING 'StorageAttachedIndex'
   WITH OPTIONS = {'similarity_function': 'DOT_PRODUCT', 'source_model': 'bert'};

CREATE CUSTOM INDEX IF NOT EXISTS product_catalog_emb_v2_tags_idx 
  ON product_catalog_emb_v2 (tags) 
  USING 'StorageAttachedIndex';

CREATE CUSTOM INDEX IF NOT EXISTS product_catalog_emb_v2_metadata_idx 
  ON product_catalog_emb_v2 (ENTRIES(metadata) ) 
  USING 'StorageAttachedIndex';

CREATE CUSTOM INDEX product_catalog_emb_v2_title_idx
  ON product_catalog_emb_v2(title)
  USING 'StorageAttachedIndex' 
  WITH OPTIONS = { 'index_analyzer': 'brazilian' }