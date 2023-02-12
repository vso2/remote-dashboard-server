import { spawn } from "child_process";
import { handlerOut, handlerErr } from "../handlers/handler.js";

const PATH = '/bin/bash'

class Shell {


    constructor(stdin, stdout, stderr) {
        this.stdin = stdin
        this.stdout = stdout
        this.stderr = stderr
    }

    setSocket(socket) {
        this.socket = socket
    }

    writeShellCommand(command) {
        this.shell.stdin.write(`${command}\n`)
    }

    process(command, args = []) {
        this.currentCommand = command
        if(command === 'loadPage') {
            this.writeShellCommand('echo "_ROUTINE || loadPage || $(find . -maxdepth 1 -type d) || $(ls) || $(pwd)"')
        } else if(command === 'openFile') {
            this.writeShellCommand(`echo "_ROUTINE || openFile || $(cat < '${args[0]}')"`)
        } else if(command === 'updateFile') {
            this.writeShellCommand(`echo "${args[0]}" > '${args[1]}' `)
        } else if(command === 'createFile') {
            this.writeShellCommand(`touch '${args[0]}' `)
        } else if(command === 'remove') {
            this.writeShellCommand(`rm -rf '${args[0]}' `)
        } else if(command === 'openDirectory') {
            this.writeShellCommand(`cd '${args[0]}' `)
        } else if(command === 'makeDirectory') {
            this.writeShellCommand(`mkdir '${args[0]}' `)
        }
    }

    sendQueuedMessages() {
        this.stdout.forEach(element => {
            this.socket.emit(element.event, element.data)
        })
        this.stderr.forEach(element => {
            this.socket.emit(element.event, element.data)
        });
        this.stdout.flush()
        this.stderr.flush()
    }

    initShell() {

        this.stdin.flush()
        this.stdout.flush()
        this.stderr.flush()
        
        this.shell = spawn(PATH, { stdio: 'pipe'})

        this.shell.stdout.on('data', (data) => {
            const value = data.toString()
            if(value.split('||')[0].trim() === '_ROUTINE') {
                const command =  value.split('||')[1].trim()
                const response = handlerOut(value.split('||').slice(2).join('||').trim(),command)
                if(this.socket) {
                    this.socket.emit(`${command}Response`, response)        
                } else {
                    this.stdout.put({event:`${command}Response`, data:response})
                }
            } else {
                const response = handlerOut(value,'custom')
                if(this.socket) {
                    this.socket.emit(`customResponse`, response)
                } else {
                    this.stdout.put({event:`customResponse`, data: response})
                }
            }
            //if (value.split('||')[0].trim()=="_ROUTINE") 
            //const response = handlerOut(data.toString(), this.currentCommand)
            //this.socket.emit(`${this.currentCommand}Response`, response)
        })

        this.shell.stderr.on('data', (data) => {
            const response = handlerErr(data.toString(), this.currentCommand)
            if (this.socket) {
                this.socket.emit('error', response)
            } else {
                this.stderr.put({event: 'error', data:response})
            }
        })

        this.shell.on('close',(code)=>{console.log('[shell] terminated :',code)})
  
        this.shell.on('error',(err)=> {console.log('ERROR', err)})

    }
}

export {
    Shell
}