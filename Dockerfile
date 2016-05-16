FROM node:0.10

# install meteor
RUN curl https://install.meteor.com/ | sh

# copy app
COPY . /src

WORKDIR /src
RUN meteor build --directory /app

# update dependencies
WORKDIR /app/bundle/programs/server
RUN npm install

ENV PORT=3000
ENV MONGO_URL=mongodb://mongo.swervesoft.net:27017/pcars_leaderboard
ENV ROOT_URL=http://pcars-leaderboard.swervesoft.com

WORKDIR /app/bundle
CMD ["node", "main.js"]