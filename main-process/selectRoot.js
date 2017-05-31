const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const fs = require('fs');
const path = require("path");
const execSync = require('child_process').exec;
const {
    shell
} = require('electron')
var filesArr = [];
ipc.on('open-file-dialog', function(event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function(files) {
        if (files) {
            var filesArr = [];
            var path = files + '';
            readFile(path, '', filesArr);
            var filesArrStr = JSON.stringify(filesArr)
            event.sender.send('selected-directory', filesArrStr);

        }
    })
})

ipc.on('openByTypora', function(event, url) {
    open(url);
})


function open(url) {
    shell.openItem(url)
    // 通过命令行来启动程序
    // const getIdCMD = 'ps x | grep Typora';
    // execSync(getIdCMD, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(error)
    //         process.exit()
    //     }
    //     var i = stdout.indexOf(' ');
    //     var pid = stdout.substring(0, i);
    //     const kils = 'kill ' + pid;
    //     execSync(kils, (error, stdout, stderr) => {
    //         if (error) {
    //             console.log(error)
    //         }
    //         const openCMD = 'open -a Typora  ' + url;
    //         execSync(openCMD, (error, stdout, stderr) => {
    //             if (error) {
    //                 console.log(error)
    //             }
    //         })
    //     })
    // })
}

//遍历读取文件
function readFile(path, pid, filesArr) {
    files = fs.readdirSync(path);
    files.forEach(walk);

    function walk(file) {
        var newPath = path + '/' + file;

        var newNode = {
            pId: pid,
            id: file,
            name: file,
            title: file,
            fileUrl: newPath
        }

        states = fs.statSync(newPath);
        if (states.isDirectory()) {
            readFile(path + '/' + file, file, filesArr);
            filesArr.push(newNode);
        } else {
            var i = file.indexOf('md');
            var l = file.length;
            if (i == (l - 2)) {
                filesArr.push(newNode);
            }
        }
    }
}
