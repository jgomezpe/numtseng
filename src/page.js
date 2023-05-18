let VLO = ''

function page(vlo={}){
    vlo.info=Konekti.vc('hiddeninfo').innerHTML
    VLO = vlo
    Konekti.uses('hypermedia')
}

function KonektiMain(){
    var text = {'plugin':'latex', 'setup':["info", VLO.info, {'width':'100%', 'height':'fit'}]}
    var audio = VLO.audio
    if(audio!==undefined) audio = {'plugin':'media', 'setup':["mediacontrol", "audio", "mp3", VLO.audio]}
    var control = (audio!=undefined)?[audio,text]:[text]
    control = {'plugin':'raw', 'setup':['explain', control, {'style':'width:100%;height:100%;'}]}
    var scripts = VLO.scripts

    Konekti.hypermedia('book', control, 'mediacontrol', scripts, {'style':'width:100%;height:100%;'})
}