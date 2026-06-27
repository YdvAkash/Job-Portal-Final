#!/bin/bash

echo "Stopping existing Node.js server..."
pkill -f "node index.js"

echo "Waiting for process to terminate..."
sleep 2

echo "Starting server in the background..."
nohup node index.js > server.log 2>&1 &

echo "Server successfully restarted!"
echo "You can view the logs at: server.log"
