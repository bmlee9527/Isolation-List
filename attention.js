const URL = "https://lighthouse-user-api.herokuapp.com/"
const IndexURL = URL + "api/v1/users"
const dataPenal = document.querySelector("#data-panel")
const searchForm = document.querySelector('#serach-form')
const searchInput = document.querySelector('#search-input')
const genderCheck = document.querySelector('#genderCheck')

const isolationList = JSON.parse(localStorage.getItem('attentionList'))
let genderList = []

function getIsolationList(data) {
  isolationList.push(...data) 
  return isolationList
}

function renderIsolationList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += ` <div class="col-sm-6 col-lg-3">
      <div class="card">
        <img class="card-img-top" src="${item.avatar}" alt="User-avatar" data-toggle="modal" data-target="#UserModal" data-id="${item.id}">
        <div class="card-body d-flex justify-content-between">
          <h6 class="d-flex align-items-center">${item.name} ${item.surname}</h6>
          <button class="btn btn-outline-primary btn-remove-attention" data-id="${item.id}" >X</i></button>
        </div>
     </div>
    </div>
    `    
  }) 
  dataPenal.innerHTML = rawHTML
}

function isolationModal(id) {
  let userName = document.querySelector(".User-name")
  let userInfo = document.querySelector(".User-info")
  axios.get(IndexURL + '/' + id).then((response) => {
    const data = response.data
    userName.innerText = `${data.name} ${data.surname}`
    userInfo.innerHTML = `
    <div class="row d-flex justify-content-center">
    <div class="col-4">
    <img src="${data.avatar}" alt="">
    </div>
    <div class="col-8">
    age: ${data.age}<br>
    birthday: ${data.birthday}<br>
    email: ${data.email}<br>
    gender: ${data.gender}<br>
    region: ${data.region}<br></div>
    </div> 
    `  
  })
}

function removeFromAttention(id) {
  if (!isolationList) return

  const isolationIndex = isolationList.findIndex((isolation) => isolation.id === id)
  if(isolationIndex === -1) return

  isolationList.splice(isolationIndex,1)
  localStorage.setItem('attentionList', JSON.stringify(isolationList))

  renderIsolationList(isolationList)
}

dataPenal.addEventListener("click", (event) => {
    let target = event.target;
    if (target.matches(".card-img-top")) {
      isolationModal(Number(target.dataset.id))
    } else if (target.matches('.btn-remove-attention')) {
      removeFromAttention(Number(target.dataset.id))
    }
})

genderCheck.addEventListener('click', function onChickGender(event) {
  const target = event.target
  if (target.matches(".form-check-input") && target.value === 'All') {
    genderList = isolationList
  } else if (target.matches(".form-check-input")) {
    genderList = isolationList.filter((isolation) =>
    isolation.gender === target.value
  )}

  renderIsolationList(genderList)
})



renderIsolationList(isolationList)

