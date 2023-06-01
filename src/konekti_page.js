class KNMain extends KMain{
    constructor(lang, level, i18n, navigation){
        super(lang, level, i18n, navigation)
    }

    setvlo(html){ 
        Konekti.daemon( function(){ return (Konekti.client['coder']!==undefined && Konekti.client['coder'] != null) },
            function(){        
                Konekti.client['coder'].setText(html) 
                Konekti.client['viewer'].setText(html)
            }
        )
    }

    vlo(){ 
        var btn=[{'plugin':'btn', 'setup':["run", "fa-play", '', {'client':'client'}, {'class':"w3-blue-grey", 'title':"Run"}]}]
        var navbar = {'plugin':'navbar', 'setup':['main-navbar', btn, {'client':'client', 'method':'select'}, {'class':'w3-blue-grey'}]}

        var control = {'plugin':'split', 'setup':['coderviewer', 'col', 50, 
            {'plugin':'ace', 'setup':['coder', '', 'html', '', '', {'style':'width:100%;height:100%;'}]},
            {'plugin':'iframe', 'setup':['viewer', '', {'style':'width:100%;height:100%;'}]}, {'style':'width:100%;height:fit;'}
        ]}

        return {'plugin':'raw', 'setup':['vlo', [navbar,control], {'style':'width:100%;height:fit;'}]}
    }

}

CLIENT = function(lang, level, i18n, navigation){ return new KNMain(lang, level, i18n, navigation) }