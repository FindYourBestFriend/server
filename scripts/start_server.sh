#!/bin/bash

#give permission for everything in the portfolio directory
sudo chmod -R 777 /home/ec2-user/portfolio

#navigate into our working directory where we have all our github files
cd /home/ec2-user/portfolio

#install node modules
npm install

#build app
npm run build

#typeorm run migrations
npm run typeorm:run

#start our node app in the background
pm2 reload main
