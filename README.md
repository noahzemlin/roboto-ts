# Roboto TS

This is the long awaited (by nobody) TypeScript rewrite of the infamous Mr. Roboto Discord bot.

## Run Instructions

- Clone the repo.
- Copy `bot/.env.example` to `bot/.env` and edit any necessary variables.
- ```sudo docker-compose up -d``` for dev
  - Run ```npm install``` in each directory first
- ```sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d``` for prod