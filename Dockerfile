FROM node:latest

WORKDIR /app

CMD npx prisma db push && npm run dev