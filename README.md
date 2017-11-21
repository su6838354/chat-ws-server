# chat-ws-server
提供chat聊天服务，包括消息推送，状态展示，实时会话

###技术栈
- socket.io　websocket协议
- redis　分布式会话
- kafka
- haproxy 　定向负载均衡，健康检查
- docker-compose 部署管理


### 构建服务 & 运行服务    

- haproxy


    docker build -t ws_server_haproxy:latest .
    docker push ws_server_haproxy:latest
    
    -server
    docker pull ws_server_haproxy:latest
    docker run --name ws_server_haproxy_1 --link 172.19.1.1:3000:server-s1 --link 172.19.1.1:3001:server-s2 --link 172.19.1.1:3002:server-s3 --link 172.19.1.1:3003:server-s4 --link 172.19.1.1:3004:server-s5 --link 172.19.1.1:3005:server-s6 --link 172.19.1.1:3006:server-s7 --link 172.19.1.1:3007:server-s8 -p 2999:80 -d ws_server_haproxy

- redis
  
  
    docker pull ws-server_redis
    docker run --name redis -p 6379:6379 -d ws-server_redis
    
- server


    cd server   
    docker build -t ws_server-s1 .
    docker push ws_server-s1
    
    -server
    docker pull ws_server-s1
    docker run --name server-3000-3003 -d -p 3000:3000 -p 3001:3001 -p:3002:3002 -p 3003:3003 ws_server-s1
    docker run --name server-3004-3007 -d -p 3004:3004 -p 3005:3005 -p:3006:3006 -p 3007:3007 ws_server-s1
    

- zookeeper&kafka

    不用docker，　手启
 

    #docker pull zookeeper
    #docker run --name zookeeper -p 2181:2181 -d zookeeper
    


    