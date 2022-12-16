let data;
let selectDistrict = "鳳山區";
let pageNum = 1;
let districtData;
let isFirstPage;
let isLastPage;

// function that accesses tourist attraction data using AJAX
function getListData() {
    let xhr = new XMLHttpRequest();
    xhr.open("get", "https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c", true);
    xhr.send();
    hideErrorMessage();
    xhr.onload = function() {
		data = JSON.parse(xhr.responseText).data.XML_Head.Infos.Info;
        districtData = filterDistrict(selectDistrict);
        hideLoader();
        if (!districtData || districtData.length == 0) {
            showErrorMessage();
        } else {
            updateList(); // display default content
            updatePage();
        }
    }
}

// function that filters attraction based on input district
function filterDistrict(district) {
    let result = [];
    for (let dataItem of data) {
        if (dataItem.Add.includes(district)) {
            result.push(dataItem);
        }
    }
    return result;
}

// function that renders attraction list based on selected district and page number
function updateList() {
    hideErrorMessage();
    document.querySelector(".district").innerHTML = selectDistrict;
    if (districtData.length == 0) {
        showErrorMessage();
    }
    // p1: show districtData[0 - 9]
    // p2: [10 - 19]
    // p3: [20 - 29]
    let start = (pageNum - 1) * 10;
    let end = districtData.length < pageNum * 10 ? districtData.length : pageNum * 10;
    let str = "";
    let isFree = "";
    for (let i = start; i < end; i++) {
        isFree = districtData[i].Ticketinfo.includes("免費") ? "免費參觀" : "";
        str += 
        `<li class="list-item">
            <div class="img" style="background-image: url(${districtData[i].Picture1});">
                <h3>${districtData[i].Name}</h3>
                <p>${selectDistrict}</p>
            </div>
            <div class="info">
                <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png">${districtData[i].Opentime}</p>
                <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png">${districtData[i].Add}</p>
                <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png"><a href="tel:${districtData[i].Tel}">${districtData[i].Tel}</a>
                    <span class="ticket"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png">${isFree}</span>
                </p>
            </div>
        </li>`;
    }
    document.querySelector(".list").innerHTML = str;
}

// function that renders pagination for selected district
function updatePage() {
    let totalItem = districtData.length;
    let totalPage = totalItem % 10 === 0 ? totalItem / 10 : totalItem / 10 + 1;
    let str = "";
    str += `<input type="button" class="page-item page-prev" value="< prev">`;
    for (let i = 1; i <= totalPage; i++) {
        str += `<input type="button" class="page-item page-num" value="${i}">`
    }
    str += `<input type="button" class="page-item page-next" value="next >">`;
    document.querySelector(".page").innerHTML = str;
    showDisabledPage();
    showActivePage();
}

// function that accesses popular districts
function getPopularData() {
    let popularDistricts = ["苓雅區", "三民區", "新興區", "鹽埕區"];
    let bgColors = ["purple", "orange", "yellow", "blue"];
    updatePopular(popularDistricts, bgColors);
}

// function that renders popular districts
function updatePopular(popularDistricts, bgColors) {
    let str = "";
    for (let i = 0; i < popularDistricts.length; i++) {
        str += 
        `<li>
            <input type="button" value="${popularDistricts[i]}" 
            class="popular-list-item bg-${bgColors[i]}">
        </li>`
    }
    document.querySelector(".popular-list").innerHTML = str;
}

/* helper functions that show messages to user */
function hideLoader() {
    document.querySelector(".loader").style.display = "none";
}

function hideErrorMessage() {
    document.querySelector(".error").style.display = "none";
}

function showErrorMessage() {
    document.querySelector(".error").style.display = "block";
}

// function that adds event listeners to elements
function addEventListeners() {
    // for district select options
    document.querySelector(".select").addEventListener("change", showDistrict);
    // for popular districts buttons
    document.querySelector(".popular-list").addEventListener("click", showDistrict);
    // for page buttons
    document.querySelector(".page").addEventListener("click", showPage);
}

/* helper functions that handle user events */
function showDistrict(e) {
    if (e.target.nodeName === "INPUT" || e.target.nodeName === "SELECT") {
        selectDistrict = e.target.value;
        document.querySelector(".select").value = selectDistrict;
        districtData = filterDistrict(selectDistrict);
        pageNum = 1;
        updateList();
        updatePage();
    }
}

function showPage(e) {
    if (e.target.nodeName === "INPUT") {
        if (e.target.classList.contains("page-prev")) {
            pageNum--;
        } else if (e.target.classList.contains("page-next")){
            pageNum++;
        } else {
            pageNum = e.target.value;
        }
        showDisabledPage();
        showActivePage();
        updateList();
        window.scrollTo({
            top: 100,
            behavior: "smooth"
        });  
    }
}

function showActivePage() {
    let pages = document.querySelectorAll(".page-num");
    for (let p of pages) {
        if (p.value == pageNum) {
            p.classList.add("active");
        } else {
            p.classList.remove("active");
        }
    }
}

function showDisabledPage() {
    isFirstPage = pageNum == 1;
    isLastPage = pageNum * 10 >= districtData.length;
    let prev = document.querySelector(".page-prev");
    let next = document.querySelector(".page-next");
    prev.disabled = isFirstPage;
    prev.style.color = isFirstPage ? "lightgray" : "black";
    next.disabled = isLastPage;
    next.style.color = isLastPage ? "lightgray" : "black";
}

// initialize function
function init() {
    getListData();
    getPopularData();
    addEventListeners();
}

init();