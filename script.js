// *******************Slider_top****************

const slides = document.querySelector(".slider_item")

let index = 1
const total = 4

slides.style.transform = "translateX(-100%)"

function updateDot(i){
  document.getElementById("s"+i).checked = true
}

function nextSlide(){

  index++

  slides.style.transition = "0.6s"
  slides.style.transform = `translateX(-${index*100}%)`

  if(index <= total){
    updateDot(index)
  }

  if(index == total + 1){

    setTimeout(()=>{
      slides.style.transition = "none"
      index = 1
      slides.style.transform = "translateX(-100%)"
      updateDot(1)
    },600)

  }

}
setInterval(nextSlide,3000)
// *****************End_Slider_Top*********************

// ******************Slider_product********************
const slider = document.querySelector(".product_slider")
const slide = document.querySelectorAll(".products_item--img")

const prevBtn = document.querySelector(".product_button--prev")
const nextBtn = document.querySelector(".product_button--next")

let indexP = 0
const totalP = slide.length

function updateSlide(){
  slider.style.transform = `translateX(-${indexP * 100}%)`
}

// next
nextBtn.addEventListener("click", ()=>{
  indexP++

  if(indexP >= totalP){
    indexP = 0
  }

  updateSlide()
})

// prev
prevBtn.addEventListener("click", ()=>{
  indexP--

  if(indexP < 0){
    indexP = totalP - 1
  }

  updateSlide()
})

// auto slide
setInterval(()=>{
  indexP++

  if(indexP >= totalP){
    indexP = 0
  }

  updateSlide()

},7000)
// *******************End_Slider_Product**********************

// **************************Form_Popup***********************

const orderPopup = document.getElementById("order")
const closeBtn = document.querySelector(".order__close")
const productBtns = document.querySelectorAll(".product_buyBtn, .product_hoverBtn")

const productBox = document.getElementById("orderProducts")
const addProductBtn = document.getElementById("addProduct")
const totalEl = document.getElementById("orderTotal")

const paymentMethod = document.getElementById("paymentMethod")
const qrBox = document.getElementById("qrBox")

let products = []

function openOrder(){
  orderPopup.classList.add("active")
}

function resetOrderForm(){

    // xoá danh sách sản phẩm
    productBox.innerHTML = ""

    // reset tổng tiền
    totalEl.innerText = "0"

    // reset form
    document.getElementById("orderForm").reset()

    // ẩn QR
    qrBox.style.display = "none"

}

function closeOrder(){
  orderPopup.classList.remove("active")

  resetOrderForm()
}

closeBtn.onclick = closeOrder



productBtns.forEach(btn=>{

  btn.addEventListener("click",()=>{

      openOrder()

      addProduct(
        btn.dataset.name,
        btn.dataset.price
      )
  })
})



function addProduct(name = "", price = 0){

  const row = document.createElement("div")
  row.className = "order__productRow"

  row.innerHTML = `

    <select class="order__select">

      <option value="">--Chọn sản phẩm--</option>

      <option data-price="24000">Mặt nạ chống lão hoá</option>

      <option data-price="350000">Miếng tẩy trang</option>

      <option data-price="400000">Kem chống nắng</option>

    </select>

    <input
      type="number"
      name = "qty"
      class="order__qty"
      value="1"
      min="1"
    >

    <button type="button" class="order__remove">
      x
    </button>
  `

  productBox.appendChild(row)

  // chọn đúng sản phẩm khi mở popup
  if(name){

    const select = row.querySelector("select")

    for(let option of select.options){

      if(option.text === name){
        option.selected = true
      }

    }

  }

  updateTotal()
}



  addProductBtn.onclick = ()=>{

    addProduct()

  }



  productBox.addEventListener("click",(e)=>{

    if(e.target.classList.contains("order__remove")){

    e.target.parentElement.remove()

    updateTotal()

    }

  })


productBox.addEventListener("change",updateTotal)
productBox.addEventListener("input",updateTotal)



function updateTotal(){

  let total = 0

  document.querySelectorAll(".order__productRow")
  .forEach(row=>{

    const select = row.querySelector("select")
    const qty = row.querySelector("input").value

    const price = select.options[select.selectedIndex]?.dataset.price

    if(price){

      total += price * qty

    }

  })

    totalEl.innerText = total.toLocaleString()
    document.getElementById("orderTotalInput").value = total

}



paymentMethod.onchange = ()=>{

  if(paymentMethod.value === "qr"){

    qrBox.style.display="block"

  }else{

  qrBox.style.display="none"

  }
}

// **********Validate*********************

function validatePhone(phone){

  const regex = /^(0[3|5|7|8|9])[0-9]{8}$/

  return regex.test(phone)

}


const submitBtn = document.getElementById("orderSubmit")
const customerPhone = document.getElementById("customerPhone")
const inputs = document.querySelectorAll("#customerName,#customerEmail,#customerPhone,#customerAddress")

function checkForm(){

  let valid = true

  inputs.forEach(input=>{

    if(input.value.trim()===""){
    valid=false
  }

  })

  if(document.querySelectorAll(".order__productRow").length === 0){
    valid = false
  }

  if(!validatePhone(customerPhone.value)){
    valid=false
  }

  submitBtn.disabled = !valid

}

inputs.forEach(input=>{

  input.addEventListener("input",checkForm)

})

// ***********Notification***********************

const successPopup = document.getElementById("successPopup")
const successOk = document.getElementById("successOk")

successOk.onclick = ()=>{
  successPopup.classList.remove("active")
}

// ******************Form_Submit*****************

const scriptURL = "https://script.google.com/macros/s/AKfycbwVu5IVL7XQ6xIWIQ4Dr9TVsRMb8EmrRajragAOk_RmF2dYwyrP57qdqO2dXVMIw09f7Q/exec"
const form = document.getElementById("orderForm")

form.addEventListener("submit", function(e){

  e.preventDefault()
  submitBtn.classList.add("loading")
  submitBtn.textContent = "Đang gửi..."

  let productList = []

  document.querySelectorAll(".order__productRow").forEach(row=>{

    const select = row.querySelector("select")
    const productName = select.options[select.selectedIndex].text

    const qty = row.querySelector(".order__qty").value

    if(productName){
      productList.push(productName + " x" + qty)
    }

  })

  const products = productList.join(", \n")

  const formData = new FormData()

  formData.append("name", document.getElementById("customerName").value)
  formData.append("email", document.getElementById("customerEmail").value)
  formData.append("phone", document.getElementById("customerPhone").value)
  formData.append("address", document.getElementById("customerAddress").value)
  formData.append("product", products)
  formData.append("total", document.getElementById("orderTotalInput").value)

  fetch(scriptURL,{
    method:"POST",
    body: formData
  })
  .then(res=>{
    successPopup.classList.add("active")
    submitBtn.classList.remove("loading")
    submitBtn.textContent = "Đặt hàng"
    closeOrder()
  })
.catch(err=>{
    successPopup.querySelector("p").innerText =
    "❌ Gửi đơn thất bại. Vui lòng thử lại."

    successPopup.classList.add("active")
})
})

// Menu mobile
const menuToggle = document.getElementById("menuToggle")
const navMenu = document.querySelector(".header_nav")

menuToggle.addEventListener("click",()=>{
  navMenu.classList.toggle("active")
})