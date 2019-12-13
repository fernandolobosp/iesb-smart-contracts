const path = require('path');
const Web3 = require("web3");

const product_abi = require(path.resolve("../dapp/build/contracts/Rastreamento.json"));
const httpEndpoint = 'http://localhost:8540';

let contractAddress = require('../../utils/parityRequests').contractAddress;

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let MyContract = new web3.eth.Contract(product_abi.abi, contractAddress);

module.exports = {
    renderAddPackage: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('pacotes.html');
        }
    },
    renderGetPackages: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listaPacotes.html');
        }
    },
    renderEditPackage: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('editPackage.html');
        }
    },
    getPackages: async function(req, res) {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting packages ***", userAddr);

        await MyContract.methods.getPacotes()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (package) {

                console.log("pack", package);
                if (package === null) {
                    return res.send({ error: false, msg: "no products yet"});
                }

                let packages = [];
                for (i = 0; i < package['0'].length; i++) {
                    packages.push({ 'codigo': +package['0'][i], 'origem': package['1'][i], 'destino': package['2'][i], 'atual': package['3'][i] });
                }

                console.log("pacotes", packages);

                res.send({ error: false, msg: "pacotes resgatados com sucesso", packages});
                return true;
            })
            .catch(error => {
                console.log("*** productsApi -> getPackages ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    getPackage: async function(req, res) {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting package " + req.query.id + " ***", userAddr);

        await MyContract.methods.pacoteInfo(parseInt(req.query.id,10))
            .call({ from: userAddr, gas: 3000000 })
            .then(function (package) {

                console.log("pack", package);
                if (package === null) {
                    return res.send({ error: false, msg: "no products yet"});
                }

                packEdit = { 'codigo': +package['0'], 'origem': package['1'], 'destino': package['2'], 'atual': package['3'], 'rastro': package['4'] };

                console.log("pacotes", packEdit);

                res.send({ error: false, msg: "pacotes resgatados com sucesso", packEdit});
                return true;
            })
            .catch(error => {
                console.log("*** productsApi -> getPackages ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    addPackage: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** ProductsApi -> AddPackage ***");
            console.log(req.body);
            pack = {};
            rastro = [];
            pack.id = req.body.codigo;
            pack.origem   = req.body.origem;
            pack.destino = req.body.destino;
            pack.atual   = req.body.origem;
            rastro.push(pack.atual);
            pack.rastro = rastro;

            let userAddr = req.session.address;
            let pass     = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {
                    console.log(parseInt(pack.id,10));
                    console.log(pack.origem);
                    console.log(pack.destino);
                    console.log(pack.atual);
                    console.log(pack.rastro);
                    await MyContract.methods.addPacote(parseInt(pack.id,10), pack.origem, pack.destino, pack.atual, pack.rastro)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Produto cadastrado com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                console.log(err);
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    updatePackage: async (req, res) => {
        
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let userAddr = req.session.address;
            let pass = req.session.password;
            let packageId = req.body.packageId;
            let newLoc   = req.body.newLoc;

            console.log("apis -> packages -> updatePackage: ", userAddr, packageId, newLoc);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {
                    console.log(packageId, newLoc);
                    await MyContract.methods.updatePacote(parseInt(packageId,10), newLoc)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Pacote atualizado com sucesso.'}); 
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.json({ 'error': true, msg: "erro ao se comunar com o contrato"});
                        })
                }
            } catch (error) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    }
}