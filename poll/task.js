const getRequest = new XMLHttpRequest

getRequest.addEventListener("readystatechange", () => {

    if (getRequest.readyState === getRequest.DONE) {
        const response = JSON.parse(getRequest.responseText)
        const poll = document.querySelector(".poll")
        const pollElement = document.createElement('div')
        pollElement.classList.add('poll')
        pollElement.setAttribute("id", response.id)
        poll.replaceWith(pollElement)

        const pollTitle = document.createElement('h2')
        pollTitle.classList.add('poll__title')
        pollTitle.setAttribute("id", 'pool__title')
        pollTitle.textContent = response.data.title
        pollElement.appendChild(pollTitle)

        const pollAnswers = document.createElement('div')
        pollAnswers.classList.add('poll__answers', 'poll__answers_active')
        pollAnswers.setAttribute("id", "poll__answers")
        for (const index in response.data.answers) {
            const btn = document.createElement('button')
            btn.classList.add('poll__answer')
            btn.setAttribute('id', index)
            btn.textContent = response.data.answers[index]
            pollAnswers.appendChild(btn)
        }
        pollElement.appendChild(pollAnswers)

        const answers = document.querySelectorAll('button')
        Array.from(answers).forEach(answer => {
            answer.addEventListener("click", (event) => {
                alert('Спасибо, ваш голос засчитан!')
                const vote = event.target.getAttribute('id')
                const postRequest = new XMLHttpRequest
                postRequest.open( 'POST', 'https://students.netoservices.ru/nestjs-backend/poll')
                postRequest.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded')
                postRequest.send( `vote=${response.id}&answer=${vote}`)
                postRequest.addEventListener('readystatechange', () => {
                    if (postRequest.readyState === postRequest.DONE) {

                        const response = JSON.parse(postRequest.responseText).stat
                        const result = document.createElement('div')
                        result.classList.add('stat')

                        const statTitle = document.createElement('h3')
                        statTitle.classList.add('stat__title')
                        statTitle.textContent = 'Результаты голосования'
                        result.appendChild(statTitle)

                        const statElements = document.createElement('div')
                        statElements.classList.add('stat__answers')

                        result.appendChild(statElements)
                        const sumVotes = response.reduce((sum, vote) => sum + vote.votes, 0)
                        for (const statAnswer of response) {
                            statElements.innerHTML += `
                            <p>${statAnswer.answer}</p>
                            <span>${(statAnswer.votes / sumVotes * 100).toFixed(2)} %</span>`
                        }

                        const existedResult = pollElement.querySelector('.stat')
                        if (existedResult) {
                            existedResult.replaceWith(result)
                        } else {
                            pollElement.appendChild(result)
                        }
                    }

                })
            })
        })
    }
})

getRequest.open("GET", " https://students.netoservices.ru/nestjs-backend/poll")

getRequest.send()