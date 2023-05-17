let VLO = ''

function python(vlo){
    VLO = vlo
    Konekti.uses('hypermedia')
}

function KonektiMain(){
    var text = {'plugin':'latex', 'setup':["info", VLO.info, {'width':'100%', 'height':'fit', 'overflow':'auto'}]}
    var audio = VLO.audio
    if(audio!==undefined) audio = {'plugin':'media', 'setup':["mediacontrol", "audio", "mp3", VLO.audio]}
    var left = (audio!=undefined)?[audio,text]:[text]
    left = {'plugin':'raw', 'setup':['explain', left, {'style':'width:100%;height:100%;'}]}
    var viewer = {'plugin':'python', 'setup':["viewer", VLO.ide.server, 
        VLO.modules, {'header':{'title':VLO.ide.title}, 'layout':'row', 'terminal':{'class':' w3-black '}, 'main':{'class':'w3-teal', 'style':'width:100%;height:100%;'}}]}

    var control = {'plugin':'split', 'setup':['coderviewer', 'col', 50, left, viewer, {'style':'width:100%;height:100%;'}]}

    var scripts = VLO.scripts

    Konekti.hypermedia('book', control, 'mediacontrol', scripts, {'style':'width:100%;height:100%;'})
}