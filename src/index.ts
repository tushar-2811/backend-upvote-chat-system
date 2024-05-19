import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

const app = express();
const server = app.listen(8000 , () => {
    console.log(new Date() + `The server is running on port 8000`);
});

const wss = new WebSocketServer({server});

const users : { [key : string] : {
    room : string;
    ws : WebSocket;
}} = {};

let counter = 0;

wss.on("connection" , async(ws , req) => {
    const wsId = counter++;
    console.log(wsId);

    ws.on("message" , (message : string) => {
        const data = JSON.parse(message.toString());

        if(data.type === 'join'){
            users[wsId] = {
                room : data.payload.roomId,
                ws
            };
        }

        if(data.type === "message") {
            const roomId = users[wsId].room;
            const message = data.payload.message;


            Object.keys(users).forEach((wsId) => {
                if(users[wsId].room === roomId){
                    users[wsId].ws.send(JSON.stringify({
                        type : "message",
                        payload : {
                            message
                        }
                    }));
                }
            })


        }
    })
})

