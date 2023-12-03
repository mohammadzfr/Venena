## Commands

After pushing code to Github, make sure to update the server with the following:

`ssh <user@ip> 'cd ~/Venena && git pull && npm install && nohup npm start > /dev/null 2>&1 &'`

This will first connect to the server, pull the new changes and install dependencies, and finally run `npm start` in the background using `nohup`

Taking down the node instance is a little more complicated since there are no logs. First use the following query to find the background PID: 

`ps aux | grep node`

after finding the PID, kill the process with `kill <PID>`