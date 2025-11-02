
setInterval(getDataHora, 1000);
getDataHora();

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./index.html";
} else {
  document.body.style.display = "block";
  console.log("Token disponível:", token);
}


document.addEventListener("DOMContentLoaded", () => {
  buscarHoras();
});


function getDataHora(){

    let agora = new Date();

    let dia = String(agora.getDate()).padStart(2, '0');
    let mes = agora.getMonth();

    let horas = String(agora.getHours()).padStart(2, '0');
    let minutos = String(agora.getMinutes()).padStart(2, '0');
    let segundos = String(agora.getSeconds()).padStart(2, '0');


    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const diaMes = `${dia} de ${meses[mes]}`;
    const horaMinSeg = `${horas}:${minutos}:${segundos}`
    const horaMin = `${horas}:${minutos}`

    document.getElementById('data').textContent = diaMes 
    document.getElementById('hora').textContent = horaMinSeg
    document.getElementById('hora2').textContent = horaMin
}

function formataDtHr(){
    let agora = new Date();

    let dia = String(agora.getDate()).padStart(2, '0');
    let mes = String(agora.getMonth() + 1).padStart(2, '0');
    let ano = agora.getFullYear();
    let horas = String(agora.getHours()).padStart(2, '0');
    let minutos = String(agora.getMinutes()).padStart(2, '0');
    let segundos = String(agora.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`
}

function copiarParaClipboard(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const sucesso = document.execCommand('copy');
        document.body.removeChild(textarea);
        return sucesso ? Promise.resolve() : Promise.reject('Erro ao copiar');
    } catch (err) {
        document.body.removeChild(textarea);
        return Promise.reject(err);
    }
}

function AlteraCopy(){
  const texto = document.getElementById('texto')
  console.log(texto)
  if (select.value === "0"){
    texto.innerText = "debora - entrada"
  }
  else if (select.value === "1"){
    texto.innerText = "debora - almoço"   
  }
  else if (select.value === "2"){
    texto.innerText = "debora - retorno"
  }
  else if (select.value === "3"){
    texto.innerText = "debora - saida"
  }
  console.log(select.value)
}

async function buscarHoras() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  const dataFormatada = `${ano}-${mes}-${dia}`;
  console.log(dataFormatada);

  const resposta = await fetch(`https://agenda-backend-gt9l.vercel.app/horario/${dataFormatada}` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const dados = await resposta.json();

  const container = document.getElementById("container");
  console.log(dados);
  if (Array.isArray(dados) && dados.length > 0) {
    dados.forEach(horario => {
      const entrada = horario.data;
      const hora = entrada.split("T")[1].split(":").slice(0,2).join(":");
      if (horario.tipo === 0){
        document.getElementById("lblhora0").textContent = `${hora}`
        select.options[(horario.tipo + 1)].disabled = true;
        select.options[(horario.tipo + 1)].style.display = "none";
      }
      else if (horario.tipo === 1){
        document.getElementById("lblhora1").textContent = `${hora}`
        select.options[(horario.tipo + 1)].disabled = true;
        select.options[(horario.tipo + 1)].style.display = "none";
      }
      else if (horario.tipo === 2){
        document.getElementById("lblhora2").textContent = `${hora}`
        select.options[(horario.tipo + 1)].disabled = true;
        select.options[(horario.tipo + 1)].style.display = "none";
      }
      else if (horario.tipo === 3){
        document.getElementById("lblhora3").textContent = `${hora}`
        select.options[(horario.tipo + 1)].disabled = true;
        select.options[(horario.tipo + 1)].style.display = "none";
      }
    });
    for (let i = 0; i < (select.options.length); i++){
      if (select.options[i].disabled === false){
        console.log(select.options[i])
      return
      }
    }
    select.options[0].textContent = ""
  }
}

async function buscarHoras2(data) {

  console.log(data)
  const dataFormatada = calendario.formatDate(data, "Y-m-d")

  const resposta = await fetch(`https://agenda-backend-gt9l.vercel.app/horario/${dataFormatada}` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const dados = await resposta.json();

  const container = document.getElementById("container");
  console.log(dados);
  if (Array.isArray(dados) && dados.length > 0) {
    dados.forEach(horario => {
  const entrada = horario.data;
    const hora = entrada.split("T")[1].split(":").slice(0,2).join(":");
      if (horario.tipo === 0){
        document.getElementById("lblhoraConsulta0").textContent = `${hora}`
      }
      else if (horario.tipo === 1){
        document.getElementById("lblhoraConsulta1").textContent = `${hora}`
      }
      else if (horario.tipo === 2){
        document.getElementById("lblhoraConsulta2").textContent = `${hora}`
      }
      else if (horario.tipo === 3){
        document.getElementById("lblhoraConsulta3").textContent = `${hora}`
      }
    });
  }
}



const select = document.getElementById('opcoes');
const resultado = document.getElementById('selecao');
const botao = document.getElementById('marcar');
const aviso = document.getElementById("aviso");

const fechar = document.getElementById("fechar");
const janela = document.getElementById("janela");
const confirmar = document.getElementById('confirmar');

const qrCode = document.getElementById('qrCode')
const btnOK = document.getElementById('ok')
const fechar3 = document.getElementById('fechar3')

const janela2 = document.getElementById("janela2");
const fechar2 = document.getElementById("fechar2");
const naoInformar = document.getElementById("naoInformar");
const informar = document.getElementById("informar");

const btnQrCode2 = document.getElementById('btnQrCode2')
const qrCode2 = document.getElementById('qrCode2')
const fechar4 = document.getElementById('fechar4')

const btnHistorico = document.getElementById('btnHistorico')
const modalHistorico = document.getElementById('modalHistorico')
const btnConsulta = document.getElementById('Consultar')
const modalConsulta = document.getElementById('consulta')

select.addEventListener("change", () =>{
    aviso.style.opacity = 0;
});

botao.addEventListener("click", () => {
    if (select.value === ""){
      if(select.options[0].textContent === ""){
        aviso.textContent = "Dia finalizado!!";
        aviso.style.color = "#87df87ff";
      }
      aviso.style.opacity = 100;
    }
    else{
        janela.style.display = "block";
        const textoSelecionado = select.options[select.selectedIndex].text;
        resultado.textContent = textoSelecionado;
    }

});
fechar.addEventListener("click", () => {
  janela.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === janela) {
    janela.style.display = "none";
  }
  else if (e.target === modalHistorico) {
    modalHistorico.style.display = "none";
  }
  else if (e.target === janela2) {
    janela2.style.display = "none";
  }
  else if (e.target === modalConsulta) {
    modalConsulta.style.display = "none";
    document.getElementById('lblhoraConsulta0').textContent = "-- --"
    document.getElementById('lblhoraConsulta1').textContent = "-- --"
    document.getElementById('lblhoraConsulta2').textContent = "-- --"
    document.getElementById('lblhoraConsulta3').textContent = "-- --"
  }
});

btnQrCode2.addEventListener("click", () => {
  qrCode2.style.display = "block"
})
fechar4.addEventListener("click", () => {
  qrCode2.style.display = "none"
})

confirmar.addEventListener("click", async () => {
  const tipo = select.value;
  const data = formataDtHr();
  const payload = {
    tipo: Number(tipo),
    data: data
  };
  const resposta = await fetch(`https://agenda-backend-gt9l.vercel.app/horario`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  AlteraCopy();
  select.options.selectedIndex = 0;
  buscarHoras();
  qrCode.style.display = "block";
  janela.style.display = "none";
})

fechar3.addEventListener("click", () => {
  qrCode.style.display = "none";
  janela2.style.display = "block"
});

fechar2.addEventListener("click", () => {
  janela2.style.display = "none";
});
naoInformar.addEventListener("click", () => {
  janela2.style.display = "none";
});

const link = "https://chat.whatsapp.com"
informar.addEventListener("click", () => {
  const texto = document.getElementById('texto').innerText;
  copiarParaClipboard(texto);
  janela2.style.display = "none";
  window.open(link);
});


btnHistorico.addEventListener("click", () =>{
  modalHistorico.style.display = "block"
})
fechar5.addEventListener("click", () => {
  modalHistorico.style.display = "none";
});

btnConsulta.addEventListener("click", () =>{
  modalConsulta.style.display = "block"
  modalHistorico.style.display = "none"
  buscarHoras2(calendario.selectedDates[0])
  document.getElementById('dataConsulta').innerText = calendario.formatDate(calendario.selectedDates[0], "d \\de\\ F")
  
})
fechar6.addEventListener("click", () => {
  modalConsulta.style.display = "none";
  document.getElementById('lblhoraConsulta0').textContent = "-- --"
  document.getElementById('lblhoraConsulta1').textContent = "-- --"
  document.getElementById('lblhoraConsulta2').textContent = "-- --"
  document.getElementById('lblhoraConsulta3').textContent = "-- --"
});

const calendario = flatpickr("#calendario", {
  inline: true,
  locale: "pt",       
  dateFormat: "d/m/Y",
  defaultDate: "today",
  maxDate: "today",
  });

select.addEventListener("focus", () => {
  const firstOption = select.querySelector('option[value=""]');
  if (firstOption) firstOption.style.display = "none";
});
