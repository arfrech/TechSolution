function recuperaPDV(){
    fetch("http://localhost:8088/pdv/todos")
    .then(res=>res.json())
    .then(lista=>preencheDivPDV(lista));
}

function preencheDivPDV(lista){
    var txtOption = "";
    for (i = 0; i< lista.length; i++){
        var pdv = lista[i];
        txtOption = txtOption + `<option value=${pdv.id}> ${pdv.nome} </option>`;
    }
    document.getElementById("divPDV").innerHTML = `<select class="form-control" id="txtPDV"> ${txtOption} </select>`;
}

function enviarDados(){
    var txtNomeTecnico = document.getElementById("txtNomeTecnico").value;
    var txtOperadora   = document.getElementById("txtOperadora").value;
    var txtTelefone    = document.getElementById("txtTelefone").value;
    var txtDocumento   = document.getElementById("txtDocumento").value;
    var txtData        = document.getElementById("txtData").value;
    var txtHora        = document.getElementById("txtHora").value;
    var txtPDV         = document.getElementById("txtPDV").value;

    if(txtNomeTecnico==""){
        alert("Por favor, preencha o campo Nome");
        document.getElementById("txtNomeTecnico").focus();
        return false;
    }

    if(txtOperadora==""){
        alert("Por favor, preencha o campo Operadora com uma empresa válida");
        document.getElementById("txtOperadora").focus();
        return false;
    }

    if(txtTelefone==""){
        alert("Por favor, preencha o campo Telefone com um número válido");
        document.getElementById("txtTelefone").focus();
        return false;
    }

    if(txtDocumento==""){
        alert("Por favor, preencha o campo Documento com um RG válido");
        document.getElementById("txtDocumento").focus();
        return false;
    }

    if(txtData==""){
        alert("Por favor, preencha o campo Data com uma data válida");
        document.getElementById("txtData").focus();
        return false;
    }

    if(txtHora==""){
        alert("Por favor, preencha o campo Hora com um horário válido");
        document.getElementById("txtHora").focus();
        return false;
    }

    var msgBody = {
        nomeTecnico     : txtNomeTecnico,
        operadora       : txtOperadora,
        telefone        : txtTelefone,
        documento       : txtDocumento,
        dataSolicitacao : txtData,
        horaSolicitacao : txtHora,
        situacao        : 0,
        pdv             : {
           id : txtPDV
        }
    };

    var cabecalho = {
        method  : "POST",
        body    : JSON.stringify(msgBody),
        headers : {
            "content-type":"application/json"
        }
    };

    fetch("http://localhost:8088/solicitacao/nova", cabecalho)
    .then(res => trataResultado(res));
}

function trataResultado(res){
    if (res.status == 201){
        alert("Solicitacao criada com sucesso! Por favor, aguarde a liberação do acesso pelo gestor ;-)");
        location.reload();
    }
    else{
        alert("ERRO ao criar a solicitacao - verifique preenchimento do formulario");
    }
}
