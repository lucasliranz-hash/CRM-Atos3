DO $seed$
BEGIN
  -- Fix admin and seller users that were missing required GoTrue columns
  UPDATE auth.users
  SET 
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
    created_at = COALESCE(created_at, NOW()),
    updated_at = NOW(),
    encrypted_password = crypt('senha123', gen_salt('bf'))
  WHERE email IN ('admin@atos3.com', 'vendedor@loja1.com');

  -- Fix main admin user
  UPDATE auth.users
  SET 
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
    created_at = COALESCE(created_at, NOW()),
    updated_at = NOW(),
    encrypted_password = crypt('securepassword123', gen_salt('bf'))
  WHERE email = 'lucasliranz@gmail.com';
END $seed$;
