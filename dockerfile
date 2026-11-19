FROM postgres:17

# Installer pg_cron til version 17
RUN apt-get update \
    && apt-get install -y postgresql-17-cron \
    && rm -rf /var/lib/apt/lists/*