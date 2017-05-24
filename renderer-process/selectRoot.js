const ipc = require('electron').ipcRenderer

const $ = require('jquery');
jQuery = $;
const ztree = require('ztree');

const selectDirBtn = $('#selectRoot')[0]

selectDirBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})

ipc.on('selected-directory', function(event, path) {
    var nodes = JSON.parse(path)
    var ztreeObj = $.fn.zTree.init($("#ztreeDiv"), {
        view: {
            selectedMulti: false,
            showIcon: true,
            showLine: true,
            showTitle: true,
            txtSelectedEnable: false,
            autoCancelSelected: true,
            dblClickExpand: true,
            expandSpeed: "fast"
        },
        callback: {
            onClick: function(e, id, node) {
                ipc.send('openByTypora', node.fileUrl)
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        check: {
            enable: false,
            chkboxType: {
                "Y": "",
                "N": ""
            }
        }
    }, nodes);
    ztreeObj.expandAll(true);
})
