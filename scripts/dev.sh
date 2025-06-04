#!/bin/bash

caddy run &
docker compose up &
bun dev &

wait
