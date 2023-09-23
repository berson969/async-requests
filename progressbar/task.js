const formElement = document.getElementById('form')
const input = document.getElementById('file')
let finishMessage
formElement.addEventListener('submit', (event) => {
    event.preventDefault()
    const xhr = new XMLHttpRequest()
    xhr.open("POST", " https://students.netoservices.ru/nestjs-backend/upload")

    const form = new FormData(formElement)
    const progress = document.getElementById( 'progress' )
    if (finishMessage) {
        finishMessage.remove()
    }
    progress.classList.remove('hidden')
    progress.value = 0

    xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
            progress.value = (event.loaded / event.total).toFixed(1)
        }
    })
    xhr.onreadystatechange =  () => {
        if (xhr.readyState === xhr.DONE) {
            progress.classList.add('hidden')
            if (xhr.status < 300) {
                finishMessage = document.createElement('div')
                finishMessage.classList.add('message')
                finishMessage.textContent = 'Файл успешно отправлен'
                formElement.parentElement.insertAdjacentElement('afterbegin', finishMessage)
                console.log('Успешно отправлено:', xhr.responseText)
            } else {
                console.error('Произошла ошибка:', xhr.status, xhr.statusText)
            }
        }
    }

    xhr.send(form)
})