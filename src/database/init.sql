CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS networks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(100),
    metadata JSONB,
    
    CONSTRAINT fk_owner 
        FOREIGN KEY(owner_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_networks_owner_id ON networks(owner_id);