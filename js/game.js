
(function(){
    //pegando os atributos do jogo: dimensoes da tela, dos personagens etc
    var screen_width = document.getElementById("background").clientWidth;//client_qqrCoisa para só pegar o valor do padding ( ignorar as bordas, margens etc)
    var screen_heigth = document.getElementById("background").clientHeight;
    console.log("width tela",screen_width, "height tela", screen_heigth);
    var gatilho = document.getElementsByTagName("body")[0];//usado para saber quando o jogo efetivamente começará
    var fim_jogo = false;//acionará certos eventos quando verdadeiro
    //atributos do personagem:
    var player = document.getElementById("player");
    var player_width = player.clientWidth;
    var player_heigth = player.clientHeight;
    var pos_inicial_y = screen_heigth - player_heigth;//calcula posicao vertical inicial do personagem em relacao ao solo
    var player_pos_y = pos_inicial_y;//posicao vertical inicial do personagem
    var player_pos_x = 0;//posicao horizontal inicial do personagem
    var no_chao = true;//para saber se o personagem está pulando ou no solo
    player.style.top = player_pos_y + 'px';//coloca o personagem na posicao vertical inicial
    
    gatilho.addEventListener("keydown", comeca_jogo);//quando o personagem pular pela primeira vez, o jogo começará efetivamente
    document.addEventListener("keydown", pula);

    function pula(tecla){
    	if(tecla.keyCode == 32 && no_chao && !fim_jogo ){//só pulará se estiver no chão ( e apertado espaço
            no_chao = false;
            var pulo = setInterval(function(){
                var velocidade = 30;  
                player_pos_y-= velocidade;
                //console.log("posicao Y do player  " + player_pos_y);
                player.style.top = player_pos_y + 'px';
                if(player_pos_y < screen_heigth/2){
                    clearInterval(pulo);
                    desce();
                }
            }, 30)
    	}
    }

    function desce(){
    	if(!no_chao){
            var pulo = setInterval(function(){
                var velocidade = 30;
                player_pos_y+= velocidade;
                player.style.top = player_pos_y + 'px';
                if(player_pos_y >= pos_inicial_y){
                    clearInterval(pulo);
                    no_chao=true;
                }
            }, 30)
        }
    }

    function comeca_jogo(tecla){
        if(tecla.keyCode == 32){
            var anda = setInterval(function(){
                //if(no_chao)//ver possivel "bug" depois caso queira manter descomentado "bug":se mantiver pressionado pode demorarar pra comecar
                player_pos_x += 1;
               // console.log("posicao X do player  " + player_pos_x);
                player.style.left = player_pos_x + 'px';
                if(player_pos_x >= screen_heigth/15){ //acrescentar "&& no_chao"?
                    clearInterval(anda);
                    cria_oprimido();
                }
            },30);
            gatilho.removeEventListener("keydown", comeca_jogo);
        }
    }
    /*function intervalo(){  
        var min = 500//750;//parseInt(Math.random()*(Math.random()*1000), 10);
        var max = 4000//1500;parseInt(Math.random()*(Math.random()*1000), 10) + min;4
        var x = parseInt(Math.random()*(max - min) + min, 10);
        console.log("tempo " + x);
        return x;
    }*/

    function cria_oprimido(){
            (function(){
                var oprimido = document.createElement("div");
                oprimido.className = "oprimido";
                //oprimido = personaliza_oprimido();
                document.getElementById("background").appendChild(oprimido);
                var oprimido_pos_x = screen_width - oprimido.clientWidth;//posicao horizontal inicial de um oprimido
                var oprimido_pos_y = screen_heigth - oprimido.clientHeight;//posicao vertical inicial de um oprimido
                oprimido.style.left = oprimido_pos_x + "px";//coloca o oprimido na posicao horizontal inicial
                oprimido.style.top = oprimido_pos_y + "px";//coloca o oprimido na posicao vertical inicial
                var count = 0;
                var corre_oprimido = setInterval(function(){
                    var velocidade = 15;
                    console.log("posicao X oprimido ", oprimido_pos_x);
                    oprimido_pos_x -= velocidade;
                     oprimido.style.left = oprimido_pos_x + "px";
                    //colide(oprimido);
                    if(oprimido_pos_x <= -velocidade ){//depois ver como acertar isso ( só funciona se for multiplo de 15 o.o) -(oprimido_pos_x+velocidade) ou -velocidade e p essa resolucao -.-
                        oprimido.parentNode.removeChild(oprimido);
                        clearInterval(corre_oprimido);
                    }
                },30);
        })();
        var id = setTimeout(cria_oprimido, 1000);//intervalo());
        if(fim_jogo)
            clearInterval(id);
    }

    function personaliza_oprimido(){
        //fazer dps
    }

    function colide(x){//*lembrar q nao tem passagem por ref mas dá pra alterar objetos*
        //console.log("objeto: ",x, "left ", x.style.left);
        
    }

})();


