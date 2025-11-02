
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
} else {
    document.body.style.display = "block";
    console.log("Token disponível:", token);
}

const voltar = document.getElementById('voltar')
const lblSemana = document.getElementById('semana');

// referencias modal consultar semana
const btnSemana = document.getElementById('btnSemana');
const wdwBuscaSemana = document.getElementById('wdwBuscaSemana');
const fecharBuscaSemana = document.getElementById('fecharBuscaSemana');
const inputSemana = document.getElementById('inputSemana');
const btnBuscarSemana = document.getElementById('btnBuscarSemana');
const wdwNodados = document.getElementById('wdwNodados');
const fecharNodados = document.getElementById('fecharNodados');
const btnNodados = document.getElementById('btnNodados');



// referencias modal lancar venda
const btnVenda = document.getElementById('btnVenda');
const wdwVenda = document.getElementById('wdwVenda');
const fecharVenda = document.getElementById('fecharVenda');
const inputProduto = document.getElementById('inputProduto');
const inputQtd = document.getElementById('inputQtd');
const btnConfirmarVenda = document.getElementById('btnConfirmarVenda');
const autocomplete = document.getElementById('autocomplete')
const btnAddExclusivo = document.getElementById('addExclusivo')
const showExclusivo = document.getElementById('showExclusivo')
const inputExclusivo = document.getElementById('inputExclusivo')
const inputExclusivoQtd = document.getElementById('inputExclusivoQtd')


// referencias modal lancar meta
const wdwMeta = document.getElementById('wdwMeta');
const fecharMeta = document.getElementById('fecharMeta');
const inputMetaKit = document.getElementById('inputMetaKit');
const inputMetaTm = document.getElementById('inputMetaTm');
const btnConfirmarMeta = document.getElementById('btnConfirmarMeta');


// referencias exibicao de meta
const containerMeta = document.getElementById('containerMeta');
const barraVerde = document.getElementById('barraVerde');
const metaAtual = document.getElementById('metaAtual');
const metaRest = document.getElementById('metaRest');
const metaTotal = document.getElementById('metaTotal');
const tkAtual = document.getElementById('tkAtual');
const tkAlvo = document.getElementById('tkAlvo');

//referecias resumo
const lblValorReais = document.getElementById('lblValorReais')
const lblMediaDia = document.getElementById('lblMediaDia')
const lblMaisVendido = document.getElementById('lblMaisVendido')
const lblValorMedioReais = document.getElementById('lblValorMedioReais')


let obProdutos = new Object
let produtos = new Map()
let nomeProdutosVendas = []
let keyMaior
let totalVendas = 0
let totalProdutos = 0
let totalReais = 0

let weekNo = 0

onReady();


function onReady(){ //realiza a logica inicial da pagina
    getWeekOfYear();
    lblSemana.innerText = 'Semana ' + String(weekNo);
    const lbldia = document.getElementById(`dia${getWeekDay()}`);
    const lblNumber = document.getElementById(`Number${getWeekDay()}`);
    lblNumber.style.color = "#A1A1A1";
    lbldia.style.color = "#A1A1A1";
    btnVenda.style.display = "block"
    getAll();
}
async function getAll(){
    await getProdutos();
    await getVendas();
    await getMeta();
}
async function buscaGetAll(){
    await getProdutos();
    await getVendas2();
    if (!(await getMeta2())) {
        return
    }
    btnVenda.style.display = "none";
    lblSemana.innerText = 'Semana ' + String(weekNo);


}

function blockScroll(){
    if (document.body.style.overflowY !== "hidden"){
        console.log("ativo")
        document.body.style.overflowY = "hidden";
    }
    else{
        console.log("inativo")
        document.body.style.overflowY = "auto";
    }
}
function enableConfirmar(){
    if ((inputProduto.value !== "") && (inputQtd.value !== "")){
        btnConfirmarVenda.disabled = false;
    } 
}
function enableConfirmarMeta(){
    if ((inputMetaKit.value !== "") && (inputMetaTm.value !== "")){
        btnConfirmarMeta.disabled = false;
    } 
}

function getKeyBvalue(mapa, value) {
    for (const [key, val] of mapa) {
        if (val === value) {
            return key;
        }
    }
    return null;
}

const espere = ms => new Promise(r => setTimeout(r, ms));

async function getMeta() {
    metaTotal.innerText = "Total: 00.0"
    metaAtual.innerText = "Atingido: 00.0" 
    metaRest.innerText = "Restam: 00.0" 
    tkAtual.innerText = "Atual: 00.0"
    tkAlvo.innerText = "Alvo: 00.0"
    barraVerde.style.width = `0%`
    tkAtual.style.color = "#ccc"

    const resposta = await fetch (`http://192.168.0.103:3000/meta/${weekNo}` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
    const dados = await resposta.json();
    if (dados.length === 0){
        wdwMeta.style.display = "block"
        blockScroll();      
    }
    metaTotal.innerText = "Total: " + dados[0].metaKit.toFixed(1)
    metaAtual.innerText = "Atingido: " + totalVendas.toFixed(1)
    metaRest.innerText = "Restam: " + ((dados[0].metaKit - totalVendas).toFixed(1)).padStart(4,"0")
    tkAtual.innerText = "Atual: " + (totalReais/totalProdutos).toFixed(1)
    tkAlvo.innerText = "Alvo: " + String(dados[0].metaTm).padStart(3,"0");
    if (Number(tkAtual.innerText.slice("Atual: ".length)) >= Number(tkAlvo.innerText.slice("Alvo: ".length))){
        tkAtual.style.color = "#87df87"
    }
    perCemBarra = ((totalVendas * 100)/ dados[0].metaKit )
    if (perCemBarra >= 100){
        const estrelinha = document.createElement('img')
        estrelinha.src = "./assets/Star.png"
        estrelinha.className = "estrelinha"
        containerMeta.appendChild(estrelinha)
        barraVerde.style.borderTopRightRadius = "6px"  
        barraVerde.style.borderBottomRightRadius = "6px"
        perCemBarra = 100
    }
    barraVerde.style.width = `${perCemBarra}%`
    if ((dados[0].metaKit - totalVendas) < 0){
        metaRest.innerText = "Restam: 00.0"
    }
}
async function getMeta2() {
    metaTotal.innerText = "Total: 00.0"
    metaAtual.innerText = "Atingido: 00.0" 
    metaRest.innerText = "Restam: 00.0" 
    tkAtual.innerText = "Atual: 00.0"
    tkAlvo.innerText = "Alvo: 00.0"
    barraVerde.style.width = `0%`
    tkAtual.style.color = "#ccc"

    const resposta = await fetch (`http://192.168.0.103:3000/meta/${weekNo}` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
    const dados = await resposta.json();
    if (dados.length === 0){
        console.log(dados)
        wdwNodados.style.display = "block"
        onReady();
        blockScroll();
        return false
    }
    metaTotal.innerText = "Total: " + dados[0].metaKit.toFixed(1)
    metaAtual.innerText = "Atingido: " + totalVendas.toFixed(1)
    metaRest.innerText = "Restam: " + ((dados[0].metaKit - totalVendas).toFixed(1)).padStart(4,"0")
    tkAtual.innerText = "Atual: " + ( (totalProdutos === 0) ? "00.0" : (totalReais/totalProdutos).toFixed(1) )
    tkAlvo.innerText = "Alvo: " + String(dados[0].metaTm).padStart(3,"0");
    if (Number(tkAtual.innerText.slice("Atual: ".length)) >= Number(tkAlvo.innerText.slice("Alvo: ".length))){
        tkAtual.style.color = "#87df87"
    }
    perCemBarra = ((totalVendas * 100)/ dados[0].metaKit )
    if (perCemBarra >= 100){
        const estrelinha = document.createElement('img')
        estrelinha.src = "./assets/Star.png"
        estrelinha.className = "estrelinha"
        containerMeta.appendChild(estrelinha)
        barraVerde.style.borderTopRightRadius = "6px"  
        barraVerde.style.borderBottomRightRadius = "6px"
        perCemBarra = 100
    }
    barraVerde.style.width = `${perCemBarra}%`
    if ((dados[0].metaKit - totalVendas) < 0){
        metaRest.innerText = "Restam: 00.0"
    }
    return true
}
async function getProdutos(){ //acessa a api para pegar a lista de produtos
    const resposta = await fetch (`http://192.168.0.103:3000/produtos` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
    const dados = await resposta.json();
    obProdutos = dados
    console.log(obProdutos)
    dados.forEach(produto => {
        produtos.set(produto._id ,produto.nome);
    });
    console.log(produtos)
}
async function getVendas() {
    for (let i = 0; i < 7; i++) {
        const number = document.getElementById(`Number${i}`);
        number.innerText = 0.0;
        const barra = document.getElementById(`barra${i}`);
        barra.innerHTML = "";
    }
    totalVendas = 0
    totalProdutos = 0
    totalReais = 0
    nomeProdutosVendas = []
    keyMaior = null
    lblValorReais.innerText = 'R$ 0.00'
    lblValorMedioReais.innerText = 'R$ 0.00'
    lblMediaDia.innerText = '0.0'
    lblMaisVendido.innerText = ""

    const resposta = await fetch (`http://192.168.0.103:3000/vendas/${weekNo}`,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
    const dados = await resposta.json();
    dados.forEach(venda => {
        nomeProdutosVendas.push(venda.id_produto)
        const vendaTemExclusivo = (venda.exclusivo ? 1 : 0)
        const number = document.getElementById(`Number${venda.dia}`);
        const valorAtual = number.innerText
        number.innerText = (Number(valorAtual) + ((obProdutos[venda.id_produto - 1].peso)*venda.qtd) + (venda.exclusivo ? 1 : 0)).toFixed(1)
        totalProdutos += Number(venda.qtd)
        totalReais += Number(((((obProdutos[venda.id_produto - 1].valorUt)*obProdutos[venda.id_produto - 1].qtd))*venda.qtd) + (venda.exclusivo ? 139.9 : 0))
    });
    console.log(nomeProdutosVendas)
    const maisVendido = getMaisVendido(nomeProdutosVendas)
    console.log(maisVendido)
    for (let i = 0; i < 7; i++){
        const number = document.getElementById(`Number${i}`);
        totalVendas += Number(number.innerText);
        const inteiros = parseInt(Number(number.innerText))
        const meios = (Number(number.innerText)%1)
        for (let j = 0; j < inteiros; j++) {
            const barra = document.getElementById(`barra${i}`);
            const bloco = document.createElement("div")
            bloco.className = "barra";
            barra.appendChild(bloco);
        }
        for (let j = 0; j < meios; j++) {
            const barra = document.getElementById(`barra${i}`);
            const bloco = document.createElement("div")
            bloco.className = "barraHalf";
            barra.appendChild(bloco);
        }
    }
    for (let i = 0; i < 7; i++) {
        const barra = document.getElementById(`barra${i}`);
        if (barra.innerHTML === ""){
            const bloco = document.createElement("div")
            bloco.className = "barraNull";
            barra.appendChild(bloco);   
        }
    }
    lblValorReais.innerText = 'R$ ' + totalReais.toFixed(2)
    lblValorMedioReais.innerText = 'R$ ' + (totalReais / (getWeekDay() + 1)).toFixed(2)
    lblMediaDia.innerText = (totalVendas / (getWeekDay() + 1 )).toFixed(1)
    lblMaisVendido.innerText = (obProdutos[keyMaior - 1] !== undefined) ? (obProdutos[keyMaior - 1].nome) : "Nenhum produto vendido" 

}
async function getVendas2() {
    for (let i = 0; i < 7; i++) {
        const number = document.getElementById(`Number${i}`);
        number.innerText = 0.0;
        const barra = document.getElementById(`barra${i}`);
        barra.innerHTML = "";
    }
    totalVendas = 0
    totalProdutos = 0
    totalReais = 0
    nomeProdutosVendas = []
    keyMaior = null
    lblValorReais.innerText = 'R$ 0.00'
    lblValorMedioReais.innerText = 'R$ 0.00'
    lblMediaDia.innerText = '0.0'
    lblMaisVendido.innerText = ""

    const resposta = await fetch (`http://192.168.0.103:3000/vendas/${weekNo}` ,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
    const dados = await resposta.json();
    dados.forEach(venda => {
        nomeProdutosVendas.push(venda.id_produto)
        const vendaTemExclusivo = (venda.exclusivo ? 1 : 0)
        const number = document.getElementById(`Number${venda.dia}`);
        const valorAtual = number.innerText
        number.innerText = (Number(valorAtual) + ((obProdutos[venda.id_produto - 1].peso)*venda.qtd) + (venda.exclusivo ? 1 : 0)).toFixed(1)
        totalProdutos += Number(venda.qtd)
        totalReais += Number(((((obProdutos[venda.id_produto - 1].valorUt)*obProdutos[venda.id_produto - 1].qtd))*venda.qtd) + (venda.exclusivo ? 139.9 : 0))
    });
    console.log(nomeProdutosVendas)
    const maisVendido = getMaisVendido(nomeProdutosVendas)
    console.log(maisVendido)
    for (let i = 0; i < 7; i++){
        const number = document.getElementById(`Number${i}`);
        totalVendas += Number(number.innerText);
        const inteiros = parseInt(Number(number.innerText))
        const meios = (Number(number.innerText)%1)
        for (let j = 0; j < inteiros; j++) {
            const barra = document.getElementById(`barra${i}`);
            const bloco = document.createElement("div")
            bloco.className = "barra";
            barra.appendChild(bloco);
        }
        for (let j = 0; j < meios; j++) {
            const barra = document.getElementById(`barra${i}`);
            const bloco = document.createElement("div")
            bloco.className = "barraHalf";
            barra.appendChild(bloco);
        }
    }
    for (let i = 0; i < 7; i++) {
        const barra = document.getElementById(`barra${i}`);
        if (barra.innerHTML === ""){
            const bloco = document.createElement("div")
            bloco.className = "barraNull";
            barra.appendChild(bloco);   
        }
    }
    lblValorReais.innerText = 'R$ ' + totalReais.toFixed(2)
    lblValorMedioReais.innerText = 'R$ ' + (totalReais / (7)).toFixed(2)
    lblMediaDia.innerText = (totalVendas / (7)).toFixed(1)
    lblMaisVendido.innerText = (obProdutos[keyMaior - 1] !== undefined) ? (obProdutos[keyMaior - 1].nome) : "Nenhum produto vendido" 

}

function getMaisVendido(lista){
    dict = {}
    maior = 0
    lista.forEach(i => {
        if (i in dict){
            dict[i] += 1
        }
        else{
            dict[i] = 1
        }
    }); 
    for (i in dict){
        if (maior < dict[i]){
            maior = dict[i]
            keyMaior = i
        }
    }
    return keyMaior
}

function getWeekOfYear() { //pega a semana do ano
    const date =  new Date();
    const data = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    const dayNum = data.getUTCDay() || 7;
    data.setUTCDate(data.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(data.getUTCFullYear(), 0, 1));
    weekNo = Math.ceil(((data - yearStart) / 86400000 + 1) / 7);

    return weekNo;
}

function getWeekDay(){ //retorna dia da semana 0 a 6
    const dia = new Date().getDay();
    return dia
}

// Fechar ao clicar em modal
window.addEventListener('click', (e) =>{
    if (e.target == wdwBuscaSemana){
        wdwBuscaSemana.style.display = "none";
        blockScroll()
    }
    else if (e.target == wdwVenda){
        wdwVenda.style.display = "none";
        blockScroll()
        inputProduto.value = "";
        inputQtd.value = "";
        inputExclusivo.value = "";
        inputExclusivoQtd.value = "";
        btnAddExclusivo.style.display = "block";
        showExclusivo.style.display = "none";
        btnConfirmarVenda.disabled = true;
        if (autocomplete.querySelector("#exclusivo") === null) {
            const btn = document.createElement("button");
            btn.id = "exclusivo";
            btn.addEventListener('click' , () => {
                inputProduto.value = "exclusivo";
            })
            btn.textContent = "exclusivo";
            btn.className = "autocompleteS";
            autocomplete.prepend(btn);
        }
    }
    else if (e.target == wdwMeta){
        wdwMeta.style.display = "none";
        blockScroll()
    }
    else if (e.target == wdwNodados){
        wdwNodados.style.display = "none";
        blockScroll()
    }
    
})

//btn de voltar
voltar.addEventListener('click', () =>{
    if (btnVenda.style.display === "none") {
        voltar.href = "vendas.html"
    }
})



// modal buscar semana
fecharBuscaSemana.addEventListener('click', () => {
    blockScroll();
    wdwBuscaSemana.style.display = "none";
})
btnSemana.addEventListener('click', () => {
    blockScroll();
    wdwBuscaSemana.style.display = "block";
})
inputSemana.addEventListener('change', () =>{
    if (inputSemana.value !== ""){
        btnBuscarSemana.disabled = false
    }
})
btnBuscarSemana.addEventListener('click' , () => {
    if (weekNo === Number(inputSemana.value)) {
        inputSemana.value = ""
        btnBuscarSemana.disabled = true
        blockScroll();
        wdwBuscaSemana.style.display = "none";
        return
    }
    weekNo = Number(inputSemana.value);
    inputSemana.value = ""
    btnBuscarSemana.disabled = true
    buscaGetAll();
    blockScroll();
    wdwBuscaSemana.style.display = "none";
})
fecharNodados.addEventListener('click', () => {
    blockScroll();
    wdwNodados.style.display = "none";
})
btnNodados.addEventListener('click', () => {
    blockScroll();
    wdwNodados.style.display = "none";
})

// modal lancar vendas
fecharVenda.addEventListener('click', () => {
    blockScroll();
    wdwVenda.style.display = "none";
    inputProduto.value = "";
    inputQtd.value = "";
    inputExclusivo.value = "";
    inputExclusivoQtd.value = "";
    btnAddExclusivo.style.display = "block";
    showExclusivo.style.display = "none";
    btnConfirmarVenda.disabled = true;
    if (autocomplete.querySelector("#exclusivo") === null) {
            const btn = document.createElement("button");
            btn.id = "exclusivo";
            btn.addEventListener('click' , () => {
                inputProduto.value = "exclusivo";
            })
            btn.textContent = "exclusivo";
            btn.className = "autocompleteS";
            autocomplete.prepend(btn);
    }
})
btnVenda.addEventListener('click', async () => {
    blockScroll();
    wdwVenda.style.display = "block";
    inputQtd.value = 1
    if (!(autocomplete.hasChildNodes())){
        produtos.forEach(i => {
            const btn = document.createElement("button");
            btn.id = i;
            btn.addEventListener('click' , () => {
                inputProduto.value = i;
            })
            btn.textContent = i;
            btn.className = "autocompleteS";
            autocomplete.appendChild(btn);
        })
    };

})
inputProduto.addEventListener('input', () =>{
    autocomplete.innerHTML = ""
    produtos.forEach(i => {
        if (i.includes(inputProduto.value.toLowerCase())){
            const btn = document.createElement("button");
            btn.id = i;
            btn.addEventListener('click' , () => {
                inputProduto.value = i;
            })
            btn.textContent = i;
            btn.className = "autocompleteS";
            autocomplete.appendChild(btn);
        }
    })
})

inputProduto.addEventListener('change', () =>{
    const valor = inputProduto.value;
    if (!produtos.has(valor)){
        inputProduto.value = ""
    }
})
inputQtd.addEventListener('change', () =>{
    enableConfirmar();
})
inputProduto.addEventListener('focus', () =>{
    autocomplete.style.display = "flex"
})
inputProduto.addEventListener('blur', async () =>{
    await espere(150)
    autocomplete.style.display = "none"
    enableConfirmar();
})
btnAddExclusivo.addEventListener('click', () => {
    btnAddExclusivo.style.display = "none"
    showExclusivo.style.display = "flex"
    inputExclusivo.value = "exclusivo"
    inputExclusivoQtd.value = 1
    autocomplete.querySelector("#exclusivo").remove();
    if (inputProduto.value === "exclusivo") {
        inputProduto.value = "";
        btnConfirmarVenda.disabled = true
    }
})
btnConfirmarVenda.addEventListener('click', async () => {
    const hasExclusivo = (inputExclusivoQtd.value > 0) ? true : false;
    const payload = {
        semana: weekNo,
        dia: getWeekDay(),
        id_produto: getKeyBvalue(produtos ,inputProduto.value),
        exclusivo: hasExclusivo,
        qtd: inputQtd.value,
    };
    const resposta = await fetch(`http://192.168.0.103:3000/vendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
    blockScroll();
    wdwVenda.style.display = "none";
    inputProduto.value = "";
    inputQtd.value = "";
    inputExclusivo.value = "";
    inputExclusivoQtd.value = "";
    btnAddExclusivo.style.display = "block";
    showExclusivo.style.display = "none";
    btnConfirmarVenda.disabled = true;
    if (autocomplete.querySelector("#exclusivo") === null) {
            const btn = document.createElement("button");
            btn.id = "exclusivo";
            btn.addEventListener('click' , () => {
                inputProduto.value = "exclusivo";
            })
            btn.textContent = "exclusivo";
            btn.className = "autocompleteS";
            autocomplete.prepend(btn);
    }
    getVendas();
    getMeta();
})

//modal lancar meta
fecharMeta.addEventListener('click', () => {
    blockScroll();
    wdwMeta.style.display = "none";
})
inputMetaKit.addEventListener('blur', () =>{
    enableConfirmarMeta();
})
inputMetaTm.addEventListener('blur', () =>{
    enableConfirmarMeta();
})
btnConfirmarMeta.addEventListener('click', async () =>{
        const payload = {
        semana: weekNo,
        metaKit: inputMetaKit.value,
        metaTm: inputMetaTm.value,
    };
    const resposta = await fetch(`http://192.168.0.103:3000/meta`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
    wdwMeta.style.display = "none";
    inputMetaKit.value = "";
    inputMetaTm.value = "";
    btnConfirmarMeta.disabled = true
    blockScroll();
    getMeta();
})