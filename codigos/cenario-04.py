"""Exemplo complementar: Entregas. Modelo didático, sem persistência."""
from abc import ABC, abstractmethod


class Entrega(ABC):
    def __init__(self, identificacao: str, limite: int):
        if not isinstance(identificacao, str) or not identificacao.strip():
            raise ValueError("Identificação obrigatória.")
        if type(limite) is not int or limite < 0:
            raise ValueError("O limite deve ser um inteiro não negativo.")
        self.identificacao = identificacao
        self.__saldo = limite  # Estado alterado apenas pela operação controlada.

    @property
    def saldo(self):
        return self.__saldo

    def registrar_tentativa(self):
        if self.__saldo <= 0:
            raise ValueError("Limite esgotado.")
        self.__saldo -= 1

    @abstractmethod
    def calcular_frete(self):
        """Cada especialização define seu próprio resultado."""
        raise NotImplementedError


class EntregaPadrao(Entrega):
    def calcular_frete(self):
        return 12


class EntregaExpressa(Entrega):
    def calcular_frete(self):
        return 25


if __name__ == "__main__":
    registros = [EntregaPadrao("pedido_101", 2), EntregaExpressa("pedido_102", 1)]
    for registro in registros:
        # A mesma chamada usa a implementação de cada subclasse.
        print(registro.identificacao, registro.calcular_frete())
        registro.registrar_tentativa()
        print("Saldo restante:", registro.saldo)
