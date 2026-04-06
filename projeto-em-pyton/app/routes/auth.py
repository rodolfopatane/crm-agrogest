from flask import Blueprint, render_template, request

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']

        print(email, senha)  # só pra testar

        from flask import redirect, url_for

        return redirect(url_for('clientes.lista_clientes_view'))

    return render_template('login.html')