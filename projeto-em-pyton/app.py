from flask import Flask, render_template, request, redirect
import sqlite3
app = Flask(__name__)
clientes_lista = []

def criar_banco():
    conexao = sqlite3.connect("clientes.db")
    cursor = conexao.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        email TEXT
    )
    """)

    conexao.commit()
    conexao.close()

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]

        print("Email:", email)
        print("Senha:", senha)

        return redirect("/dashboard")

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route('/clientes')
def clientes():
    conexao = sqlite3.connect("clientes.db")
    cursor = conexao.cursor()

    cursor.execute("SELECT id,nome,telefone, email FROM clientes")
    clientes = cursor.fetchall()

    conexao.close()

    return render_template("clientes.html", clientes=clientes)

@app.route("/cadastrar", methods=["GET", "POST"])
def cadastrar():
    if request.method == "POST":
        nome = request.form["nome"]
        telefone = request.form["telefone"]
        email = request.form["email"]

        if not nome or not telefone or not email:
            return "Preencha todos os campos"

        cliente = {
            "nome": nome,
            "telefone": telefone,
            "email": email
        }

        conexao = sqlite3.connect("clientes.db")
        cursor = conexao.cursor()

        cursor.execute("""
        INSERT INTO clientes (nome, telefone, email)
        VALUES (?, ?, ?)
        """, (nome, telefone, email))

        conexao.commit()
        conexao.close()

        return redirect("/clientes")

    return render_template("cadastrar.html")

@app.route("/excluir/<int:id>")
def excluir(id):
    conexao = sqlite3.connect("clientes.db")
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM clientes WHERE id = ?", (id,))

    conexao.commit()
    conexao.close()

    return redirect("/clientes")

@app.route("/editar/<int:id>", methods=["GET", "POST"])
def editar(id):
    conexao = sqlite3.connect("clientes.db")
    cursor = conexao.cursor()

    if request.method == "POST":
        nome = request.form["nome"]
        telefone = request.form["telefone"]
        email = request.form["email"]

        if not nome or not telefone or not email:
            return "Preencha todos os campos"

        cursor.execute("""
        UPDATE clientes
        SET nome = ?, telefone = ?, email = ?
        WHERE id = ?
        """, (nome, telefone, email, id))

        conexao.commit()
        conexao.close()

        return redirect("/clientes")

    cursor.execute("SELECT id, nome, telefone, email FROM clientes WHERE id = ?", (id,))
    cliente = cursor.fetchone()

    conexao.close()

    return render_template("editar.html", cliente=cliente)
if __name__ == "__main__":
    criar_banco()
    app.run(debug=True)