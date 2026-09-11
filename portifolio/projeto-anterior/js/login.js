const btnSenha = document.getElementById('btn-senha');
const btnConfirmarSenha = document.getElementById('btn-confirmar-senha');
const btnSenhaLogin = document.getElementById('btn-senhalogin');
const inputSenhaLogin = document.getElementById('senhaLogin');
const inputSenha = document.getElementById('senha');
const inputConfirmarSenha = document.getElementById('confirmar-senha');
const toggleIcon = document.getElementById('toggleIcon');
const toggleIcon2 = document.getElementById('toggleIcon2');
const toggleIcon3 = document.getElementById('toggleIcon3');

btnSenha.addEventListener('click', function () {
    const type = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
    inputSenha.setAttribute('type', type);
    toggleIcon.classList.toggle('bi-eye-slash');
    toggleIcon.classList.toggle('bi-eye');

});
btnConfirmarSenha.addEventListener('click', function () {
    const type = inputConfirmarSenha.getAttribute('type') === 'password' ? 'text' : 'password';
    inputConfirmarSenha.setAttribute('type', type);
    toggleIcon2.classList.toggle('bi-eye-slash');
    toggleIcon2.classList.toggle('bi-eye');

});
btnSenhaLogin.addEventListener('click', function () {
    const type = inputSenhaLogin.getAttribute('type') === 'password' ? 'text' : 'password';
    inputSenhaLogin.setAttribute('type', type);
    toggleIcon3.classList.toggle('bi-eye-slash');
    toggleIcon3.classList.toggle('bi-eye');
});



// Máscara para o campo de telefone
$(document).ready(function () {
    var behavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
        options = {
            onKeyPress: function (val, e, field, options) {
                field.mask(behavior.apply({}, arguments), options);
            }
        };

    $('#telefone').mask(behavior, options);
    $('#emergencia').mask(behavior, options);
    $('#cpf').mask('000.000.000-00', { reverse: true });
});
$('#dataNasc').mask('00/00/0000');
$('#cnpj').mask('00.000.000/0000-00');
$('#cep').mask('00000-000');
$('#telHospital').mask('(00) 0000-0000');

flatpickr("#dataNasc", {
    dateFormat: "d/m/Y",
    allowInput: true, // Isso permite que a máscara funcione enquanto o calendário está ativo!
    locale: {
        firstDayOfWeek: 0,
        weekdays: {
            shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            longhand: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        },
        months: {
            shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        },
    }
});

/* API CEP */
$(document).ready(function () {

    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
        $("#ibge").val("");
    }

    //Quando o campo cep perde o foco.
    $("#cep").blur(function () {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("#rua").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#uf").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#rua").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#uf").val(dados.uf);
                        $("#numero").focus();
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
});