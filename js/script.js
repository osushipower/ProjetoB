const input_valor = document.getElementById('valor');

function test() {
    var compra = document.getElementById("compra").value;
    var mercadoria = document.getElementById("mercadoria").value;
    var valor = document.getElementById("valor").value;

    alert(`Compra: ${compra} | Mercadoria: ${mercadoria} | Valor: ${valor}`);
}

function format() {
    let val = +input_valor.value;
    let valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).formatToParts(val).map(
        p => p.type != 'literal' && p.type != 'currency' ? p.value : ''
    ).join('')
    console.log(valorFormatado);
}

// Events

input_valor.addEventListener("input", format, false);