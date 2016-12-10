FROM node:0.10

COPY output/os.linux.x86_64/bundle /app

RUN cd /app/programs/server && npm install

ENV PORT=3000
ENV MONGO_URL=mongodb://mongo.swervesoft.net:27017/pcars_leaderboard
ENV ROOT_URL=http://pcars-leaderboard.swervesoft.com

WORKDIR /app
CMD ["node", "main.js"]