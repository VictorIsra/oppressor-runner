
//pegando os atributos do jogo: dimensoes da tela, dos personagens etc
screen_width = document.getElementById("background").clientWidth;//client_qqrCoisa para só pegar o valor do padding ( ignorar as bordas, margens etc)
screen_heigth = document.getElementById("background").clientHeight;
player_heigth = document.getElementById("player").clientHeight;
gatilho = document.getElementsByTagName("body")[0];//usado para saber quando o jogo efetivamente começará
//atributos do personagem:
player = document.getElementById("player");
pos_inicial = screen_heigth - player_heigth;
player_pos = solo_pos = pos_inicial;//posicao inicial do personagem
player.style.top = player_pos + 'px';//coloca o personagem na posicao inicial
no_chao = true;//para saber se o personagem está pulando ou no solo

gatilho.addEventListener("keydown", comeca_jogo);//quando o personagem pular pela primeira vez, o jogo começará efetivamente
document.addEventListener("keydown", pula);

function pula(tecla){
	if(tecla.keyCode == 32 && no_chao ){//só pulará se estiver no chão ( e apertado espaço
        window.no_chao = false;
        var pulo = setInterval(function(){  
            window.player_pos-=20;
            player.style.top = player_pos + 'px';
            if(player_pos < screen_heigth/2){
                clearInterval(pulo);
                desce();
            }
        }, 30)
	}
}

function desce(){
	if(!no_chao){
        var pulo = setInterval(function(){
            window.player_pos+=20;
            player.style.top = window.player_pos + 'px';
            if(window.player_pos >= window.pos_inicial){
                clearInterval(pulo);
                window.no_chao=true;
            }
        }, 30)
    }
}

function comeca_jogo(tecla){
    if(tecla.keyCode == 32){
        cria_oprimido();
        gatilho.removeEventListener("keydown", comeca_jogo);
    }
}
/*
function intervalo(){  
    var min = 500//750;//parseInt(Math.random()*(Math.random()*1000), 10);
    var max = 4000//1500;parseInt(Math.random()*(Math.random()*1000), 10) + min;4
    x = parseInt(Math.random()*(max - min) + min, 10);
    console.log("velo " + x);
    return x;
}*/
function cria_oprimido(){
        (function(){
            var oprimido = document.createElement("div");
            oprimido.className = "oprimido";
            oprimido.style.top = solo_pos + "px";
            //oprimido = personaliza_oprimido();
            document.getElementById("background").appendChild(oprimido);
            var array = document.getElementsByClassName("oprimido");
            console.log("quantidade de elementos no vetor de oprimidos criados: " + array.length);
            var oprimido_pos = 0;
            var corre_oprimido = setInterval(function(){
                oprimido_pos +=5;
                oprimido.style.right = oprimido_pos + "px";
                if(oprimido_pos > screen_width){
                    oprimido.parentNode.removeChild(oprimido);
                    //background.removeChild(oprimido);
                   //background.removeChild(array[0]);
                   //array[0].remove();
                    clearInterval(corre_oprimido);
                }
            },30);
    })();
    //setTimeout(cria_oprimido, intervalo);
    setTimeout(cria_oprimido, 1000);//tempo arbitrário só pra ver as bads   
}

function personaliza_oprimido(){
    //fazer dps
}
