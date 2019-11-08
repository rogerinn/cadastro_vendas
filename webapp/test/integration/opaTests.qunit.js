/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sociumit/Cadastro_de_Vendas_V01/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});