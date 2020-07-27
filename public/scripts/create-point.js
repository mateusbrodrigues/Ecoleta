function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(states => {
        for(state of states){
            ufSelect.innerHTML += `<option value="${state.id}"> ${state.nome} </options>`
        }
    })
}

populateUFs()


function getCities(e){
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = e.target.value
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = e.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true
    fetch(url)
    .then(res => res.json())
    .then(cities => {
        
        for(city of cities){
            citySelect.innerHTML += `<option value="${city.nome}"> ${city.nome} </options>`
        }
        citySelect.disabled = false
    })
}
document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

    
// Itens de coleta
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [];

function handleSelectedItem(e){
    const itemLi = e.target

    //adicionar/remover uma classe js
    itemLi.classList.toggle("selected")
    const itemId = itemLi.dataset.id
    //console.log('Item ID: ' , itemId)
    //verificar se existem itens selecionados
    // se sim ,pegar os itens selecionados
    
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId 
        return itemFound
    })

    // caso selecionado
    if(alreadySelected != -1){
        //tirar da seleção
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems
    }else{
    // se não estiver selecionado
    //adicionar a seleção
        selectedItems.push(itemId)
    }
    //console.log('selectedItems: ', selectedItems)
    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}