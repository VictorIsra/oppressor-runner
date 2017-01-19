
//pegando os atributos do jogo: dimensoes da tela e dos personagens
screen_width = document.getElementById("background").clientWidth;//client_qqrCoisa para só pegar o valor do padding ( ignorar as bordas, margens etc)
screen_heigth = document.getElementById("background").clientHeight;
player_heigth = document.getElementById("player").clientHeight;
//atributos do personagem:
player = document.getElementById("player");
player_pos = solo_pos = screen_heigth - player_heigth;//posicao inicial do personagem
player.style.top = player_pos + 'px';//coloca o personagem na posicao inicial
no_chao = true;//para saber se o personagem está pulando ou no solo

document.addEventListener("keydown", pula);
document.addEventListener("keyup", desce);
document.addEventListener("keydown", comeca_jogo);

function pula(tecla){
	if(tecla.keyCode == 32 && no_chao ){//só pulará se estiver no chão ( e apertado espaço )
		id = setTimeout(function(){pula(tecla)}, 30);
		if(player_pos < screen_heigth/2){//altura máxima do pulo será sempre a metade da altura da tela
			clearInterval(id);
			desce();//ao atingir altura máxima, o personagem começará a descer
		}
		else{
			player_pos-=20;
			player.style.top = player_pos + 'px';
		}
	}
}

function desce(){
	no_chao = false;
	id = setTimeout(function(){desce()}, 30);
	if(player_pos >= solo_pos){//para que o personagem volte ao nível do solo depois de pular ( e nao caia pra baixo da tela)
		clearInterval(id);
		player.style.top = solo_pos + 'px';
		no_chao = true;	
	}
	else{
		player_pos+=25;
		player.style.top = player_pos + 'px';
	}
}

function comeca_jogo(){
	cria_blocos();
}

function cria_blocos(){
	novo_bloco = document.createElement("div");
	novo_bloco.className = 'oprimido';
	document.getElementById("background").appendChild(novo_bloco);
	console.log(novo_bloco);
}
