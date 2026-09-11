"""Exemplo complementar: Cursos online. Modelo didático, sem persistência."""
from abc import ABC, abstractmethod


class Curso(ABC):
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

    def matricular(self):
        if self.__saldo <= 0:
            raise ValueError("Limite esgotado.")
        self.__saldo -= 1

    @abstractmethod
    def carga_horaria(self):
        """Cada especialização define seu próprio resultado."""
        raise NotImplementedError


class CursoGravado(Curso):
    def carga_horaria(self):
        return 20


class CursoAoVivo(Curso):
    def carga_horaria(self):
        return 30


if __name__ == "__main__":
    registros = [CursoGravado("python_gravado", 2), CursoAoVivo("python_ao_vivo", 1)]
    for registro in registros:
        # A mesma chamada usa a implementação de cada subclasse.
        print(registro.identificacao, registro.carga_horaria())
        registro.matricular()
        print("Saldo restante:", registro.saldo)
