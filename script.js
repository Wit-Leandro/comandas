/* ================= VARIÁVEIS ================= */

let totalDia = 0;

let clientes = [];

let historico = [];

let contadorCliente = 1;

let deliveryItens = [];

let historicoDelivery = [];

let totalDelivery = 0;

let fiados = [];

let ocultarValores = false;


/* ================= SALVAR E CARREGAR DADOS ================= */

function salvarDados(){

  localStorage.setItem(
    "clientes",
    JSON.stringify(clientes)
  );

  localStorage.setItem(
    "historico",
    JSON.stringify(historico)
  );

  localStorage.setItem(
    "totalDia",
    totalDia
  );

  localStorage.setItem(
    "contadorCliente",
    contadorCliente
  );

  localStorage.setItem(
    "deliveryItens",
    JSON.stringify(deliveryItens)
  );

  localStorage.setItem(
    "historicoDelivery",
    JSON.stringify(historicoDelivery)
  );

  localStorage.setItem(
    "totalDelivery",
    totalDelivery
  );

    localStorage.setItem(
    "fiados",
    JSON.stringify(fiados)
  );
}

function carregarDados(){

  const c = localStorage.getItem("clientes");
  const h = localStorage.getItem("historico");
  const td = localStorage.getItem("totalDia");
  const cc = localStorage.getItem("contadorCliente");

  const di = localStorage.getItem("deliveryItens");
  const hd = localStorage.getItem("historicoDelivery");
  const tdel = localStorage.getItem("totalDelivery");
  const f = localStorage.getItem("fiados");

  if(c) clientes = JSON.parse(c);

  if(h) historico = JSON.parse(h);

  if(td) totalDia = parseFloat(td);

  if(cc) contadorCliente = parseInt(cc);

  if(di) deliveryItens = JSON.parse(di);

  if(hd) historicoDelivery = JSON.parse(hd);

  if(tdel) totalDelivery = parseFloat(tdel);

  if(f) fiados = JSON.parse(f);
}

/* ================= RESUMO ================= */

function atualizarResumo(){

  let aberto = clientes.reduce(
    (soma,c)=> soma + totalCliente(c),
    0
  );

  let totalFiados = fiados.reduce(
    (soma,f)=> soma + totalFiado(f),
    0
  );

  let maior = 0;

  [...historico].reverse().forEach(h=>{
    if(h.total > maior){
      maior = h.total;
    }
  });

  [...historicoDelivery].reverse().forEach(h=>{
    if(h.total > maior){
      maior = h.total;
    }
  });

  // TOTAL DIA
  document.getElementById("totalDia")
  .innerText =
  ocultarValores
    ? "••••"
    : (totalDia + totalDelivery).toFixed(2);

  // DELIVERY
  document.getElementById("totalDelivery")
  .innerText =
  ocultarValores
    ? "••••"
    : totalDelivery.toFixed(2);

  // EM ABERTO
  document.getElementById("totalAberto")
  .innerText =
  ocultarValores
    ? "••••"
    : (aberto + totalFiados).toFixed(2);

  // CLIENTES
  document.getElementById("qtdClientes")
    .innerText =
      historico.length +
      historicoDelivery.length;

  // MAIOR VENDA
  document.getElementById("maiorVenda")
  .innerText =
  ocultarValores
    ? "••••"
    : maior.toFixed(2);
  
    // FIADOS

  const fiadoTela =
    document.getElementById("totalFiados");

  if(fiadoTela){

    fiadoTela.innerText =
  ocultarValores
    ? "••••"
    : totalFiados.toFixed(2);
  }  
}

/* ================= CLIENTES ================= */

function totalCliente(cliente){

  return cliente.itens.reduce(
    (soma,v)=> soma + v,
    0
  );
}

function criarCliente(){

  clientes.push({
    id:contadorCliente++,
    nome:"",
    itens:[]
  });

  salvarDados();

  renderClientes();
}

function renderClientes(){

  const container =
    document.getElementById("clientes");

  container.innerHTML = "";

  clientes.forEach((cliente,index)=>{

    let itens = cliente.itens.map((v,i)=>`

      <div class="item">

        R$ ${v.toFixed(2)}

        <button class="remover"
          onclick="removerItem(${index},${i})">
          X
        </button>

      </div>

    `).join("");

    const div = document.createElement("div");

    div.className = "mesa";

    div.innerHTML = `

      <h2>Cliente ${cliente.id}</h2>

      <input
        type="text"
        placeholder="Nome do cliente"
        value="${cliente.nome}"
        onchange="setNome(${index},this.value)"
      >

    <input
        type="number"
        id="valor${index}"
        placeholder="Valor"
        onkeydown="enterCliente(event, ${index})"
    >

      <button class="add"
        onclick="adicionar(${index})">
        Adicionar
      </button>

      ${itens}

      <div class="totalMesa">
        Total:
        R$ ${totalCliente(cliente).toFixed(2)}
      </div>

      <input
        type="number"
        id="pago${index}"
        placeholder="Valor pago"
        oninput="calcularTroco(${index})"
        onkeydown="enterFinalizar(event, ${index})"
      >

      <div id="troco${index}" class="trocoBox"></div>

      <button class="pagar"
        onclick="finalizar(${index})">
        Finalizar
      </button>

    `;

    container.appendChild(div);

  });

  atualizarResumo();
}

function adicionar(i){

  let input =
    document.getElementById("valor"+i);

  let valor = parseFloat(input.value);

  if(!valor || valor <= 0){

    alert("Valor inválido");

    return;
  }

  clientes[i].itens.push(valor);

  input.value = "";

  salvarDados();

  renderClientes();
}

function removerItem(ci,ii){

  clientes[ci].itens.splice(ii,1);

  salvarDados();

  renderClientes();
}

function setNome(i,n){

  clientes[i].nome = n;

  salvarDados();
}

function calcularTroco(i){

  let pago = parseFloat(
    document.getElementById("pago"+i).value
  ) || 0;

  let total = totalCliente(clientes[i]);

  let div =
    document.getElementById("troco"+i);

  if(pago === 0){

    div.innerHTML = "";

    return;
  }

  if(pago < total){

    div.innerHTML =
      `Falta: R$ ${(total-pago).toFixed(2)}`;

    div.style.color = "red";

  }else{

    div.innerHTML =
      `Troco: R$ ${(pago-total).toFixed(2)}`;

    div.style.color = "green";
  }
}

function finalizar(i){

  let c = clientes[i];

  let total = totalCliente(c);

  let pago = parseFloat(
    document.getElementById("pago"+i).value
  ) || 0;

  if(total === 0){

    alert("Cliente sem consumo");

    return;
  }

  if(pago < total){

    alert("Pagamento insuficiente");

    return;
  }

  totalDia += total;

  historico.push({

    id:c.id,

    nome:c.nome,

    itens:[...c.itens],

    total:total,

    pago:pago,

    troco:pago-total,

    data:new Date().toLocaleString()

  });

  clientes.splice(i,1);

  salvarDados();

  renderClientes();
}

/* ================= DELIVERY ================= */

function adicionarDelivery(){

  let input =
    document.getElementById("valorDelivery");

  let valor = parseFloat(input.value);

  if(!valor || valor <= 0){

    alert("Valor inválido");

    return;
  }

  deliveryItens.push(valor);

  input.value = "";

  salvarDados();

  renderDelivery();
}

function renderDelivery(){

  const lista =
    document.getElementById("listaDelivery");

  lista.innerHTML = "";

  let total = 0;

  deliveryItens.forEach((v,i)=>{

    total += v;

    lista.innerHTML += `

      <div class="item">

        R$ ${v.toFixed(2)}

        <button class="remover"
          onclick="removerDelivery(${i})">
          X
        </button>

      </div>

    `;
  });

  document.getElementById("totalDeliveryTela")
    .innerText = total.toFixed(2);

  atualizarResumo();
}

function removerDelivery(i){

  deliveryItens.splice(i,1);

  salvarDados();

  renderDelivery();
}

function finalizarDelivery(){

  if(deliveryItens.length === 0){

    alert("Nenhum lançamento");

    return;
  }

  let total = deliveryItens.reduce(
    (s,v)=> s + v,
    0
  );

  totalDelivery += total;

  historicoDelivery.push({

    itens:[...deliveryItens],

    total:total,

    data:new Date().toLocaleString()

  });

  deliveryItens = [];

  salvarDados();

  renderDelivery();

  atualizarResumo();

  alert("Delivery finalizado");
}

/* ================= HISTÓRICO ================= */

function renderHistorico(){

  const container =
    document.getElementById("historico");

  container.innerHTML = "";

  [...historico].reverse().forEach(h=>{

    const nome = h.nome || "-";

    const itens = (h.itens || [])
      .map(v=>`R$ ${v.toFixed(2)}`)
      .join(", ");

    const pago = h.pago ?? h.total;

    const troco = h.troco ?? 0;

    const data = h.data || "";

    container.innerHTML += `

      <div class="historicoItem">

        <strong>Cliente ${h.id}</strong><br>

        Nome: ${nome}<br>

        Itens: ${itens || "-"}<br>

        Total: R$ ${h.total.toFixed(2)}<br>

        Pago: R$ ${pago.toFixed(2)}<br>

        Troco: R$ ${troco.toFixed(2)}<br>

        ${data ? `Data: ${data}` : ""}

      </div>

    `;
  });

  [...historicoDelivery].reverse().forEach(h=>{

    const itens = (h.itens || [])
      .map(v=>`R$ ${v.toFixed(2)}`)
      .join(", ");

    container.innerHTML += `

      <div class="historicoItem"
        style="border-left-color:#fd7e14;">

        <strong>🛵 Delivery</strong><br>

        Itens: ${itens}<br>

        Total: R$ ${h.total.toFixed(2)}<br>

        Data: ${h.data}

      </div>

    `;
  });
}

function toggleHistorico(){
  const btnFiados = document.getElementById("btnFiado");

  const areaClientes =
    document.getElementById("areaClientes");

  const areaHistorico =
    document.getElementById("areaHistorico");

  const btnfecharcaixa = document.getElementById("btnfecharCaixa");

  const btnDelivery = document.getElementById("btnDelivery")

  const btn =
    document.getElementById("btnToggle");

  const btnNovo =
    document.getElementById("btnNovoCliente");

  if(!areaHistorico.classList.contains("hidden")){

    areaHistorico.classList.add("hidden");

    areaClientes.classList.remove("hidden");

    btn.innerText = "Histórico";

    btnNovo.style.display = "block";

    btnfecharcaixa.style.display = "block";

    btnDelivery.style.display = "block";

    btnFiados.style.display = "block";

  }else{

    areaClientes.classList.add("hidden");

    areaHistorico.classList.remove("hidden");

    btn.innerText = "Voltar às mesas";

    btnNovo.style.display = "none";

    btnfecharcaixa.style.display = "none";

    btnDelivery.style.display = "none";

    btnFiados.style.display = "none";

    renderHistorico();
  }
}

/* ================= FECHAR CAIXA ================= */

function fecharCaixa(){

  if(totalDia === 0 &&
     totalDelivery === 0){

    alert("Nada para fechar");

    return;
  }

  const senha =
    prompt("Digite a senha:");

  const senhaCorreta = "1234";

  if(senha !== senhaCorreta){

    alert("Senha incorreta");

    return;
  }

  if(!confirm("Confirmar fechamento?")){

    return;
  }

  let maior = 0;

  [...historico].reverse().forEach(h=>{
    if(h.total > maior){
      maior = h.total;
    }
  });

  [...historicoDelivery].reverse().forEach(h=>{
    if(h.total > maior){
      maior = h.total;
    }
  });

  let html = `

    <html>

    <body style="
      font-family:Arial;
      text-align:center;
      padding:20px;
    ">

      <h2>Relatório do Dia</h2>

      <p>
        Salão:
        R$ ${totalDia.toFixed(2)}
      </p>

      <p>
        Delivery:
        R$ ${totalDelivery.toFixed(2)}
      </p>

      <h3>
        Total Geral:
        R$ ${(totalDia + totalDelivery).toFixed(2)}
      </h3>

      <p>
        Clientes atendidos:
        ${historico.length + historicoDelivery.length}
      </p>

      <p>
        Maior venda:
        R$ ${maior.toFixed(2)}
      </p>

      <hr>

      <p>
        ${new Date().toLocaleString()}
      </p>

    </body>

    </html>

  `;

  let w = window.open("");

  w.document.write(html);

  w.print();

  totalDia = 0;

  clientes = [];

  historico = [];

  contadorCliente = 1;

  deliveryItens = [];

  historicoDelivery = [];

  totalDelivery = 0;

  localStorage.removeItem("clientes");
  localStorage.removeItem("historico");
  localStorage.removeItem("totalDia");
  localStorage.removeItem("contadorCliente");
  localStorage.removeItem("deliveryItens");
  localStorage.removeItem("historicoDelivery");
  localStorage.removeItem("totalDelivery");

  renderDelivery();

  renderClientes();
}

function toggleDelivery(){

  const btnDelivery = document.getElementById("btnDelivery")

  const painelDelivery = document.getElementById("painelDelivery");

  painelDelivery.classList.toggle("hidden");

  if(!painelDelivery.classList.contains("hidden")){
    btnDelivery.innerText = "Ocutar Delivery";

  } else{
    btnDelivery.innerText = "+ Delivery";

  }  
}

function enterCliente(event, index){

  if(event.key === "Enter" || event.keyCode === 13){

    event.preventDefault();

    adicionar(index);

    setTimeout(()=>{

      document.getElementById("valor"+index).focus();

    },50);
  }
}

function enterDelivery(event){

  if(event.key === "Enter"){

    adicionarDelivery();

    setTimeout(()=>{

      document.getElementById("valorDelivery").focus();

    },50);
  }
}

function totalFiados(fiado){
  return fiado.itens.reduce(
    (s,v)=> s + v,
    0
  );
}

function adicionarFiado(){
  let nome = document.getElementById("nomeFiado").value;
  let valor = document.getElementById("valorFiado").value;

  if (!nome || !valor || valor <= 0){
    alert("preencha corretamente");
    return;
  }
  let existente = fiados.find(
    f=> f.nome.toLowerCase() === nome.toLowerCase()
  );
  if(existente){
    existente.itens.push(valor);
  }else{
    fiados.push({
      nome: nome,
      itens: [valor]
    });
  }
  document.getElementById("valorFiado").value = "";

  salvarDados();
  renderFiados();
}

function totalFiado(fiado){
  return fiado.itens.reduce((soma, v)=>{
    return soma + parseFloat(v);
  },0);
}

function renderFiados(){

const lista =
  document.getElementById("listaFiados");

lista.innerHTML = "";

fiados.forEach((f,index)=>{

  let itens = "";

  f.itens.forEach((v,i)=>{

    itens += `

      <div class="item">

        R$ ${parseFloat(v).toFixed(2)}

        <button class="remover"
          onclick="removerFiado(${index},${i})">
          X
        </button>

      </div>

    `;
  });

  lista.innerHTML += `

    <div class="historicoItem">

      <strong>${f.nome}</strong>

      ${itens}

      <div class="totalMesa">

        Total:
        R$ ${totalFiado(f).toFixed(2)}

      </div>

      <button class="pagar"
        onclick="quitarFiado(${index})">

        Quitar Fiado

      </button>

    </div>

  `;
});

atualizarResumo();
}

function removerFiado(fi,ii){

fiados[fi].itens.splice(ii,1);

if(fiados[fi].itens.length === 0){

  fiados.splice(fi,1);
}

salvarDados();

renderFiados();
}

function quitarFiado(index){

let f = fiados[index];

let total = totalFiado(f);

totalDia += total;

historico.push({

  id:"Fiado",

  nome:f.nome,

  itens:[...f.itens],

  total:total,

  pago:total,

  troco:0,

  data:new Date().toLocaleString()

});

fiados.splice(index,1);

salvarDados();

renderFiados();

atualizarResumo();

alert("Fiado quitado");
}

function toggleFiado(){
  const painelFiado = document.getElementById("painelFiado");
  painelFiado.classList.toggle("hidden")

  const btnFiado = document.getElementById("btnFiado")

  if(!painelFiado.classList.contains("hidden")){
    btnFiado.innerText = "Ocutar Fiado";

  } else{
    btnFiado.innerText = "+ Fiado";

  }  
}

function enterFiado(event){
  if(event.key === "Enter"){
    adicionarFiado();
    setTimeout(()=>{
      document.getElementById("valorFiado").focus();
    },50);
  }
}

function enterFinalizar(event, index){
	if(event.key === "Enter"){
		finalizar(index);
	}
}

function toggleValores(){

  ocultarValores = !ocultarValores;

  const btn =
    document.getElementById("btnOlho");

  btn.innerText =
    ocultarValores ? "🙈" : "👁️";

  atualizarResumo();
}

document.addEventListener(

  "keydown",

  function(event){

    // F2 = Novo Cliente

    if(event.key === "F2"){

      event.preventDefault();

      criarCliente();
    }

    // F3 = Histórico

    if(event.key === "F3"){

      event.preventDefault();

      toggleHistorico();
    }

    // F4 = Delivery

    if(event.key === "F4"){

      event.preventDefault();

      toggleDelivery();
    }

    // F6 = Fiados

    if(event.key === "F6"){

      event.preventDefault();

      toggleFiados();
    }

    // F7 = Fechar Caixa

    if(event.key === "F7"){

      event.preventDefault();

      fecharCaixa();
    }

  }

);


carregarDados();

renderDelivery();

renderFiados();

renderHistorico();

renderClientes();

atualizarResumo();


