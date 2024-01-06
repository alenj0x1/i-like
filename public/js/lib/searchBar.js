const barSearchI = document.getElementById('bar-search-i')
const tableRows = document.querySelectorAll('tbody .tb-tr')
let barSearchType = 'id'

document.querySelectorAll('.bar-search-type').forEach((input) => {
  input.addEventListener('input', (e) => {
    barSearchType = e.target.value
    searchValue(barSearchI.value)
  })
})

barSearchI.addEventListener('input', (e) => {
  searchValue(e.target.value)
})

function searchValue(value) {
  const tableRow = findTableRow(value, barSearchType)
  if (!tableRow.length) document.querySelector('tbody').innerHTML = ''

  tableRow.forEach((tr, index) => {
    if (index === 0) document.querySelector('tbody').innerHTML = ''
    document.querySelector('tbody').append(tr)
  })
}

function findTableRow(value, type) {
  let data = []

  tableRows.forEach((tr) => {
    tr.childNodes.forEach((td, index) => {
      if (type === 'id' && index === 0) {
        const id = td.textContent
        if (id.includes(value)) data.push(tr)
      }

      if (type === 'username' && index === 1) {
        const username = td.textContent
        if (username.includes(value)) data.push(tr)
      }

      if (!value) data.push(tr)
    })
  })

  return data
}
