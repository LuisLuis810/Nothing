#!/bin/bash
while true; do
  node deploy-commands.js
  node bot.js
  echo "Bot stopped. Restarting in 5 seconds..."
  sleep 5
done
