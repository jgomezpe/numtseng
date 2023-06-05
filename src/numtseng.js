let ABSOLUTE_RES_URL = "https://jgomezpe.github.io/numtseng/" // Resources are stored in github
let RELATIVE_RES_URL = ""
let SERVER_URL = "https://numtseng.com/" // Change this to your server's name
let PARENT = ''
let MAIN = ''
let ICON = ''

function numtseng(main='', parent='', rel_url='/general/', icon=''){
    PARENT = parent 
    MAIN = main
    ICON = icon
    RELATIVE_RES_URL=rel_url
    Konekti.uses('sidebar') 
}

class NumtsengClient extends MainClient{
    constructor(lang, i18n, config){
        super()
        this.page = ''
        this.lang = lang
        this.toc = config.toc
        this.i18n = i18n
        this.content = config.content
        this.topi = -1
        this.gui()
    }

    iframe(t){
        if(t.params !== undefined){
            var url = t.url
            var c = '?'
            for( var p in this.i18n[t.params] ){
                url += c + p + '=' + this.i18n[t.params][p]
                c = '&'
            }
            this.url2vlo(url)
        }
    }

    html(t){
        var x = this
        var url = t.url
        Konekti.resource.TXT( url, function(html){ this.client.txt2vlo(html) })
    }

    VLO(){
        var t = this.content[this.topic]
        if(!t.url.startsWith("https://")){
            var RES_URL = ''
            if(!t.url.startsWith('/')) RES_URL = RELATIVE_RES_URL
            t.url = ABSOLUTE_RES_URL + 'vlo/' + this.lang + RES_URL + t.url
        }
        if(t.type === undefined){
            if(t.url.indexOf('?')==-1 && t.params==null) t.type='html'
            else t.type ='iframe'
        }        
        this[t.type](t)
    }

    select(page){
        var x = this
        if( x.page != page ){
            var i=0
            while(i<x.content.length && x.content[i].id!=page) i++
            if(i<x.content.length){
                x.page = page
                x.topic = i
                if(x.content[x.topic].url == "*") window.open(page+"/index.html?page=home&lang="+x.lang, '_self')
                else if(x.content[x.topic].url == "/") window.open(SERVER_URL+PARENT+"/index.html?page=home&lang="+x.lang, '_self')
                else{
                    Konekti.dom.setURLSearchParam('page',page)
                    Konekti.dom.setURLSearchParam('lang',x.lang)
                    Konekti.daemon( function(){ return Konekti.client['vlo'] !== undefined && Konekti.vc("prev")!=null }, function(){
                        var btn = Konekti.vc("prev")
                        if(x.topic>0) btn.className = btn.className.replace(" w3-disabled", "")
                        else btn.className += " w3-disabled"
                        btn = Konekti.vc("next")
                        if(x.topic<x.content.length-1) btn.className = btn.className.replace(" w3-disabled", "")
                        else btn.className += " w3-disabled"
                        x.VLO()    
                    })
                }
            }
        }
    }

    language(lang){	if( lang != this.lang ) window.open("index.html?lang="+lang+"&page="+this.page,"_self")	}

    prev(){ this.select(this.content[this.topic-1]) }

    next(){ this.select(this.content[this.topic+1]) }

    seturl(url){ Konekti.client['vlo'].setText(url) }

    setvlo(html){ Konekti.client['vlo'].setText(html) }

    vlogui(){ return {'plugin':'iframe', 'setup':['vlo', '', {'style':'width:100%;height:fit;'}]} }

    gui(){
        var level=this.level
        var dict=this.i18n
        function TOC(toc){
            for(var i=0; i<toc.length; i++){
                toc[i].splice(2,0,dict.toc[toc[i][0]])
                if(Array.isArray(toc[i][4])) toc[i][4] = TOC(toc[i][4])
            }
            return toc
        }
    
        var toc = TOC(this.toc)
    
        toc = {'plugin':'toc', 'setup':['tockonekti', toc, {'client':'client', 'method':'select'}, {'style':'width:200px;'}]}
        var dd = {'plugin':'toc', 'setup': ['sel_lang', [['en','', "English"], ['es','',"Español"]],
            {"client":'client', "method":"language"}, {'width':'200px', 'title':'Selecting language'}]}
        var ld = {'plugin':'toc', 'setup': ['sel_level', levels,
            {"client":'client', "method":"setlevel"}, {'width':'200px', 'title':'Selecting level'}]}	
        var btn=[
            {'plugin':'btn', 'setup':["prev","fa-arrow-left", '', {'client':'client'},{'title':dict.navbar.left}]},
            {'plugin':'btn', 'setup':["next","fa-arrow-right", '', {'client':'client'},{'title':dict.navbar.right}]},
            {'plugin':'dropdown', 'setup':["dd3", "fa-language", "", dd,{'title':dict.navbar.language}]}
        ]
        var title = {'plugin':'header', 'setup':['title',ICON, dict.title, 3, {'class':'w3-teal w3-center'}]}
        var navbar = {'plugin':'navbar', 'setup':['navbar', btn, '', {'class':'w3-blue-grey'}]}			
        var control = this.vlogui()
        var main = {'plugin':'raw', 'setup':['main-content', [title,navbar,control], {'style':'width:100%;height:fit;'}]}
        Konekti.sidebar('root', toc, main, {'style':'width:100%;height:100%;'})	
    } 
}

let CLIENT = null 

function KonektiMain(){
    var lang = Konekti.dom.getUserLanguage()
    var level = Konekti.dom.getURLSearchParam('level', 'advanced')
    var page = Konekti.dom.getURLSearchParam('page', 'home')
    // Loading the dictionary for i18n
    var callback = function(dict){ 
        if(dict===undefined || dict===null){
            if(lang!='es'){
                lang = 'es'
                Konekti.resource.JSON(ABSOLUTE_RES_URL+PARENT+MAIN+'i18n/es.json', callback)
            }else alert('Page not found')	
        }else{
            // With a valid dictionary we must set the web title
            document.title = dict.title
            // and bring the navigation
            Konekti.resource.JSON(ABSOLUTE_RES_URL+PARENT+MAIN+'nav.json', function(navigation){
                // With the navigation information create the gui and init the main client
                if(navigation.levels[level]===undefined) level='advanced'
                if(CLIENT==null) CLIENT = function(lang, level, i18n, navigation){ return new KMain(lang, level, i18n, navigation) }
                var client = CLIENT(lang, level, dict, navigation)
                client.select(page)
            })
        }
    }

    Konekti.resource.JSON(ABSOLUTE_RES_URL+PARENT+MAIN+'i18n/'+lang+'.json', callback)
}