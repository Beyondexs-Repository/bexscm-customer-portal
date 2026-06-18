ALTER TABLE roles
  ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'internal' AFTER role_name;

UPDATE roles
SET user_type = 'customer'
WHERE role_key IN ('store-manager', 'store-employee');

UPDATE users u
INNER JOIN roles r ON u.role_id = r.id
SET u.user_type = r.user_type;
