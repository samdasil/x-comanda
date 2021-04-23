// const transactionsUL         = document.querySelector('#transactions')
const items                 = document.querySelector('.items')
const xSaladaDisplay        = document.querySelector('#xsalada')
const refrigeranteDisplay   = document.querySelector('#refrigerante')
const valorComboDisplay     = document.querySelector('#pagaCombo')
const valorSimplesDisplay   = document.querySelector('#pagaSimples')
const totalBalanceDisplay   = document.querySelector('#balance')
const formOrder             = document.querySelector('#form-order')
const buttonRecalcular      = document.querySelector('#recalcular')
const divResult             = document.querySelector('#result')
const divQRCode             = document.querySelector('.qrcode')
const btnqrcodeDisplay      = document.querySelector('#btnqrcode')
const up                    = document.querySelector('.up')
const audioIupi             = document.querySelector('audio')
const transactionsUL        = document.querySelector('#transactions')

const dataIdentifierMesa    = document.querySelector('[data-mesa]').dataset.mesa
const dataIdentifier        = () => document.querySelectorAll('[data-id]')
const dataIdentifierObs     = document.querySelector('#obs').value
const produtos              =   {
                                    "products":[
                                            {
                                                "category": "paes",
                                                "items": [
                                                            {"id": 1,"descricao":"tapioca","valor": 9.00},
                                                            {"id": 2,"descricao":"x-caboquinho","valor":14.00},
                                                            {"id": 3,"descricao":"pao-com-manteiga", "valor":3.00}
                                                ],
                                            },
                                            {
                                                "category": "bebidas",
                                                "items": [
                                                            {"id": 4,"descricao":"cafe-puro", "valor":2.00},
                                                            {"id": 5,"descricao":"cafe-com-leite", "valor":4.00},
                                                            {"id": 6,"descricao":"achocolatado", "valor":5.50}
                                                ]
                                            },
                                    ]                                   
                                }

let inputQRCode             = document.querySelector('#codePix')
let imgQRCodeDisplay        = document.querySelector("#qrcode")
let inputValorXSalada       = document.querySelector('#valorXsalada')
let inputQtdXSalada         = document.querySelector('#qtdXsalada')
let inputValorRefrigerante  = document.querySelector('#valorRefrigerante')
let inputQtdRefrigerante    = document.querySelector('#qtdRefrigerante')
let inputQtdTomaRefri       = document.querySelector('#qtdTomaRefri')
let selectedProducts        = [{"items": []}]

selectedProducts.push({"mesa": dataIdentifierMesa})
selectedProducts.push({"obs": dataIdentifierObs})

// const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
// let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const validInput = text => {
    if(isNaN(text.value)){
        console.log('isNaN: ' + text.value);
        return 
    }else{
        console.log('isNumber: '+ text.value);
        return text
    }    
}   

const loadProducts = () => {
    for (let index = 0; index < produtos.products.length; index++) {
        const divCategory       = document.createElement('div')
        const titleCategory     = document.createElement('div')
        const textTitle         = document.createElement('h3')


        
        divCategory.classList.add('category')
        titleCategory.classList.add('title-category')
        textTitle.textContent   = produtos.products[index].category.toUpperCase()
        titleCategory.append(textTitle)
        divCategory.append(titleCategory)        
        
        for (let j = 0; j < produtos.products[index].items.length; j++) {
            const formProduct   = document.createElement('div')
            const labelProduct  = document.createElement('label')
            const formPrice     = document.createElement('div')
            const labelPrice    = document.createElement('label')
            const formQuantity  = document.createElement('div')
            const inputQuantity = document.createElement('input')
            const divItemProduct    = document.createElement('div')

            divItemProduct.classList.add('item-product')
            
            formProduct.classList.add('form-control')
            labelProduct.setAttribute('for','product')
            labelProduct.textContent = produtos.products[index].items[j].descricao.toUpperCase()
            formProduct.append(labelProduct)
            
            formPrice.classList.add('form-control', 'price')
            labelPrice.setAttribute('for','amount')
            labelPrice.textContent = produtos.products[index].items[j].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + ' x '
            formPrice.append(labelPrice)
            
            formQuantity.classList.add('form-control')
            inputQuantity.classList.add('quantity')
            inputQuantity.setAttribute('type','number')
            inputQuantity.setAttribute('min','0')
            inputQuantity.setAttribute('data-id',produtos.products[index].items[j].id)
            formQuantity.append(inputQuantity)

            divItemProduct.append(formProduct)
            divItemProduct.append(formPrice)
            divItemProduct.append(formQuantity)

            divCategory.append(divItemProduct)

        }
        
        items.append(divCategory)
    }
    
}

loadProducts()
const oItems = dataIdentifier()

const handleFormOrderSubmit = e => {
    e.preventDefault()
    
    let arrayProd = []

    for (let index = 0; index < oItems.length; index++) {
        let isItemSelected = oItems[index].value !== "" && parseInt(oItems[index].value) !== 0
      
        if(isItemSelected){
            selectedProducts.items +=                 
            [{
                "product":oItems[index].dataset.id,
                "description":oItems[index].description,
                "valor":oItems[index].valor,
                "quantity":oItems[index].quantity
            }]
        }
    }
    
    console.log('selectedProducts',selectedProducts);
    formOrder.classList.add('none')
    divResult.classList.remove('none')
    addTransactionIntoDOM()
}

const addTransactionIntoDOM = () => {
    const CSSClass = 'plus'
    for(let i=0; i < selectedProducts.length; i++){
        const li = document.createElement('li')
        li.classList.add(CSSClass)
        li.innerHTML = `${name} <span>${selectedProducts[i].product} X R$ ${selectedProducts[i].quantity}</span><button class='delete-btn' onClick='removeTransaction(${i})'>x</button>`
        transactionsUL.prepend(li)    
    }
}

const removeTransaction = id => {
    //transactions = selectedProducts.filter( (transaction) => transaction.id !== id )
    selectedProducts.slice(id,1)
    console.log(selectedProducts)
}

const handleShowForm = e => {
    e.preventDefault()
    formOrder.classList.remove('none')
    divResult.classList.add('none')
}

formOrder.addEventListener('submit', handleFormOrderSubmit)

buttonRecalcular.addEventListener('click', handleShowForm)

const calculate = () => {
    totalBalanceDisplay.textContent = `R% ${selectedProducts.reduce((accumulator, item) => accumulator + parseInt(item.quantity),0)}`
}

const updateDisplay = (valorTotalXSalada, valorTotalRefri, valorSimples, valorCombo, qtdTomaRefri, qtdXsalada, qtdRefrigerante) => {
    xSaladaDisplay.textContent      = `R$ ${valorTotalXSalada.toFixed(2)}`
    refrigeranteDisplay.textContent = `R$ ${valorTotalRefri.toFixed(2)}`
    valorComboDisplay.textContent   = `${qtdTomaRefri} x R$ ${valorCombo.toFixed(2)}`
    valorSimplesDisplay.textContent = `${qtdXsalada - qtdTomaRefri} x R$ ${valorSimples.toFixed(2)}`
    totalBalanceDisplay.textContent = `R$ ${(valorTotalXSalada + valorTotalRefri).toFixed(2)}`
    form.classList.add('none')
    divResult.classList.remove('none')
}

const cleanInputsTransaction = () => {
    inputValorXSalada.value         = ''
    inputQtdXSalada.value           = ''
    inputValorRefrigerante.value    = ''
    inputQtdRefrigerante.value      = ''
    qtdTomaRefri                    = ''
}

const handleGenerateQRCode = e => {
    e.preventDefault()

    const key = inputQRCode.value.trim()

    btnqrcodeDisplay.classList.add('bg-gray')
    
    btnqrcodeDisplay.classList.remove('active')

    imgQRCodeDisplay.setAttribute('src', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=nuapp://cpf/'+key)
    
    divQRCode.classList.remove('none')

    setTimeout(() => {up.classList.remove('none')},2000)
    setTimeout(() => {audioIupi.play()},1600)
    setTimeout(() => {up.classList.add('none')},3000)
    
}

const handleChangeInputQRCode = e => {
    e.preventDefault()

    btnqrcodeDisplay.classList.add('active')

    divQRCode.classList.add('none')

}

formCode.addEventListener('submit', handleGenerateQRCode)

inputQRCode.addEventListener('focus', handleChangeInputQRCode)
