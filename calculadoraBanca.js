// Aguarde o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function() {
    // Obtém os elementos do formulário
    const form = document.querySelector("form");
    const bancaInicialInput = document.getElementById("banca-inicial");
    const stopWinInput = document.getElementById("stop-win");
    const stopLossInput = document.getElementById("stop-loss");
    const taxaAssertividadeInput = document.getElementById("taxa-assertividade");
    const dataInicialInput = document.getElementById("data-inicial");
    const dataFinalInput = document.getElementById("data-final");
    let objetoMeses = {};
  
    // Adiciona o evento de envio do formulário
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Evita o envio do formulário
  
      // Obtém os valores dos inputs
      const bancaInicial = parseFloat(bancaInicialInput.value);
      const stopWin = parseFloat(stopWinInput.value);
      const stopLoss = parseFloat(stopLossInput.value);
      const taxaAssertividade = parseFloat(taxaAssertividadeInput.value);
      const dataInicial = dataInicialInput.value;
      const dataFinal = dataFinalInput.value;
  
      // Faça algo com os valores obtidos, por exemplo:
      console.log("Banca Inicial:", bancaInicial);
      console.log("Stop Win:", stopWin);
      console.log("Stop Loss:", stopLoss);
      console.log("Taxa de Assertividade Mensal:", taxaAssertividade);
      console.log("Data Inicial das Operações:", dataInicial);
      console.log("Data Final das Operações:", dataFinal);
  
      // Chame uma função ou realize o cálculo desejado aqui
      const dataFixed = calcularDiasEMesesOperacoes(dataInicial, dataFinal);
      objetoMeses = criarObjetoMeses(dataFixed.mesesOperacoes, taxaAssertividade);
      const resultados = calcularBanca(bancaInicial, stopLoss, stopWin, objetoMeses);
    //   resultados.forEach((resultado) => {
    //     console.log(`Mês ${resultado.mes}`);
    //     console.log(`Banca inicial: R$ ${resultado.bancaInicial.toFixed(2)}`);
    //     console.log(`Banca Final: R$ ${resultado.bancaFinal.toFixed(2)}`);
    //     console.log(`Lucro: R$ ${resultado.lucro.toFixed(2)}`);
    //     console.log(`Lucro %: ${resultado.lucroPorcentagem.toFixed(2)}%\n`);
    //   });

      exibirResultadosHTML(resultados);
      console.log(objetoMeses);

  
      // Limpa os valores dos inputs após o cálculo, se necessário
      bancaInicialInput.value = "";
      stopWinInput.value = "";
      stopLossInput.value = "";
      taxaAssertividadeInput.value = "";
      dataInicialInput.value = "";
      dataFinalInput.value = "";
    });



    function calcularDiasEMesesOperacoes(dataInicial, dataFinal) {
        // Converte as datas para objetos Date
        const dataInicio = new Date(dataInicial);
        const dataFim = new Date(dataFinal);
      
        // Calcula a diferença em milissegundos
        const diferencaEmMilissegundos = dataFim - dataInicio;
      
        // Converte a diferença em dias
        const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
        const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);
      
        // Calcula o número de meses de operações
        const mesesOperacoes = Math.floor(diferencaEmDias / 30);
      
        // Retorna um objeto com os resultados
        return {
          diasOperacoes: diferencaEmDias,
          mesesOperacoes: mesesOperacoes
        };
      }
      
      // Exemplo de uso da função
    //   const dataInicial = "2023-01-01";
    //   const dataFinal = "2023-05-15";
    //   const dataFixed = calcularDiasEMesesOperacoes(dataInicial, dataFinal);
      
    //   console.log("Dias de Operações:", dataFixed.diasOperacoes);
    //   console.log("Meses de Operações:", dataFixed.mesesOperacoes);
      




      // Atribuir Randomicamente os dias de ganho e perda
      function criarObjetoMeses(numeroMeses, taxaAssertividade) {
        const objetoMeses = {};
      
        for (let i = 0; i < numeroMeses; i++) {
          const mes = [];
          for (let j = 0; j < 30; j++) {
            mes.push(0); // Inicializa todas as posições do array do mês com 0
          }
      
          const quantidadePositivos = Math.floor((taxaAssertividade / 100) * 30);
          const quantidadeNegativos = 30 - quantidadePositivos;
      
          for (let k = 0; k < quantidadePositivos; k++) {
            let posicaoAleatoria;
            do {
              posicaoAleatoria = Math.floor(Math.random() * 30);
            } while (mes[posicaoAleatoria] !== 0); // Verifica se a posição já foi preenchida
            mes[posicaoAleatoria] = 1; // Preenche a posição com 1 (positivo)
          }
      
          objetoMeses[`mes${i+1}`] = mes; // Adiciona o array do mês ao objeto
        }
      
        return objetoMeses;
      }
      
      // Exemplo de uso da função
    //   const numeroMeses = 6;
    //   const taxaAssertividade = 50;
    //   objetoMeses = criarObjetoMeses(numeroMeses, taxaAssertividade);
      
    //   console.log(objetoMeses);









    //Funcao para calcular a banca baseado nos resultados de green red do mes
    function calcularBanca(bancaInicial, stopLoss, stopWin, objetoMeses) {
        let bancaAtual = bancaInicial;
        let resultados = [];
      
        for (const mes in objetoMeses) {
          let bancaMesInicial = bancaAtual;
          let lucroMes = 0;
      
          for (let i = 0; i < objetoMeses[mes].length; i++) {
            if (objetoMeses[mes][i] === 1) {
              // Dia lucrativo
              bancaAtual += (stopWin / 100) * bancaAtual;
            } else {
              // Dia de prejuízo
              bancaAtual -= (stopLoss / 100) * bancaAtual;
            }
          }
      
          lucroMes = bancaAtual - bancaMesInicial;
      
          resultados.push({
            mes: mes,
            bancaInicial: bancaMesInicial,
            bancaFinal: bancaAtual,
            lucro: lucroMes,
            lucroPorcentagem: (lucroMes / bancaMesInicial) * 100
          });
        }
      
        // Total
        const totalBancaInicial = resultados[0].bancaInicial;
        const totalBancaFinal = resultados[resultados.length - 1].bancaFinal;
        const totalLucro = totalBancaFinal - totalBancaInicial;
        const totalLucroPorcentagem = (totalLucro / totalBancaInicial) * 100;
      
        resultados.push({
          mes: "TOTAL",
          bancaInicial: totalBancaInicial,
          bancaFinal: totalBancaFinal,
          lucro: totalLucro,
          lucroPorcentagem: totalLucroPorcentagem
        });
      
        return resultados;
      }
      
      // Exemplo de uso da função
    //   const bancaInicial = 400;
    //   const stopLoss = 5;
    //   const stopWin = 2.5;
    //   const objetoMesesCalculo = {
    //     mes1: [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    //     mes2: [0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    //   };
      
    //   const resultados = calcularBanca(bancaInicial, stopLoss, stopWin, objetoMesesCalculo);
      
    //   resultados.forEach((resultado) => {
    //     console.log(`Mês ${resultado.mes}`);
    //     console.log(`Banca inicial: R$ ${resultado.bancaInicial.toFixed(2)}`);
    //     console.log(`Banca Final: R$ ${resultado.bancaFinal.toFixed(2)}`);
    //     console.log(`Lucro: R$ ${resultado.lucro.toFixed(2)}`);
    //     console.log(`Lucro %: ${resultado.lucroPorcentagem.toFixed(2)}%\n`);
    //   });
      

    //Gera HTML para resultados
    function exibirResultadosHTML(resultados) {
        const resultadoDiv = document.getElementById("resultado");
      
        const table = document.createElement("table");
        const cabecalhoRow = document.createElement("tr");
      
        const cabecalhoMes = document.createElement("th");
        cabecalhoMes.innerText = "Mês";
        cabecalhoRow.appendChild(cabecalhoMes);
      
        const cabecalhoBancaInicial = document.createElement("th");
        cabecalhoBancaInicial.innerText = "Banca Inicial";
        cabecalhoRow.appendChild(cabecalhoBancaInicial);
      
        const cabecalhoBancaFinal = document.createElement("th");
        cabecalhoBancaFinal.innerText = "Banca Final";
        cabecalhoRow.appendChild(cabecalhoBancaFinal);
      
        const cabecalhoLucro = document.createElement("th");
        cabecalhoLucro.innerText = "Lucro";
        cabecalhoRow.appendChild(cabecalhoLucro);
      
        const cabecalhoLucroPorcentagem = document.createElement("th");
        cabecalhoLucroPorcentagem.innerText = "Lucro %";
        cabecalhoRow.appendChild(cabecalhoLucroPorcentagem);
      
        table.appendChild(cabecalhoRow);
      
        resultados.forEach((resultado) => {
          const row = document.createElement("tr");
      
          const celulaMes = document.createElement("td");
          celulaMes.innerText = resultado.mes;
          row.appendChild(celulaMes);
      
          const celulaBancaInicial = document.createElement("td");
          celulaBancaInicial.innerText = `R$ ${resultado.bancaInicial.toFixed(2)}`;
          row.appendChild(celulaBancaInicial);
      
          const celulaBancaFinal = document.createElement("td");
          celulaBancaFinal.innerText = `R$ ${resultado.bancaFinal.toFixed(2)}`;
          row.appendChild(celulaBancaFinal);
      
          const celulaLucro = document.createElement("td");
          celulaLucro.innerText = `R$ ${resultado.lucro.toFixed(2)}`;
          row.appendChild(celulaLucro);
      
          const celulaLucroPorcentagem = document.createElement("td");
          celulaLucroPorcentagem.innerText = `${resultado.lucroPorcentagem.toFixed(2)}%`;
          row.appendChild(celulaLucroPorcentagem);
      
          table.appendChild(row);
        });
      
        resultadoDiv.innerHTML = "";
        resultadoDiv.appendChild(table);
      
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
      
        const th = table.getElementsByTagName("th");
        for (let i = 0; i < th.length; i++) {
          th[i].style.border = "1px solid black";
          th[i].style.padding = "8px";
          th[i].style.backgroundColor = "purple";
        }
      
        const td = table.getElementsByTagName("td");
        for (let i = 0; i < td.length; i++) {
          td[i].style.border = "1px solid black";
          td[i].style.padding = "8px";
        }
      }
      
    //   const resultados = [
    //     {
    //       mes: "Mês 1",
    //       bancaInicial: 1000,
    //       bancaFinal: 1200,
    //       lucro: 200,
    //       lucroPorcentagem: 20
    //     },
    //     {
    //       mes: "Mês 2",
    //       bancaInicial: 1200,
    //       bancaFinal: 1500,
    //       lucro: 300,
    //       lucroPorcentagem: 25
    //     },
    //     {
    //       mes: "TOTAL",
    //       bancaInicial: 1000,
    //       bancaFinal: 1500,
    //       lucro: 500,
    //       lucroPorcentagem: 50
    //     }
    // ];
          
    //       exibirResultadosHTML(resultados);
      
      
      



  });
  