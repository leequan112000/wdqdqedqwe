-- CreateTable
CREATE TABLE "user_pseudonyms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "country_code" TEXT,

    CONSTRAINT "user_pseudonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudonyms_user_id_key" ON "user_pseudonyms"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudonyms_email_key" ON "user_pseudonyms"("email");

-- AddForeignKey
ALTER TABLE "user_pseudonyms" ADD CONSTRAINT "user_pseudonyms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create a function to run the data migration
CREATE OR REPLACE FUNCTION migrate_user_data()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT * FROM users
    LOOP
        INSERT INTO user_pseudonyms (user_id, email, first_name, last_name, phone_number, country_code)
        VALUES (
            user_record.id,
            user_record.email,
            user_record.first_name,
            user_record.last_name,
            user_record.phone_number,
            user_record.country_code
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_user_data();

-- Optionally, drop the function after use
DROP FUNCTION migrate_user_data();