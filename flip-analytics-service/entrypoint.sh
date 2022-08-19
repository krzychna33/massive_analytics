echo $NODE_DEBUG;

if ["$NODE_DEBUG" == "true"];
  then
    npm run start:debug
  else
    npm run start:dev
fi