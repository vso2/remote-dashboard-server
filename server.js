import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io'
import { createServer } from "http";


const hostname = 'localhost'
const port = 8000

const exp = express()

exp.use(cors())
exp.use(express.json())

const server = createServer(exp)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }})



export {
  io,
  server
}