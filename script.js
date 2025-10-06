import * as Constants from './constants.js'; // Импорт всех констант в один объект

const burgerBtn = document.getElementById("burger");
const navMobile = document.getElementById("nav-mobile");

const departList = document.getElementById("depart-list");
const departInput = document.getElementById("depart-input");

const faqsItems = document.getElementById("faqs-items");
let activeFAQsElement = '0'

burgerBtn.addEventListener('click', () => {
    navMobile.classList.toggle('hidden');
})

navMobile.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navMobile.classList.toggle('hidden');
    }
})

const sortDepartList = (array, value) => {
    const searchValue = value.trim()
    return array.filter(item => {
        return item.toLowerCase().includes(searchValue.toLowerCase());
    })
}

const getDepartList = (array) => {
    return array.map(item => {
        const listElement = document.createElement('li');
        listElement.innerText = item;
        return listElement;
    })
}

const fillDepartList = (array) => {
    const elements = getDepartList(array)
    departList.innerText = ""
    departList.append(...elements)
}

departInput.addEventListener('focus', () => {
    fillDepartList(sortDepartList(Constants.Stations, departInput.value));
    departList.classList.toggle('hidden');
})

departInput.addEventListener('blur', () => {
    departList.classList.toggle('hidden');
})

departInput.addEventListener('keyup', () => {
    fillDepartList(sortDepartList(Constants.Stations, departInput.value));
})

departList.addEventListener('mousedown', (event) => {
    const target = event.target;
    if (target.tagName === 'LI') {
        console.log(target)
        departInput.value = target.innerText;
    }
})


const fillFAQsItems = (FAQS) => {
    faqsItems.innerHTML = '<h2>FAQs.</h2>'
    FAQS.forEach((item) => {
        faqsItems.insertAdjacentHTML('beforeend', `
            <div class="faqs-item">
                <div class="faqs-item-title">
                    <h5 class="faq-title">${item.title}</h5>
                    <button class="faqs-btn" id="faqs-btn-${item.id}">
                        <img src="./assets/icons/openElement.svg" alt="closeElement">                    
                    </button>
                </div>
                <div class="faqs-item-text hidden" id="faqs-item-text-${item.id}">
                    <p class="faq-text">${item.text}</p>
                </div>
            </div>
        `);
    })

    const firstBtn = document.getElementById("faqs-btn-0")
    firstBtn.innerHTML = '<img src="./assets/icons/closeElement.svg" alt="closeElement">'
    const firsText = document.getElementById("faqs-item-text-0")
    firsText.classList.toggle('hidden');
}

fillFAQsItems(Constants.arrayFAQS)


faqsItems.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        const activeBtn = document.getElementById(`faqs-btn-${activeFAQsElement}`)
        const activeText = document.getElementById(`faqs-item-text-${activeFAQsElement}`)
        activeBtn.innerHTML = '<img src="./assets/icons/openElement.svg" alt="openElement">'
        activeText.classList.toggle('hidden');

        const parentBtn = target.parentElement;
        const id = parentBtn.id.substring(9)
        const textElement = document.getElementById(`faqs-item-text-${id}`)

        if (textElement.classList.contains('hidden')) {
            parentBtn.innerHTML = '<img src="./assets/icons/closeElement.svg" alt="closeElement">'
        } else {
            parentBtn.innerHTML = '<img src="./assets/icons/openElement.svg" alt="openElement">'
        }
        textElement.classList.toggle('hidden');
        activeFAQsElement = id
    }
});