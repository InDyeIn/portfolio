"""Exemplo complementar: Suporte técnico. Modelo didático, sem persistência."""
from abc import ABC, abstractmethod


class Chamado(ABC):
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

    def reabrir(self):
        if self.__saldo <= 0:
            raise ValueError("Limite esgotado.")
        self.__saldo -= 1

    @abstractmethod
    def prazo_horas(self):
        """Cada especialização define seu próprio resultado."""
        raise NotImplementedError


class ChamadoComum(Chamado):
    def prazo_horas(self):
        return 48


class ChamadoUrgente(Chamado):
    def prazo_horas(self):
        return 4


if __name__ == "__main__":
    registros = [ChamadoComum("chamado_201", 2), ChamadoUrgente("chamado_202", 1)]
    for registro in registros:
        # A mesma chamada usa a implementação de cada subclasse.
        print(registro.identificacao, registro.prazo_horas())
        registro.reabrir()
        print("Saldo restante:", registro.saldo)
