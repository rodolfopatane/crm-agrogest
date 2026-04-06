from flask import Blueprint, render_template, request, redirect, url_for

clientes = Blueprint('clientes', __name__)

# lista fake (simulando banco)
lista_clientes = [
    (1, "João", "11999999999", "joao@email.com", "Empresa X", "12345678000100", "12345678900", "São Paulo", "SP"),
    (2, "Maria", "11888888888", "maria@email.com", "Empresa Y", "98765432000100", "98765432100", "Rio de Janeiro", "RJ")
]


# 🔹 ROTA PARA LISTAR CLIENTES
@clientes.route('/clientes')
def lista_clientes_view():
    return render_template('clientes.html', clientes=lista_clientes)


# 🔹 ROTA PARA CADASTRAR CLIENTE
@clientes.route('/clientes/novo', methods=['GET', 'POST'])
def novo_cliente():
    if request.method == 'POST':
        nome = request.form['nome']
        telefone = request.form['telefone']
        email = request.form['email']
        razaosocial = request.form['razaosocial']
        cnpj = request.form['cnpj']
        cpf = request.form['cpf']
        cidade = request.form['cidade']
        estado = request.form['estado']

        # gerar novo ID
        novo_id = len(lista_clientes) + 1

        # ordem correta dos dados
        cliente = (novo_id, nome, telefone, email, razaosocial, cnpj, cpf, cidade, estado)

        # salvar na lista
        lista_clientes.append(cliente)

        # redirecionar para lista
        return redirect(url_for('clientes.lista_clientes_view'))

    return render_template('cadastrar.html')


@clientes.route('/clientes/excluir/<int:id>')
def excluir_cliente(id):
    global lista_clientes

    lista_clientes = [c for c in lista_clientes if c[0] != id]

    return redirect(url_for('clientes.lista_clientes_view'))


@clientes.route('/clientes/editar/<int:id>', methods=['GET', 'POST'])
def editar_cliente(id):
    cliente = None

    for c in lista_clientes:
        if c[0] == id:
            cliente = c
            break

    if request.method == 'POST':
        nome = request.form['nome']
        telefone = request.form['telefone']
        email = request.form['email']
        razaosocial = request.form['razaosocial']
        cnpj = request.form['cnpj']
        cpf = request.form['cpf']
        cidade = request.form['cidade']
        estado = request.form['estado']

        lista_clientes.remove(cliente)

        cliente_atualizado = (id, nome, telefone, email, razaosocial, cnpj, cpf, cidade, estado)

        lista_clientes.append(cliente_atualizado)

        return redirect(url_for('clientes.lista_clientes_view'))

    return render_template('cadastrar.html', cliente=cliente)
