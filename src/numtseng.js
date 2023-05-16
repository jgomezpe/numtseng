let ABSOLUTE_RES_URL = "https://jgomezpe.github.io/numtseng/" // Resources are stored in github
let RELATIVE_RES_URL = ""
let SERVER_URL = "https://numtseng.com/" // Change this to your server name
let PARENT = ''
let MAIN = ''
let ICON = ''

function numtseng(parent='', main='', rel_url='/general/', icon=''){
    PARENT = parent 
    MAIN = main
    ICON = icon
    RELATIVE_RES_URL=rel_url
    Konekti.uses('sidebar') 
}

class KMain extends MainClient{
    constructor(lang, level, i18n, navigation){
        super()
        this.page = ''
        this.lang = lang
        this.level = level
        this.i18n = i18n
        this.navigation = navigation
    }

    getLevel(obj, level){
        if(obj[level] !== undefined) return obj[level]
        if(level=='advanced') return this.getLevel(obj,'medium')
        return this.getLevel(obj, 'basic')
    }

    select(page){
        var x = this
        if( x.page != page ){
            x.page = page

            if(x.navigation.topic[page] == "*") window.open(page+"/index.html?page=home&level="+x.level+"&lang="+x.lang, '_self')
            if(x.navigation.topic[page] == "/") window.open(SERVER_URL+PARENT+"/index.html?page=home&level="+x.level+"&lang="+x.lang, '_self')

            Konekti.dom.setURLSearchParam('page',page)
            Konekti.dom.setURLSearchParam('level',x.level)
            Konekti.dom.setURLSearchParam('lang',x.lang)

            Konekti.daemon( function(){ return Konekti.client['vlo'] !== undefined && Konekti.vc("prev")!=null }, function(){
                console.log(page)
                console.log(x.navigation.topic)
                var btn = Konekti.vc("prev")
                if(x.navigation.topic[page].prev !== undefined) btn.className = btn.className.replace(" w3-disabled", "")
                else btn.className += " w3-disabled"
                btn = Konekti.vc("next")
                if(x.navigation.topic[page].next !== undefined) btn.className = btn.className.replace(" w3-disabled", "")
                else btn.className += " w3-disabled"

                var vlo = x.navigation.topic[page].url
                if(typeof vlo==="string"){ vlo = {"basic":vlo}}
                vlo = x.getLevel(vlo, x.level)
                if(typeof vlo==="string"){ vlo = {"url":vlo}}

                var url = vlo.url
                if(!url.startsWith("https://")){
                    var RES_URL = ''
                    if(!url.startsWith('/')){
                        RES_URL = RELATIVE_RES_URL
                    }
                    url = ABSOLUTE_RES_URL + 'vlo/' + x.lang + RES_URL + url
                }
                var c = '?'
                if(vlo.params !== undefined){
                    for( var p in x.i18n[vlo.params] ){
                        url += c + p + '=' + x.i18n[vlo.params][p]
                        c = '&'
                    }
                    Konekti.client['vlo'].setText(url)
                }else Konekti.resource.TXT(url, function(txt){ Konekti.client['vlo'].setText(url) })
            })						
        }
    }

    language(lang){	if( lang != this.lang ) window.open("index.html?lang="+lang+"&level="+this.level+"&page="+this.page,"_self")	}

    setlevel(level){
        if( level != this.level ) window.open("index.html?lang="+this.lang+"&level="+level+"&page="+this.page,"_self")
        else Konekti.client['dd4'].click()
    }

    prev(){
        var t = this.navigation.topic[this.page].prev
        if(typeof t == 'string') this.select(t)
        else this.select(t[this.getLevel(t,this.level)]) 
    }

    next(){ 
        var t = this.navigation.topic[this.page].next
        console.log(t)
        if(typeof t == 'string') this.select(t)
        else this.select(t[this.getLevel(t,this.level)]) 
    }
}

function gui(level, dict, navigation){
    function TOC(toc){
        for(var i=0; i<toc.length; i++){
            toc[i].splice(2,0,dict.toc[toc[i][0]])
            if(Array.isArray(toc[i][4])) toc[i][4] = TOC(toc[i][4])
        }
        return toc
    }

    var toc = navigation.levels[level]
    if(typeof toc == 'string') toc = navigation.levels[toc]
    toc = TOC(toc)

    toc = {'plugin':'toc', 'setup':['tockonekti', toc, {'client':'client', 'method':'select'}, {'style':'width:200px;'}]}
    var dd = {'plugin':'toc', 'setup': ['sel_lang', [['en','', "English"], ['es','',"Español"]],
        {"client":'client', "method":"language"}, {'width':'200px', 'title':'Selecting language'}]}
    var levels = []
    var i=0
    for(var y in dict.navbar.levels){
        levels[i] = [y, '', dict.navbar.levels[y]]
        i++
    }
    var ld = {'plugin':'toc', 'setup': ['sel_level', levels,
        {"client":'client', "method":"setlevel"}, {'width':'200px', 'title':'Selecting level'}]}	
    var btn=[
        {'plugin':'btn', 'setup':["prev","fa-arrow-left", '', {'client':'client'},{'title':dict.navbar.left}]},
        {'plugin':'btn', 'setup':["next","fa-arrow-right", '', {'client':'client'},{'title':dict.navbar.right}]},
        {'plugin':'dropdown', 'setup':["dd4", "fa-sort-amount-asc", "", ld,{'title':dict.navbar.level}]},
        {'plugin':'dropdown', 'setup':["dd3", "fa-language", "", dd,{'title':dict.navbar.language}]}
    ]
    var title = {'plugin':'header', 'setup':['title',ICON, dict.title, 3, {'class':'w3-teal w3-center'}]}
    var navbar = {'plugin':'navbar', 'setup':['navbar', btn, '', {'class':'w3-blue-grey'}]}			
    var control = {'plugin':'iframe', 'setup':['vlo', '', {'style':'width:100%;height:fit;'}]}
    var main = {'plugin':'raw', 'setup':['main-content', [title,navbar,control], {'style':'width:100%;height:fit;'}]}
    Konekti.sidebar('root', toc, main, {'style':'width:100%;height:100%;'})	
}

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
                var client = new KMain(lang, level, dict, navigation)
                client.select(page)
                gui(level, dict, navigation)
            })
        }
    }

    Konekti.resource.JSON(ABSOLUTE_RES_URL+PARENT+MAIN+'i18n/'+lang+'.json', callback)
}