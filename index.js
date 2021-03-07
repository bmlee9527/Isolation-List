const URL = "https://lighthouse-user-api.herokuapp.com/"
const IndexURL = URL + "api/v1/users"
const isolationPerPage = 12
let nowPage = 1

const dataPenal = document.querySelector("#data-panel")
const searchForm = document.querySelector('#serach-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const searchSelect = document.querySelector('#searchSelect')
const genderCheck = document.querySelector('#genderCheck')
const btn = document.querySelectorAll(".btn-add-attention")

const isolationList = []
const attentionList = JSON.parse(localStorage.getItem('attentionList'))
const attentionListID = []

let filteredIsolation = []
let genderList = []
let gender = "All"


attentionList.forEach((item) => {
  attentionListID.push(item.id)
})


function getIsolationList(data) {
  isolationList.push(...data) 
  return isolationList
}

function renderIsolationList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    if (attentionListID.includes(item.id)) {
      rawHTML += ` <div class="col-sm-6 col-lg-3">
      <div class="card">
        <img class="card-img-top" src="${item.avatar}" alt="User-avatar" data-toggle="modal" data-target="#UserModal" data-id="${item.id}">
        <div class="card-body d-flex justify-content-between">
          <h6 class="d-flex align-items-center">${item.name} ${item.surname}</h6>
          <button class="btn btn btn-warning btn-add-attention" data-id="${item.id}" ><i class="far fa-star" data-id="${item.id}"></i></button>
        </div>
      </div>
    </div>
    `  
    return 
    }

    rawHTML += ` <div class="col-sm-6 col-lg-3">
      <div class="card">
        <img class="card-img-top" src="${item.avatar}" alt="User-avatar" data-toggle="modal" data-target="#UserModal" data-id="${item.id}">
        <div class="card-body d-flex justify-content-between">
          <h6 class="d-flex align-items-center">${item.name} ${item.surname}</h6>
          <button class="btn btn btn-outline-warning btn-add-attention" data-id="${item.id}" ><i class="far fa-star" data-id="${item.id}"></i></button>
        </div>
     </div>
    </div>
    `    
  }) 
  dataPenal.innerHTML = rawHTML
}

function renderPaginator(amout) {
  const numberOfPages = Math.ceil(amout / isolationPerPage)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    if (nowPage === page) {
      rawHTML += `<li class="page-item active"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
     
    } else {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }  
  }
  return paginator.innerHTML = rawHTML
}


function getIsolationByPage(page) {
  if (genderList.length > 0) {
    const startIndex = (page - 1) * isolationPerPage
    return genderList.slice(startIndex,startIndex + isolationPerPage)
  }
  const data = filteredIsolation.length ? filteredIsolation : isolationList
  const startIndex = (page - 1) * isolationPerPage
  return data.slice(startIndex,startIndex + isolationPerPage)
}



function isolationModal(id) {
  let userName = document.querySelector(".User-name")
  let userInfo = document.querySelector(".User-info")
  axios.get(IndexURL + '/' + id).then((response) => {
    const data = response.data
    userName.innerText = `${data.name} ${data.surname}`
    userInfo.innerHTML = `
    <div class="row d-flex justify-content-center">
    <div class="col-4 d-flex align-items-center ml-1">
    <img src="${data.avatar}" alt="" class="rounded-circle">
    </div>
    <table class="col-7 table table-borderless">
       <tbody>
         <tr>
           <td>age: ${data.age}</td>
         </tr>
         <tr>
           <td>birthday: ${data.birthday}</td>
         </tr>
         <tr>
           <td>email: <a href="mailto:${data.email}">${data.email}</a></td>
         </tr>
         <tr>
           <td>gender: ${data.gender}</td>
         </tr>
         <tr>
           <td>region: ${data.region}</td>
         </tr>        
       </tbody>
    </table>
    `  
  })
}

dataPenal.addEventListener("click", (event) => {
    let target = event.target;
    if (target.matches(".card-img-top")) {
      isolationModal(Number(target.dataset.id))
    } else if (target.matches('.btn-add-attention')|| event.target.matches('.fa-star')) {
      if (target.matches('.btn-add-attention')) {
        target.className = "btn btn btn-warning btn-add-attention"
      } else if (event.target.matches('.fa-star')) {
        target.parentElement.className = "btn btn btn-warning btn-add-attention" 
      }
      addToAttention(Number(target.dataset.id))
    }
})

searchForm.addEventListener('submit' , function onSearchFormSumitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  genderList = []

  if (keyword.length === 0) {
    alert('請輸入文字')
  }
  
  if (searchSelect.value === 'name'){
    filteredIsolation = isolationList.filter((isolation) =>
    isolation.name.toLowerCase().includes(keyword) || isolation.surname.toLowerCase().includes(keyword)
  )
  } else if (searchSelect.value === 'region') {
    filteredIsolation = isolationList.filter((isolation) =>
    isolation.region.toLowerCase().includes(keyword)
  )
  }
  if (filteredIsolation.length === 0) {
    alert('Cannot find people with keyword:' + keyword)  
  }
  if (gender !== 'All') {
  filteredIsolation = filteredIsolation.filter((isolation) =>
  isolation.gender === gender 
  )
  }
 nowPage = 1
 renderPaginator(filteredIsolation.length)
 renderIsolationList(getIsolationByPage(1))
})

function addToAttention(id) {
  const list = JSON.parse(localStorage.getItem('attentionList')) || []
  const isolation = isolationList.find((isolation) => isolation.id === id)
  if (list.some((isolation) => isolation.id === id)) {
    return alert('此隔離者已在注意清單中')
  }
  list.push(isolation)
  localStorage.setItem('attentionList', JSON.stringify(list))
}

paginator.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  nowPage = Number(event.target.dataset.page)
  const page = Number(event.target.dataset.page)
  renderPaginator(isolationList.length)
  renderIsolationList(getIsolationByPage(page))
})

genderCheck.addEventListener('click', function onChickGender(event) {
  const target = event.target
  gender = target.value
  const data = filteredIsolation.length ? filteredIsolation : isolationList
  if (target.matches(".form-check-input") && target.value === 'All') {
    genderList = data
  } else if (target.matches(".form-check-input")) {
    genderList = data.filter((isolation) =>
    isolation.gender === target.value
  )}

  renderPaginator(genderList.length)
  renderIsolationList(getIsolationByPage(1))
})



axios.get(IndexURL).then((response) => {
 const data = response.data.results
 getIsolationList(data)
 renderPaginator(isolationList.length)
 renderIsolationList(getIsolationByPage(1))
})

