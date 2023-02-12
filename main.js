import { Queue } from './Buffer/buffer.js';
import { io, server } from './server.js';
import { Shell } from './shell/shell.js';

var shellIsRunning = false

var stdin = new Queue()
var stdout = new Queue()
var stderr = new Queue()

var shell = new Shell(stdin,stdout,stderr)

shell.initShell()

io.on('connection', (socket) => {

    console.log('CONNECTED')
    if(!shellIsRunning) {
        shell.initShell()
        shellIsRunning = true
    }

    shell.setSocket(socket)

    socket.on('loadPage', () => {
        shell.process('loadPage')
    })

    socket.on('openFile', (file)=> {
        shell.process('openFile', [file])
    })

    socket.on('updateFile', (data)=> {
        shell.process('updateFile', data)
    })

    socket.on('createFile', (file) => {
        shell.process('createFile', [file])
    })

    socket.on('remove', (file) => {
        shell.process('remove', [file])
    })

    socket.on('openDirectory', (dir)=> {
        shell.process('openDirectory', [dir])
    })

    socket.on('makeDirectory', (dir)=> {
        shell.process('makeDirectory', [dir])
    })


    socket.on('disconnect', ()=> {
        console.log('DISCONNECTED\n\n')
        shell.setSocket('')
    })

    //Entry points
})

const PORT = 8080

server.listen(PORT, ()=> {
    console.log(`Server is listening port ${PORT}`)
})
