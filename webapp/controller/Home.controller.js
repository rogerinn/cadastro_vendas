sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.sociumit.Cadastro_de_Vendas_V01.controller.Home", {
		onInit: function () {

		},
		_verificarCampos: function() { //Função privada para verificar os campos do form
			//Pega todos os dados da tela		
			var empresa = this.byId("empresas");
			var produto = this.byId("produtos");
			var quantidade = this.byId("quantidade");
			var data = this.byId("data");

			if (empresa.getSelectedItem() === null) {
				empresa.setValueState("Error");
				empresa.setValueStateText("Selecione um item");
				return false;
			} else {
				empresa.setValueState("None");
			}

			if (produto.getSelectedItem() === null) {
				produto.setValueState("Error");
				produto.setValueStateText("Selecione um item");
				return false;
			} else {
				produto.setValueState("None");
			}

			if (quantidade.getValue() === "" || quantidade.getValue().search(/[,-.]/) !== -1) {
				quantidade.setValueState("Error");
				quantidade.setValueStateText("Insira um valor inteiro");
				return false;
			} else {
				quantidade.setValueState("None");
			}

			if (data.getValue() === "") {
				data.setValueState("Error");
				data.setValueStateText("Insira uma data");
				return false;
			} else {
				data.setValueState("None");
			}

			return true;
		},
		precoProduto: function (oEvent) { //Função chamada quando o item é alterado no select
			var itemSelecionado = oEvent.getParameter('selectedItem'); //Pega o item selecionado no select
			var sPath = itemSelecionado.getBindingContext("dados").getPath(); //Pega o path dele
			var oModel = this.getOwnerComponent().getModel("dados"); //Pega o modelo dados

			var precoItem = oModel.getObject(sPath + "/Preco"); //Pega o preco do item

			this.byId("precoProduto").setNumber(precoItem); //Seta o preco do item
		},
		confirmarVenda: function () {
			//Pegar as vendas do modelo atual
			var vendas = this.getOwnerComponent().getModel("dados").getProperty("/Vendas");
			//Pegar o modelo atual
			var oModel = this.getOwnerComponent().getModel("dados");

			//Verifica se os campos estão preenchidos
			if (!this._verificarCampos()) {
				return;
			}

			//Pega todos os dados da tela		
			var empresa = this.byId("empresas").getSelectedItem().getText();
			var produto = this.byId("produtos").getSelectedItem().getText();
			var precoProduto = this.byId("precoProduto").getNumber();
			var quantidade = this.byId("quantidade").getValue();
			var data = this.byId("data").getDateValue();

			//Monta o novo objeto para "appendar" no modelo
			var novaVenda = {
				"Empresa": empresa,
				"Produto": produto,
				"Preco": precoProduto,
				"PrecoTotal": precoProduto * quantidade,
				"Quantidade": quantidade,
				"DataVenda": data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()
			};

			//Colocando a nova venda dentro do nosso modelo. Como é um array, dá pra dar um push
			vendas.push(novaVenda);

			//Setando o novo modelo na aplicação
			oModel.setProperty("/Vendas", vendas);
		},
		deletarVenda: function () {
			//Pegar o modelo
			var oModel = this.getOwnerComponent().getModel("dados");

			//Pegar a propriedade Vendas do modelo
			var vendas = this.getOwnerComponent().getModel("dados").getProperty("/Vendas");

			//Pega o selectedContext da tabela, para pegar o item selecionado depois
			var tabelaContexto = this.byId("tabelaItems").getSelectedContexts();

			//Verifica se tem algum item selecionado
			if (!tabelaContexto[0]) {
				MessageToast.show("Por favor, selecione um item");
				return;
			}

			//Se existe um item selecionado, continua a execução e pega o path dele
			var tabelaItem = tabelaContexto[0].sPath;
			var tabelaItemIndex = tabelaItem.substr(tabelaItem.length - 1); //Pega o index do path para usar na array

			vendas.splice(tabelaItemIndex, 1); //Remove o index da array vendas

			oModel.setProperty("/Vendas", vendas); //Atualiza o modelo
		}
	});
});