#!/usr/bin/env bash
set -e

create_database() {
  local database="$1"

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
    SELECT 'CREATE DATABASE "$database"'
    WHERE NOT EXISTS (
      SELECT FROM pg_database WHERE datname = '$database'
    )\gexec
EOSQL
}

create_database "${USER_SERVICE_DB_NAME:-user_service_db}"
create_database "${COURSE_SERVICE_DB_NAME:-course_service_db}"
create_database "${ORDER_SERVICE_DB_NAME:-order_service_db}"
create_database "${PAYMENT_SERVICE_DB_NAME:-payment_service_db}"
create_database "${ENROLLMENT_SERVICE_DB_NAME:-enrollment_service_db}"
create_database "${NOTIFICATION_SERVICE_DB_NAME:-notification_service_db}"

# Tạo các schema tương ứng trong database postgres (khi service dùng currentSchema)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
  CREATE SCHEMA IF NOT EXISTS "${USER_SERVICE_DB_NAME:-user_service_db}";
  CREATE SCHEMA IF NOT EXISTS "${COURSE_SERVICE_DB_NAME:-course_service_db}";
  CREATE SCHEMA IF NOT EXISTS "${ORDER_SERVICE_DB_NAME:-order_service_db}";
  CREATE SCHEMA IF NOT EXISTS "${PAYMENT_SERVICE_DB_NAME:-payment_service_db}";
  CREATE SCHEMA IF NOT EXISTS "${ENROLLMENT_SERVICE_DB_NAME:-enrollment_service_db}";
  CREATE SCHEMA IF NOT EXISTS "${NOTIFICATION_SERVICE_DB_NAME:-notification_service_db}";
EOSQL
