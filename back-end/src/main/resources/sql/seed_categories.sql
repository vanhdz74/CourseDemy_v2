CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
    ('Web Development'),
    ('Frontend'),
    ('Backend'),
    ('Fullstack'),
    ('Mobile Development'),
    ('Data Science'),
    ('Artificial Intelligence'),
    ('Machine Learning'),
    ('DevOps'),
    ('Database'),
    ('Cyber Security'),
    ('Cloud Computing'),
    ('UI/UX Design'),
    ('Game Development'),
    ('Programming Basics')
ON CONFLICT (name) DO NOTHING;
