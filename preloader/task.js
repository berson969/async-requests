function saveCourses() {
    const itemsSave = document.querySelectorAll('.item')
    const saveCourses = Array.from(itemsSave).reduce((dict, courseElement) => {
        const CharCode = courseElement.querySelector('.item__code').textContent.trim()
        const Value = courseElement.querySelector('.item__value').textContent.trim()
        dict[CharCode] = {CharCode, Value}
        return dict
    }, {})
    localStorage.setItem("savedCourses", JSON.stringify(saveCourses))
}

function loadCourses() {
    const storage = localStorage.getItem("savedCourses")
    const items = document.getElementById("items")
    while (items.firstChild) {
        items.removeChild(items.firstChild)
    }

    if (storage) {
        const loadCourses = JSON.parse(storage)
        createItem(loadCourses)
        document.getElementById('loader').classList.remove('loader_active')
    }
}

function createItem(courses) {
    const items = document.getElementById("items")

    while (items.firstChild) {
        items.removeChild(items.firstChild)
    }
    for (const currency in courses) {

        const item = document.createElement('div')
        item.classList.add('item')
        item.innerHTML = `
            <div class="item__code">
                    ${courses[currency].CharCode}
                </div>
                <div class="item__value">
                    ${courses[currency].Value}
                </div>
                <div class="item__currency">
                    руб.
                </div>`

        items.appendChild(item)
    }
}





const xhr = new XMLHttpRequest()
xhr.addEventListener("readystatechange", () => {

    if (xhr.readyState === xhr.DONE) {
        const courses = JSON.parse(xhr.responseText).response.Valute
        createItem(courses)
        clearInterval(timer)
        const loader = document.querySelector('img')
        loader.classList.remove('loader_active')
        saveCourses()
    }
})

window.addEventListener('load', loadCourses)
xhr.open("GET", "https://students.netoservices.ru/nestjs-backend/slow-get-courses")

xhr.send()

let milliseconds = 0
const main = document.querySelector('main')
const timerElement = document.createElement('time')
timerElement.textContent = milliseconds
main.insertAdjacentElement('afterbegin', timerElement)
const timer = setInterval(() => {
    milliseconds++
    timerElement.textContent = (milliseconds / 100).toFixed(2)
}, 10)