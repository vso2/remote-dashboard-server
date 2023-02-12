class Queue {
    
    constructor() {
        this.queue = []
    }

    put(value) {
        this.queue.push(value)
    }

    pop() {
        this.queue.shift() 
    }

    get() {
        return this.queue[this.queue.length - 1]
    }

    consume() {
        const val = this.getCommand()
        this.popCommand()
        return val
    }

    flush() {
        this.queue = []
    }

}

export {
    Queue
}