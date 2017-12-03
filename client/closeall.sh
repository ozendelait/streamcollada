ps aux | awk '/node/{print $2}' | xargs kill -9
