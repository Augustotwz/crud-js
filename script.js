class Funcionario {

	constructor(nome, email, celular, rg, cpf, dataNascimento, endereco, 
				numero, cep, cargo, salario){
		this.nome = nome
		this.email = email
		this.celular = celular
		this.rg = rg
		this.cpf = cpf
		this.dataNascimento = dataNascimento
		this.endereco = endereco
		this.numero = numero 
		this.cep = cep
		this.cargo = cargo 
		this.salario = salario
	}

	validarDados() {
		for(let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class BD {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}
	//---------------Métodos principais -------------------------------------
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return (parseInt(proximoId) + 1)
	}

	gravar (f) {
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(f)) //Coloca o objeto referenciado a um id
		localStorage.setItem('id', id) // Atualiza o valor do id
	}
	recuperarTodosregistros() {
		let funcionarios = Array()
		let id = localStorage.getItem('id')

		//Recupera todos os funcionarios cadastrados em localStorage
		for (let i = 1; i <= id; i++) {
			//Converte de JSON p/ Obj literal
			let funcionario = JSON.parse(localStorage.getItem(i))
			if (funcionario == null) { continue }
			//Insere os funcionarios recuperados no array funcionarios
			funcionario.id = i
			funcionarios.push(funcionario)
			}
			return funcionarios
	}
	remover(id) {
		localStorage.removeItem(id)
	}
	//Retorna um array filtrado pelos parâmetros recebidos (nome, email, rg etc..)
	pesquisar(funcionarioPesquisa) {
		let filtroFuncionarios = Array()
		filtroFuncionarios = this.recuperarTodosregistros()

		if (funcionarioPesquisa.nome != '') {
			//Atualiza o array para aplicar mais filtros
			filtroFuncionarios = filtroFuncionarios.filter(f => f.nome == funcionarioPesquisa.nome)
		}
		if (funcionarioPesquisa.email != '') {
			filtroFuncionarios = filtroFuncionarios.filter(f => f.email == funcionarioPesquisa.email)
		}
		if (funcionarioPesquisa.rg != '') {
			filtroFuncionarios = filtroFuncionarios.filter(f => f.rg == funcionarioPesquisa.rg)
		}
		if (funcionarioPesquisa.cargo != '') {
			filtroFuncionarios = filtroFuncionarios.filter(f => f.cargo == funcionarioPesquisa.cargo)
		}
		if (funcionarioPesquisa.salario != '') {
			filtroFuncionarios = filtroFuncionarios.filter(f => f.salario == funcionarioPesquisa.salario)
		}
		return filtroFuncionarios
	}

}//Fim classe BD
let bd = new BD()


function cadastrar() {
	let nome = document.getElementById("nome");
	let email = document.getElementById("email");
	let celular = document.getElementById("celular");
	let rg = document.getElementById("rg");
	let cpf = document.getElementById("cpf");
	let dataNascimento = document.getElementById("dataNascimento");
	let endereco = document.getElementById("endereco");
	let numero = document.getElementById("numero");
	let cep = document.getElementById("cep");
	let cargo = document.getElementById("cargo");
	let salario = document.getElementById("salario");

	//Recupera o valor do input e cria os dados do funcionario
	let funcionario = new Funcionario(
		nome.value,
		email.value,
		celular.value,
		rg.value,
		cpf.value,
		dataNascimento.value,
		endereco.value,
		numero.value,
		cep.value,
		cargo.value,
		salario.value
	)
	//Verifica se não falta nenhum dado do funcionário
	if (funcionario.validarDados()) {
		bd.gravar(funcionario)
		alert("Funcionário cadastrado com sucesso.")
		//Limpa os campos
		nome.value = " ";
		email.value = "";
		celular.value = "";
		rg.value = "";
		cpf.value = "";
		dataNascimento.value = "";
		endereco.value = "";
		numero.value = "";
		cep.value = "";
		cargo.value = "";
		salario.value = "";
	}else {
		alert("Existem campos obrigatórios que não foram preenchidos")
	}
}

function insereItensNaTabela(itens) {
	itens.forEach(function(f){
		//Criando a linha <tr>
		let linha = listaFuncionarios.insertRow()
		//Criando as colunas <td>
		linha.insertCell(0).innerHTML = f.nome
		linha.insertCell(1).innerHTML = f.email
		linha.insertCell(2).innerHTML = f.celular
		linha.insertCell(3).innerHTML = f.rg
		linha.insertCell(4).innerHTML = f.cpf
		linha.insertCell(5).innerHTML = f.cargo
		linha.insertCell(6).innerHTML = f.salario

		//Gera o botão de excluir
		let btn = document.createElement("button")
		btn.className = 'excluirRegistro'
		btn.innerHTML = '<i class="fas fa-times icon"></i>'
		btn.id = 'id_funcionario_' + f.id
		btn.onclick = function(){
			let id = this.id.replace('id_funcionario_', '')
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(7).append(btn)
	})
}
//Na pagina de consulta carrega por padrão todos os funcionários cadastrados
function carregaListaFuncionarios() {
	let funcionarios = Array()
	funcionarios = bd.recuperarTodosregistros()
	insereItensNaTabela(funcionarios)
}

function pesquisarFuncionario() {
	//Recebe a pesquisa
	let nome = document.getElementById("nome").value;
	let email = document.getElementById("email").value;
	let rg = document.getElementById("rg").value;
	let cargo = document.getElementById("cargo").value;
	let salario = document.getElementById("salario").value;
	let celular = ""
	let cpf = ""
	let dataNascimento = ""
	let endereco = ""
	let numero = ""
	let cep = ""

	let funcionario = new Funcionario(//nome, email, rg, cargo, salario
		nome,
		email,
		celular,
		rg,
		cpf,
		dataNascimento,
		endereco,
		numero,
		cep,
		cargo,
		salario
		)

	//Trás uma lista com os itens filtrados
	let funcionarios = bd.pesquisar(funcionario)
	//Seleciona a tabela e limpa a lista atual
	let listaFuncionarios = document.getElementById('listaFuncionarios')
	listaFuncionarios.innerHTML = ''
	//Insere na tabela somente os itens filtrados
	insereItensNaTabela(funcionarios)
}