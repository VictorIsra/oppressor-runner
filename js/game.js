(function novo_jogo(){
    //pegando os atributos do jogo: dimensoes da tela, dos personagens etc
    var screen_width = document.getElementById("background").clientWidth;//client_qqrCoisa para só pegar o valor do padding ( ignorar as bordas, margens etc)
    var screen_heigth = document.getElementById("background").clientHeight;
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
    document.addEventListener("keydown", restart_game);

    function restart_game(tecla){
        if(fim_jogo && tecla.keyCode == 27 ){
            player.style.top  = pos_inicial_y;
            player.style.left = 0;
            novo_jogo();
            //removeEventListener("keydown", comeca_jogo);
        }
    }
    function pula(tecla){
    	if(tecla.keyCode == 32 && no_chao && !fim_jogo ){//só pulará se estiver no chão ( e apertado espaço
            no_chao = false;
            var pulo = setInterval(function(){
                if(fim_jogo)
                    return;
                var velocidade = 25;  
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
    	if(!no_chao && !fim_jogo){
            var pulo = setInterval(function(){
                if(fim_jogo)
                    return;
                var velocidade = 25;
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
                player_pos_x += 1;
               // console.log("posicao X do player  " + player_pos_x);
                player.style.left = player_pos_x + 'px';
                if(player_pos_x >= screen_heigth/10){
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
                if(fim_jogo)
                        return;
                var oprimido = document.createElement("div");
                oprimido.className = "oprimido";
                //oprimido = personaliza_oprimido();
                document.getElementById("background").appendChild(oprimido);
                var array = document.getElementsByClassName("oprimido");
                var oprimido_pos_x = screen_width - oprimido.clientWidth;//posicao horizontal inicial de um oprimido
                var oprimido_pos_y = screen_heigth - oprimido.clientHeight;//posicao vertical de um oprimido
                oprimido.style.left = oprimido_pos_x + "px";//coloca o oprimido na posicao horizontal inicial
                oprimido.style.top = oprimido_pos_y + "px";//coloca o oprimido na posicao vertical inicial
                oprimido.style.width = oprimido.clientWidth + "px";
                var corre_oprimido = setInterval(function(){
                    if(fim_jogo)
                        return;
                    //console.log("ta dentro de corre oprimido ");
                    var velocidade = 15;
                    oprimido_pos_x -= velocidade;
                     oprimido.style.left = oprimido_pos_x + "px";
                    if(colidiu(oprimido, oprimido_pos_y)){
                        fim_jogo = true;
                        var i;var tam = array.length;
                        for(i<tam; i=0; i--)
                            array[i].remove();
                    }
                    if(oprimido_pos_x <= -velocidade ){
                        oprimido.parentNode.removeChild(oprimido);
                        clearInterval(corre_oprimido);
                    }
                },30);
            })();
            var fluxo = setInterval(cria_oprimido, 1000);//intervalo());
    }

    function personaliza_oprimido(){
        //fazer dps
    }

    function colidiu(oprimidu, opri_pos_y){//*nao funcionaria caso um opressor fosse menor(em comprimento) que o player (nao é o caso no jogo)*
        var player_pos_inf    = player_pos_y + player_heigth;//posicao da "base"(nivel inferior) do player 
        var oprimido_pos_x    = parseInt(oprimidu.style.left)//posicao do vertice esquerdo inferior do oprimido
        var oprimido_pos_xD   = parseInt(oprimidu.style.left) + parseInt(oprimidu.style.width)//posicao do vertice direito inferior do oprimido
        var player_pos_xD     = player_pos_x + player_width//posicao do vertice direito do player
        if(player_pos_inf >= opri_pos_y && ( (player_pos_xD >= oprimido_pos_x && player_pos_xD <= oprimido_pos_xD)
            || (player_pos_x >= oprimido_pos_x && player_pos_x <= oprimido_pos_xD) ))
                return true;
    }

})();



