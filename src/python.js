let VLO = ''

function modules(){
    var m = []
    var source = Konekti.vc('source')
    for(var i=0; i<source.children.length; i++) {
        var c = source.children[i].innerHTML
        c = c.substring(1,c.length)
        m.push({"name":source.children[i].id+".py", "content":c});
    }
    return m
}

function python(vlo={}){
    vlo.ide={
        "server":"https://numtseng.com/server/",
        "title":"Ambiente de desarrollo"
    }
    vlo.info=Konekti.vc('infotext').innerHTML
    vlo.modules = modules()
    VLO = vlo
    Konekti.uses('hypermedia')
}

function KonektiMain(){
    var text = {'plugin':'latex', 'setup':["info", VLO.info, {'width':'100%', 'height':'fit'}]}
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