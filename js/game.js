(function(){
    var screen_width = document.getElementById("background").clientWidth;
    var screen_heigth = document.getElementById("background").clientHeight;
    var gatilho = document.getElementsByTagName("body")[0];
    var placar = document.getElementById("placar");
    var fim_jogo = false;
    var jogo_iniciado = false;
    var pontuacao = -1;
    var cronometro = 0;
    /*atributos dos obstáculos:*/
    var fluxo;//controlará a chamada da instancialização dos obstáculos
    var ampulheta;//controlara a taxa com que os obstáculos aparecem
    var taxa = 4;
    var velocidade_oprimido_inicial = 15;
    var velocidade_oprimido_final = velocidade_oprimido_inicial-taxa;
    var velocidade_oprimido = velocidade_oprimido_inicial;
    var limpa_oprimido;
    var tempo_surgimento_inicial = 2000;
    var tempo_surgimento = tempo_surgimento_inicial;
    /*atributos do personagem:*/
    var player = document.getElementById("player");
    var player_width = player.clientWidth;
    var player_heigth = player.clientHeight;
    var pos_inicial_y = screen_heigth - player_heigth;
    var player_pos_y = pos_inicial_y;
    var player_pos_x = 0;
    var no_chao = true; 
    player.style.top = player_pos_y + 'px';

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
                if(fim_jogo)//congela o pulo
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
                if(fim_jogo)//congela a descida
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
                fluxo = setTimeout(cria_oprimido,1000);
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
        arruma_oprimidos();
        arruma_tempo();
        limpa_tela();        
    }

    function arruma_player(){
        player.style.top  = pos_inicial_y;
        player.style.left = 0;
        player_pos_x = 0;
    }

    function arruma_oprimidos(){
        velocidade_oprimido = velocidade_oprimido_inicial;
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
        while(limpa_oprimido[0])
            limpa_oprimido[0].parentNode.removeChild(limpa_oprimido[0]);

    }
    
    function posiciona_oprimido(oprimido,cordenadas){
        oprimido.style.left = cordenadas[0] + "px";
        oprimido.style.top = cordenadas[1] + "px";
        oprimido.style.width = oprimido.clientWidth + "px";
    }

    var cria_oprimido = function(){
        if(fim_jogo)
            return;
        var oprimido = document.createElement("div");
        oprimido.className = "oprimido";
        //oprimido = personaliza_oprimido();
        document.getElementById("background").appendChild(oprimido);
        var oprimidos = document.getElementsByClassName("oprimido");//vetor com todos os obstáculos presentes na cena
        var oprimido_pos_x = screen_width - oprimido.clientWidth;
        var oprimido_pos_y = screen_heigth - oprimido.clientHeight;
        var cordernadas_oprimido = [oprimido_pos_x,oprimido_pos_y];
        posiciona_oprimido(oprimido, cordernadas_oprimido);
        var corre_oprimido = setInterval(function(){
            if(fim_jogo){
                clearInterval(corre_oprimido);
                /*precisam ser limpados para evitar um novo gatilho do setTimeout*/
                clearTimeout(ampulheta);
                clearTimeout(fluxo);
                return;
            }
            gerencia_velocidade_oprimido();
            oprimido_pos_x -= velocidade_oprimido;
            oprimido.style.left = oprimido_pos_x + "px";
            if(colidiu(oprimido, oprimido_pos_y)){
                limpa_oprimido = oprimidos;
                clearTimeout(ampulheta);//precisa ser limpado para evitar um novo gatilho do setTimeout
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

    function colidiu(oprimidu, opri_pos_y){
        var player_pos_inf    = player_pos_y + player_heigth;//posicao da "base"(nivel inferior) do player 
        var oprimido_pos_x    = parseInt(oprimidu.style.left)//posicao do vertice esquerdo inferior do oprimido
        var oprimido_pos_xD   = parseInt(oprimidu.style.left) + parseInt(oprimidu.style.width)//posicao do vertice direito inferior do oprimido
        var player_pos_xD     = player_pos_x + player_width//posicao do vertice direito do player
        if(player_pos_inf >= opri_pos_y && ( (player_pos_xD >= oprimido_pos_x && player_pos_xD <= oprimido_pos_xD)
            || (player_pos_x >= oprimido_pos_x && player_pos_x <= oprimido_pos_xD) ))
                return true;
    }

    function gerencia_velocidade_oprimido(){
        if(pontuacao >= 42)
            velocidade_oprimido = velocidade_oprimido_final;
    }

})();




