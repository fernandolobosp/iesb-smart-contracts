let packageId, productName, productPrice;

window.addEventListener('load', () => {
    console.log("*** editing package page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    packageId = parseInt(url.searchParams.get("id"), 10);
    console.log("Package ID: ", packageId);

    $.get('/getPackage?id=' + packageId, function(pack){
        console.log("pack: ", pack.packEdit);
        $('#package-info').html("<strong>Codigo: <strong>" + pack.packEdit.codigo + "<br/>"
        + "<strong>Origem:</strong>" + pack.packEdit.origem + "<br/>");
        for (let i = 0; i < pack.packEdit.rastro.length; i++) {
            let newRow = $("<tr>");
            let cols = "";
            let rastro = pack.packEdit.rastro[i];

            cols += `<td> ${rastro} </td>`;
            
            newRow.append(cols);
            $("#track-table").append(newRow);
        }        
    });

    // resgata formulário de pacotes
    let form = document.getElementById("editPackage");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', updatePackage);
});

function updatePackage(event) {
    event.preventDefault();
    console.log("*** Editing package: ", packageId);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let newLoc = $("#local-pacote").val();
    // envia a requisição para o servidor
    $.post("/updatePackage", {packageId, newLoc}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> editPackage.js -> updatePackage: ***", res.msg);            
            // limpa dados do formulário
            $("#local-pacote").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Seu pacote foi atualizado com sucesso");
            window.location.href = "/getPackages";
        } else {
            alert("Erro ao atualizar pacote. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}