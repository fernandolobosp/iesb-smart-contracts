window.addEventListener("load", function() {

    // função para carregar produtos
    getPackages();
})

function getPackages() {
    console.log("*** Getting Packages ***");

    $.get("/listPackages", function(res) {
        if (!res.error) {
            console.log("*** Views -> js -> listPackages.js -> getPackages: ***", res.msg);

            if (res.msg === "no packages yet") {
                return;
            }
            let pacotes = res.packages;
            console.log("pacotes retornados",res.packages);
            // adiciona pacotes na tabela
            for (let i = 0; i < res.packages.length; i++) {
                let newRow = $("<tr>");
                let cols = "";
                let codigo = pacotes[i].codigo;
                let origem = pacotes[i].origem;
                let destino = pacotes[i].destino;
                let atual = pacotes[i].atual;
                let data = pacotes[i].data;

                cols += `<td> ${codigo} </td>`;
                cols += `<td> ${origem} </td>`;
                cols += `<td> ${destino} </td>`;
                cols += `<td> ${atual} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editPackage?id=${pacotes[i].codigo}"><i class="fas fa-map"></i></a>
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#packages-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar pacotes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    console.log("saiu");
}