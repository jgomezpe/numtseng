let ABSOLUTE_RES_URL = "https://jgomezpe.github.io/numtseng/" // Resources are stored in github

class Navigation{
    constructor(client, navigation){
        this.client = client
        this.levels = navigation.levels
        this.tocs = navigation.tocs
        this.topics = navigation.topics
        this.contents = navigation.contents
        this.rel_url = navigation.relative || ''
        this.level = -1
        this.topic = -1
    }

    index(v, a){
        var i=0
        while(i<a.length && a[i]!=v) i++
        return i
    }
    
    index2(v, a){
        var i=0
        while(i<a.length && a[i].id!=v) i++
        return i
    }

    checkTopic(){
        if(this.topic != -1) while(this.topic>0 && this.content[this.level][this.topic]==0) this.topic--
        else this.topic = 0
    }

    prev(){
        var i=this.topic-1
        while(i>=0 && this.content[this.level][i]==0) i--
        return i>=0?this.topics[i].id:null
    }

    next(){
        var i=this.topic+1
        while(i<this.topics.length && this.content[this.level][i]==0) i++
        return i<this.topics.length?this.topics[i].id:null
    }

    setLevel(level){
        if(level == this.level) return
        var idx = this.index(level, this.levels)
        if(idx<this.levels.length){
            this.level = idx
            this.checkTopic()
            this.client.setVLO(this.level, this.topic)
        }
    }

    setTopic(topic){
        if(topic==this.topic) return       
        var idx = this.index2(topic, this.topics)
        if(idx<this.topics.length){
            this.topic = idx
            this.checkTopic()
            this.client.setVLO(this.level, this.topic)
        }
    }

    VLO(){
        var t = this.topics[this.topic]
        var vlo = t.url
        if(typeof vlo==="string"){ vlo = {"basic":vlo}}
        var url = vlo.url
        if(!url.startsWith("https://")){
            var RES_URL = ''
            if(!url.startsWith('/')) RES_URL = this.rel_url
            url = ABSOLUTE_RES_URL + 'vlo/' + this.lang + RES_URL + url
        }
        var c = '?'
        if(vlo.params !== undefined){
            for( var p in this.i18n[vlo.params] ){
                url += c + p + '=' + x.i18n[vlo.params][p]
                c = '&'
            }
            this.client.url2vlo(url)
        }else Konekti.resource.TXT( url, 
            function(html){
                var dict = {}
                for(var i=0; i<=this.topic; i++) dict[this.topics[i].id] = 'block'
                for(var i=this.topic+1; i<this.topics.length; i++) dict[this.topics[i].id] = 'hidden'
                html = Konekti.dom.fromTemplate(html,dict)
                this.client.txt2vlo(html)
            })
    }
}

class NumtsengClient extends MainClient{
    constructor(lang, level, i18n, navigation){
        super()
        this.page = ''
        this.lang = lang
        this.level = level
        this.i18n = i18n
        this.navigation = new Navigation(this, navigation)
        this.gui()
    }

    setVLO(level, topic){
        
    }

}