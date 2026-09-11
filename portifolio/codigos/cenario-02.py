"""Exemplo complementar: Estacionamento. Modelo didático, sem persistência."""
from abc import ABC, abstractmethod


class Veiculo(ABC):
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

    def registrar_diaria(self):
        if self.__saldo <= 0:
            raise ValueError("Limite esgotado.")
        self.__saldo -= 1

    @abstractmethod
    def calcular_diaria(self):
        """Cada especialização define seu próprio resultado."""
        raise NotImplementedError


class Carro(Veiculo):
    def calcular_diaria(self):
        return 30


class Moto(Veiculo):
    def calcular_diaria(self):
        return 15


if __name__ == "__main__":
    registros = [Carro("carro_01", 2), Moto("moto_01", 1)]
    for registro in registros:
        # A mesma chamada usa a implementação de cada subclasse.
        print(registro.identificacao, registro.calcular_diaria())
        registro.registrar_diaria()
        print("Saldo restante:", registro.saldo)
