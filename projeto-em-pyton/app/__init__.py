from flask import Flask


def create_app():
    app = Flask(__name__)

    from .routes.main import main
    from .routes.auth import auth
    from .routes.clientes import clientes

    app.register_blueprint(clientes)
    app.register_blueprint(main)
    app.register_blueprint(auth)

    return app
