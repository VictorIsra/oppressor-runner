(function(){
    //pegando os atributos do jogo: dimensoes da tela, dos personagens etc
    var screen_width = document.getElementById("background").clientWidth;//client_qqrCoisa para só pegar o valor do padding ( ignorar as bordas, margens etc)
    var screen_heigth = document.getElementById("background").clientHeight;
    var gatilho = document.getElementsByTagName("body")[0];//usado para saber quando o jogo efetivamente começará
    var placar = document.getElementById("placar");
    var fim_jogo = false;//acionará certos eventos quando verdadeiro
    var jogo_iniciado = false;
    var fluxo;//controlará a chamada da instancialização dos oprimidos
    var pontuacao = -1;//total de segundos sem colidir
    var cronometro = 0;//controlará a pontuacao
    var ampulheta;//controlara a taxa com que os oprimidos aparecem
    var velocidade_oprimido = 15;//velocidade inicial de um oprimido
    var limpa_oprimido;//conterá os inimigos a serem limpados após o termino do jogo
    var tempo_surgimento_inicial = 2000;
    var tempo_surgimento = tempo_surgimento_inicial;//tempo inicial em segundos para surgir um oprimido
    //atributos do personagem:
    var player = document.getElementById("player");
    var player_width = player.clientWidth;
    var player_heigth = player.clientHeight;
    var pos_inicial_y = screen_heigth - player_heigth;//calcula posicao vertical inicial do personagem em relacao ao solo
    var player_pos_y = pos_inicial_y;//posicao vertical inicial do personagem
    var player_pos_x = 0;//posicao horizontal inicial do personagem
    var no_chao = true;//para saber se o personagem está pulando ou no solo
    player.style.top = player_pos_y + 'px';//coloca o personagem na posicao vertical inicial
    
    
    gatilho.addEventListener("keydown", controla_teclado);
    
    function controla_teclado(tecla){
        switch (tecla.keyCode) {
            case 32:
                 if(jogo_iniciado )
                    pula();
                    
                 else{
                    pula();
                    comeca_jogo();
                    jogo_iniciado = true;
                  }
                  break;

            case 27:
                if(fim_jogo){
                    restart_game();
                    fim_jogo = false;
                    jogo_iniciado = false;
                }
                break;
        }

    }

    function pula(){
        if(no_chao){
            no_chao = false;
            var pulo = setInterval(function(){
                if(fim_jogo)//pra congelar o player caso ele estiver supindo após colidir
                    return;
                var velocidade = 20;  
                player_pos_y-= velocidade;
                player.style.top = player_pos_y + 'px';
                if(player_pos_y < screen_heigth/2){
                    clearInterval(pulo);
                    desce();
                }
            }, 30);
        }
    }

    function desce(){
        if(!no_chao){
            var pulo = setInterval(function(){
                if(fim_jogo)//pra congelar o player caso ele estiver descendo após colidir
                    return;
                var velocidade = 20;
                player_pos_y+= velocidade;
                player.style.top = player_pos_y + 'px';
                if(player_pos_y >= pos_inicial_y){
                    clearInterval(pulo);
                    no_chao=true;
                }
            }, 30)
        }
    }

    function comeca_jogo(){
            var anda = setInterval(function(){
                if(fim_jogo)
                    return;
                player_pos_x += 1;
                player.style.left = player_pos_x + 'px';
                if(player_pos_x >= screen_heigth/10){
                    clearInterval(anda);
                    fluxo = setTimeout(cria_oprimido,1000);//executará uma única vez, pois o tempo de criação mudará
                    cronometro = setInterval(function(){//coloca a pontuacao no placar
                        placar.style.visibility = "visible";
                        pontuacao+=1;
                        placar.innerHTML = pontuacao;
                    },1000);
                }
            },30);
    }

    function restart_game(){
        arruma_player();
        arruma_placar();
        arruma_tempo();
        limpa_tela();        
    }

    function arruma_player(){
        player.style.top  = pos_inicial_y;
        player.style.left = 0;
        player_pos_x = 0;
    }

    function arruma_placar(){
        pontuacao = -1;
        placar.innerHTML = 0;
        placar.style.visibility = "hidden";
    }

    function arruma_tempo(){
        ampulheta = 0;
        tempo_surgimento = tempo_surgimento_inicial;
    }

    function limpa_tela(){
        while(limpa_oprimido[0])//limpa os blocos da tela
            limpa_oprimido[0].parentNode.removeChild(limpa_oprimido[0]);

    }
     
    var cria_oprimido = function(){
                if(fim_jogo)//sai da funcao
                    return;
                var oprimido = document.createElement("div");
                oprimido.className = "oprimido";
                //oprimido = personaliza_oprimido();
                document.getElementById("background").appendChild(oprimido);
                var oprimidos = document.getElementsByClassName("oprimido");//vetor com todos os oprimidos presentes na cena
                var oprimido_pos_x = screen_width - oprimido.clientWidth;//posicao horizontal inicial de um oprimido
                var oprimido_pos_y = screen_heigth - oprimido.clientHeight;//posicao vertical de um oprimido
                oprimido.style.left = oprimido_pos_x + "px";//coloca o oprimido na posicao horizontal inicial
                oprimido.style.top = oprimido_pos_y + "px";//coloca o oprimido na posicao vertical inicial
                oprimido.style.width = oprimido.clientWidth + "px";
                var corre_oprimido = setInterval(function(){
                    if(fim_jogo){//cessa o timer e sai da funcao
                        clearInterval(corre_oprimido);
                        clearTimeout(ampulheta);//precisa limpar para evitar um novo gatilho do setTimeout
                        clearTimeout(fluxo);//precisa limpar para evitar um novo gatilho do setTimeout
                        return;
                    }
                    gerencia_velocidade_oprimido();
                    oprimido_pos_x -= velocidade_oprimido;
                    oprimido.style.left = oprimido_pos_x + "px";
                    if(colidiu(oprimido, oprimido_pos_y)){
                        limpa_oprimido = oprimidos;
                        clearTimeout(ampulheta);//precisa limpar para evitar um novo gatilho do setTimeout
                        clearInterval(cronometro);
                        fim_jogo = true;
                    }
                    if(oprimido_pos_x <= -velocidade_oprimido ){
                        oprimido.parentNode.removeChild(oprimido);
                        clearInterval(corre_oprimido);
                    }

                },30);
                ampulheta = setTimeout(vira_ampulheta,tempo_surgimento);//calcula novo tempo de surgimento de um oprimido
            };
            
    var vira_ampulheta = function(){
        var taxa = 250;//taxa com que o tempo de criacao diminui
        var razao = 15;
        if(tempo_surgimento <= 750){
            taxa = Math.floor(taxa/razao);
        }
        tempo_surgimento-=taxa;
        fluxo = setTimeout(cria_oprimido,tempo_surgimento);//cria oprimido num intervalo de tempo novo
    }
    
    function personaliza_oprimido(){
        //fazer dps
    }

    function colidiu(oprimidu, opri_pos_y){//*nao funcionaria caso um opressor fosse menor(em comprimento) que o player (nao é o caso no jogo)*
        var player_pos_inf    = player_pos_y + player_heigth;//posicao da "base"(nivel inferior) do player 
        var oprimido_pos_x    = parseInt(oprimidu.style.left)//posicao do vertice esquerdo inferior do oprimido
        var oprimido_pos_xD   = parseInt(oprimidu.style.left) + parseInt(oprimidu.style.width)//posicao do vertice direito inferior do oprimido
        var player_pos_xD     = player_pos_x + player_width//posicao do vertice direito do player//console.log
        if(player_pos_inf >= opri_pos_y && ( (player_pos_xD >= oprimido_pos_x && player_pos_xD <= oprimido_pos_xD)
            || (player_pos_x >= oprimido_pos_x && player_pos_x <= oprimido_pos_xD) ))
                return true;
    }

    function gerencia_velocidade_oprimido(){
        if(pontuacao >= 42)//a partir de 42s de jogo
            velocidade_oprimido = 11;
    }

})();




