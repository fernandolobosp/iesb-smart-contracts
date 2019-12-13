pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Rastreamento {

  event pacoteRegistered(uint _pacoteId);

  event pacoteUpdated(uint _pacoteId, string _message);

  struct Pacote {
      uint id;
      string enderecoOrigem;
      string enderecoDestino;
      string enderecoAtual;
      string[] rastro;
  }

  mapping (uint => Pacote) pacotes;
  uint[] public pacotesIds;

  uint private pacoteId = 0;


  function addPacote(uint _codigo, string memory _origem, string memory _destino, string memory _atual, string[] memory _rastro) public {
      _rastro[0] = _atual;
      pacotes[pacoteId] = Pacote(_codigo, _origem, _destino, _atual, _rastro);
      pacotesIds.push(pacoteId);
      emit pacoteRegistered(pacoteId++);
  }

  function updatePacote(uint _pacoteId, string memory _novoRastro) public {
      Pacote storage pac = pacotes[_pacoteId];

      //uint rastroId = 1;
      pac.rastro.push(_novoRastro);
      pac.enderecoAtual = _novoRastro;

      emit pacoteUpdated(_pacoteId, "Rastro do pacote atualizado!");
  }

  function pacoteInfo(uint _id) public view
    returns(
        uint,
        string memory,
        string memory,
        string memory,
        string[] memory
    ) {
        require(_id <= pacoteId, "Package does not exist");

        Pacote memory pacote = pacotes[_id];

        return (
            pacote.id,
            pacote.enderecoOrigem,
            pacote.enderecoDestino,
            pacote.enderecoAtual,
            pacote.rastro
        );
  }

  function getPacotes() public view
      returns(
          uint[] memory,
          string[] memory,
          string[] memory,
          string[] memory
      ) {
          uint[] memory codigos = pacotesIds;
          string[] memory origens = new string[](codigos.length);
          string[] memory destinos = new string[](codigos.length);
          string[] memory atuais = new string[](codigos.length);

          for (uint i = 0; i < codigos.length; i++) {
            Pacote memory pacote = pacotes[i];
            (codigos[i], origens[i], destinos[i], atuais[i]) = (pacote.id, pacote.enderecoOrigem, pacote.enderecoDestino, pacote.enderecoAtual);
          }

          return (
              codigos,
              origens,
              destinos,
              atuais
          );
        }
}
