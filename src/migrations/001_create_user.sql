CREATE TABLE
    department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        parent_id INTEGER REFERENCES department (id)
    );

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password_hash VARCHAR(200),
        dept_id INTEGER REFERENCES department (id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    permission (
        id SERIAL PRIMARY KEY, 
        name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    role (
        id SERIAL PRIMARY KEY, 
        name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    role_permission (
        role_id INTEGER REFERENCES role (id),
        permission_id INTEGER REFERENCES permission (id),
        PRIMARY KEY (role_id, permission_id)
    );

CREATE TABLE
    user_role (
        user_id INTEGER REFERENCES users (id),
        role_id INTEGER REFERENCES role (id),
        PRIMARY KEY (role_id, user_id)
    );

CREATE TABLE
    folder (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        parent_id INTEGER REFERENCES folder (id),
        dept_id INTEGER REFERENCES department (id),
        created_by INTEGER REFERENCES users (id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    retention_policy (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        duration_days INTEGER,
        action VARCHAR(50)
    );

CREATE TABLE
    document (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        folder_id INTEGER REFERENCES folder (id),
        retention_policy_id INTEGER REFERENCES retention_policy (id),
        status VARCHAR(50) DEFAULT 'draft',
        created_by INTEGER REFERENCES users (id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    document_version (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        document_id INTEGER REFERENCES document (id),
        file_path VARCHAR(200) NOT NULL,
        file_size INTEGER,
        created_by INTEGER REFERENCES users (id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    metadata_field (
        id SERIAL PRIMARY KEY,
        field_name VARCHAR(100) NOT NULL,
        data_type VARCHAR(50) DEFAULT 'text'
    );

CREATE TABLE
    metadata_value (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        field_id INTEGER REFERENCES metadata_field (id) ON DELETE CASCADE,
        field_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    tags (
        id SERIAL PRIMARY KEY,
        tag_name VARCHAR(100) NOT NULL
    );

CREATE TABLE
    document_tags (
        tag_id INTEGER REFERENCES tags (id) ON DELETE CASCADE,
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        PRIMARY KEY (document_id, tag_id)
    );

CREATE TABLE
    workflow (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    workflow_step (
        id SERIAL PRIMARY KEY,
        workflow_id INTEGER REFERENCES workflow (id) ON DELETE CASCADE,
        step_order INTEGER NOT NULL,
        role_id INTEGER REFERENCES role (id),
        description VARCHAR(200)
    );

CREATE TABLE
    document_workflow_state (
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        workflow_id INTEGER REFERENCES workflow (id),
        current_step_id INTEGER REFERENCES workflow_step (id),
        status VARCHAR(100) DEFAULT 'PENDING',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (document_id, workflow_id)
    );

CREATE TABLE
    approval (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        step_id INTEGER REFERENCES workflow_step (id),
        user_id INTEGER REFERENCES users (id),
        remarks TEXT,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    comment (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users (id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    audit_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id),
        action VARCHAR(50),
        resource_type VARCHAR(50),
        resource_id INTEGER,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    archive_record (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        document_id INTEGER REFERENCES document (id),
        archived_by INTEGER REFERENCES users (id),
        archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    external_share (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES document (id) ON DELETE CASCADE,
        shared_by INTEGER REFERENCES users (id),
        share_token VARCHAR(255) UNIQUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


SELECT * FROM users AS u INNER JOIN document AS doc ON u.id = doc.id;