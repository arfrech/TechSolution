function carregaInfo(){
    var infoUser = localStorage.getItem("pdvUser");
    if (!infoUser){
        window.location = "index.html";
    }
    var objUser  = JSON.parse(infoUser);

    var linhaHTML = `<div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                          <img src="${objUser.linkFoto}" width="70%">
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                           <strong> Nome: </strong> ${objUser.nome} <br>
                           <strong> RACF: </strong> ${objUser.racf} <br>
                           <strong> Email: </strong> ${objUser.email} <br>
                           <strong> Fone: </strong> ${objUser.telefone} <br>
                        </div>
                     </div>`;
    document.getElementById("dadosUsuario").innerHTML = linhaHTML;

    recuperaRelatorio();
}


function recuperaRelatorio(){
    fetch("http://localhost:8088/solicitacao/status/0")
      .then(res=>res.json())
      .then(lista=>preencheRelatorio(lista));
}

function preencheRelatorio(lista){
    var relHTML = "";
    for (i=0;i<lista.length; i++){
        var solic=lista[i];
        var situacao;
        if (solic.situacao == 0){
            situacao = "NOVA";
        }
        else if (solic.situacao == 1){
            situacao = "APROVADA";
        }
        else if (solic.situacao == 2){
            situacao = "NEGADA";
        }
        else if (solic.situacao == 3){
            situacao = "CANCELADA";
        }
        relHTML = relHTML+`<div class="row">
                             <div class="col-1"> ${solic.numSeq} </div>
                             <div class="col-2"> ${solic.dataSolicitacao} - ${solic.horaSolicitacao} </div>
                             <div class="col-3"> ${solic.nomeTecnico} <br>
                                                 ${solic.documento} / ${solic.telefone} </div>
                             <div class="col-2"> ${solic.pdv.nome} </div>
                             <div class="col-2"> <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="APROVAR"
                                                         onclick="atualizarStatus(${solic.numSeq},1)"> &nbsp; </button>
                                                 <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="NEGAR"
                                                         onclick="atualizarStatus(${solic.numSeq},2)"> &nbsp; </button>
                                                 <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="CANCELAR"
                                                         onclick="atualizarStatus(${solic.numSeq},3)"> &nbsp; </button>
                             </div>
                             <div class="col-2">${situacao}</div>
                          </div>`;
    }
    document.getElementById("relatorio").innerHTML = relHTML;
}

/*
function preencheRelatorio(lista){
    var relHTML = "";
    for (i=0;i<lista.length; i++){
        var solic=lista[i];

        relHTML = relHTML+`<div class="row">
                             <div class="col-1"> ${solic.numSeq} </div>
                             <div class="col-2"> ${solic.dataSolicitacao} ${solic.horaSolicitacao} </div>
                             <div class="col-4"> ${solic.nomeTecnico} <br>
                                                 ${solic.documento} / ${solic.telefone} </div>
                             <div class="col-3"> ${solic.pdv.nome} </div>
                             <div class="col-2"> <button type="button" class="btn btn-success" 
                                                         onclick="atualizarStatus(${solic.numSeq},1)"> &nbsp; </button>
                                                 <button type="button" class="btn btn-danger" 
                                                         onclick="atualizarStatus(${solic.numSeq},2)"> &nbsp; </button>
                                                 <button type="button" class="btn btn-secondary" 
                                                         onclick="atualizarStatus(${solic.numSeq},3)"> &nbsp; </button>
                             </div>
                          </div>`;
    }
    document.getElementById("relatorio").innerHTML = relHTML;
}
*/


function atualizarStatus(numReq, novoStatus){
    var msgBody = {
        numSeq : numReq,
        situacao : novoStatus
    };
    var cabecalho = {
        method: "PUT",
        body : JSON.stringify(msgBody),
        headers: {
            "content-type":"application/json"
        }
    };
    fetch("http://localhost:8088/solicitacao/atualiza", cabecalho)
       .then(res => notificaSucesso());
}

function notificaSucesso(){
    alert("Solicitacao atualizada!");
    recuperaRelatorio();
}


function filtrarStatus(){
    var status = document.getElementById("selectFiltro").value;
    var url;
    if (status != -1){
        url = "http://localhost:8088/solicitacao/status/"+status;
    }
    else{
        url = "http://localhost:8088/solicitacao/todas";
    }

    /*
    var botoesExport = `<a href="geradorPDF.html?status=${status}" target="_blank">PDF</a>
    <button onclick="CSV()">PDF</button>`;
    document.getElementById("exportar").innerHTML = botoesExport;
    */

    fetch(url)
      .then(res => res.json())
      .then(lista => preencheRelatorio(lista));
}

function CSV() {

    var status = document.getElementById("selectFiltro").value;
    var url;
    if (status != -1){
        url = "http://localhost:8088/solicitacao/status/"+status;
    }
    else{
        url = "http://localhost:8088/solicitacao/todas";
    }
    fetch(url)
      .then(res => res.json())
      .then(lista => exportCSV(lista));

 
}

function exportCSV(lista){
    var relHTML = 'numSeq,dataSolicitacao,documento,telefone,pdv.nome,situacao\n';
    for (i=0;i<lista.length; i++){
        var solic=lista[i];

        var situacao;
        if (solic.situacao == 0){
            situacao = "NOVA";
        }
        else if (solic.situacao == 1){
            situacao = "APROVADA";
        }
        else if (solic.situacao == 2){
            situacao = "NEGADA";
        }
        else if (solic.situacao == 3){
            situacao = "CANCELADA";
        }

    var relHTML = relHTML+ [solic.numSeq+","+solic.dataSolicitacao+","+solic.documento+","+solic.telefone+","+solic.pdv.nome+","+situacao];

    relHTML += "\n";
       
    }

    
    console.log(relHTML);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(relHTML);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'PDV.csv';
    hiddenElement.click();
    preencheRelatorio(lista);
}


function sair(){
    var infoUser = localStorage.clear("pdvUser"); 
    var logout = window.confirm('Deseja fazer logout?'); 
    if (logout){ 
        window.location = "index.html" 
    } 

} 

/*

function filtrarStatus(){
    var status = document.getElementById("selectFiltro").value;
    var url;
    if (status != -1){
        url = "http://localhost:8088/solicitacao/status/"+status;
    }
    else{
        url = "http://localhost:8088/solicitacao/todas";
    }

    var botoesExport = `<a href="geradorPDF.html?status=${status}" target="_blank">PDF</a>
                        <button onclick="gerarCSV()">CSV</button>`;

    document.getElementById("exportar").innerHTML = botoesExport;
    fetch(url)
      .then(res => res.json())
      .then(lista => preencheRelatorio(lista));
}

function gerarCSV(){
    var linhaCSV="";
    console.log(listaGlobal);
    for (i=0; i<listaGlobal.length; i++){
        var solic = listaGlobal[i];
        linhaCSV = linhaCSV+`${solic.numSeq};${solic.dataSolicitacao};${solic.horaSolicitacao};${solic.nomeTecnico}\n`;
    }

    console.log(linhaCSV);
    var conteudoCSV = "data:text/csv;charset=utf-8,"+linhaCSV;

    console.log(conteudoCSV);
    var conteudoEncoded = encodeURI(conteudoCSV);
    var link = document.createElement("a");
    link.setAttribute("href", conteudoEncoded);
    link.setAttribute("download", "relatorio.csv");
    document.body.appendChild(link);
    link.click();

}
*/