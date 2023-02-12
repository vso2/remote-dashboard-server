function handleList(data) {
    const raw = data.split("||")
    const directories = raw[0]
    const filesAndDirectories = raw[1]
    const path = raw[2]
    //Directories
    let dirs = directories.split('\n')
    dirs.shift()
    dirs = dirs.map(el => el.substr(2).trim())
    //files
    const files = filesAndDirectories.split('\n').map(el => el.trim()).filter((val)=> {
        if (val === '' || val === '\n') return false
        if (dirs.includes(val)) return false
        return true
    })

    return {dirs, files, path}
}


function handlerOut(data, currentCommand) {
    if (currentCommand === 'loadPage') {
        const val = handleList(data)
        const response = {command: currentCommand, body: val}
        return response
    } else {

        const response = {command: currentCommand, body: data}
        return response
    }
}


function handlerErr(data,currentCommand) {
    
    const response = {command: currentCommand, body: data}
    return response
}

export {
    handlerOut,
    handlerErr
}