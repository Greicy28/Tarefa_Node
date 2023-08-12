
const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');


class ResumoEmitter extends EventEmitter {}


const resumoEmitter = new ResumoEmitter();

function lerArquivo(arquivo) {
  
  let soma = 0;
  let linhasTexto = 0;
  let linhasNumero = 0;
  let tempoInicio = Date.now();

  
  const rl = readline.createInterface({
    input: fs.createReadStream(arquivo),
    crlfDelay: Infinity,
  });

  
  rl.on('line', (linha) => {
    
    linha = linha.trim();


    if (linha === '') {
      return;
    }
 
    if (/^\d+$/.test(linha)) {
      soma += parseInt(linha);
      linhasNumero++;
    } else {
      
      linhasTexto++;
    }
  });

  
  rl.on('close', () => {
    
    let tempoFim = Date.now();
    let tempoExecucao = tempoFim - tempoInicio;

    
    resumoEmitter.emit('resumo', {
      soma: soma,
      linhasTexto: linhasTexto,
      linhasNumero: linhasNumero,
      tempoExecucao: tempoExecucao,
    });
  });
}


function exibirResumo(dados) {
  
  let { soma, linhasTexto, linhasNumero, tempoExecucao } = dados;

  
  console.log(`Resumo do arquivo:`);
  console.log(`Soma dos números dentro do arquivo: ${soma}`);
  console.log(`Quantas linhas possuem texto: ${linhasTexto}`);
  console.log(`Quantas linhas possuem somente números: ${linhasNumero}`);
  console.log(`Quanto tempo demorou a execução: ${tempoExecucao} milissegundos`);
}


function perguntarNovamente() {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  
  rl.question('Deseja executar novamente? (s/n) ', (resposta) => {
    
    rl.close();

    
    if (resposta.toLowerCase() === 's') {
      pedirCaminho();
    } else if (resposta.toLowerCase() === 'n') {
      console.log('Obrigado,Até mais!');
      process.exit(0);
    } else {
      console.log('Resposta inválida. Por favor, digite s ou n.');
      perguntarNovamente();
    }
  });
}


function pedirCaminho() {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  
  rl.question('Digite o caminho do arquivo: ', (caminho) => {
    
    rl.close();

    
    try {
      lerArquivo(caminho);
    } catch (erro) {
      console.log(`Erro ao ler o arquivo: ${erro.message}`);
      perguntarNovamente();
    }
  });
}


resumoEmitter.on('resumo', (dados) => {
  exibirResumo(dados);
  perguntarNovamente();
});


pedirCaminho();
