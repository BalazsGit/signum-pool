ALTER TABLE miners ADD effective_total_capacity DOUBLE DEFAULT(0.0);

ALTER TABLE miners ADD effective_shared_capacity DOUBLE DEFAULT(0.0);

ALTER TABLE miners ADD boosted_total_capacity DOUBLE DEFAULT(0.0);

ALTER TABLE miners ADD boosted_shared_capacity DOUBLE DEFAULT(0.0);
