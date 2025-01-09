FROM node:22

WORKDIR /app

CMD npx prisma db push && npm run dev