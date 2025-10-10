export class Calendar {
    #leftArea
    #rightArea
    #leftButton
    #rightButton
    #leftMonth
    #rightMonth
    #currentDate
    #nextDate
    #today
    #startDay
    #finishDay

    constructor(calendarLeftAria, calendarRightAria,
                calendarLeftBtn, calendarRightBtn,
                calendarLeftMonth, calendarRightMonth) {
        this.#leftArea = calendarLeftAria;
        this.#rightArea = calendarRightAria;
        this.#leftButton = calendarLeftBtn;
        this.#rightButton = calendarRightBtn;
        this.#leftMonth = calendarLeftMonth;
        this.#rightMonth = calendarRightMonth;
        this.#currentDate = new Date();
        this.#nextDate = new Date();
        this.#nextDate.setMonth(this.#nextDate.getMonth() + 1);
        this.#today = new Date();
        this.#startDay = null
        this.#finishDay = null
    }


    init() {
        this.#fullRender()

        this.#leftButton.addEventListener("click", () => {
            this.#currentDate.setMonth(this.#currentDate.getMonth() - 1);
            this.#nextDate.setMonth(this.#nextDate.getMonth() - 1);
            this.#fullRender()
        })

        this.#rightButton.addEventListener("click", () => {
            this.#currentDate.setMonth(this.#currentDate.getMonth() + 1);
            this.#nextDate.setMonth(this.#nextDate.getMonth() + 1);
            this.#fullRender()
        })

        this.#leftArea.addEventListener('click', (event) => {
            this.#selectDay(event.target, this.#currentDate, 5)
        })

        this.#rightArea.addEventListener('click', (event) => {
            this.#selectDay(event.target, this.#nextDate, 6)
        })
    }

    // Возвращает значение, нужно ли изменять закрашенные части между датами
    #selectDay(target, monthDate, index) {
        if (target.tagName !== 'BUTTON') {
            return false
        }
        const id = target.getAttribute('id')
        const day = id.substring(index)
        const selectedDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        // Проверка на то, мб кликнули на ту же дату
        if (this.#startDay && selectedDay.valueOf() === this.#startDay.valueOf() ||
            this.#finishDay && selectedDay.valueOf() === this.#finishDay.valueOf()) {
            return false
        }
        if (!this.#startDay) {
            this.#startDay = selectedDay
            target.classList.add('selected-day')
            return false
        } else if (this.#startDay > selectedDay && !this.#finishDay) {
            this.#finishDay = this.#startDay
            this.#startDay = selectedDay
        } else if (!this.#finishDay) {
            this.#finishDay = selectedDay
        } else if (this.#startDay > selectedDay) {
            this.#removeSelectedDayClass(this.#startDay)
            this.#startDay = selectedDay
        } else {
            this.#removeSelectedDayClass(this.#finishDay)
            this.#finishDay = selectedDay
        }
        target.classList.add('selected-day')
        return true
    }

    #removeSelectedDayClass(date) {
        if (this.#currentDate.getMonth() === date.getMonth() && this.#currentDate.getFullYear() === date.getFullYear()) {
            const day = document.getElementById(`left-${date.getDate()}`)
            day.classList.remove('selected-day')
        } else if (this.#nextDate.getMonth() === date.getMonth() && this.#nextDate.getFullYear() === date.getFullYear()) {
            const day = document.getElementById(`right-${date.getDate()}`)
            day.classList.remove('selected-day')
        }
    }

    #removeSelectedDays() {
        if (this.#startDay) {
            this.#removeSelectedDay(this.#startDay)
        }
        if (this.#finishDay) {
            this.#removeSelectedDay(this.#finishDay)
        }
    }

    #removeSelectedDay(date) {
        if (this.#currentDate.getMonth() === date.getMonth() && this.#currentDate.getFullYear() === date.getFullYear()) {
            const day = document.getElementById(`left-${date.getDate()}`)
            day.classList.add('selected-day')
        } else if (this.#nextDate.getMonth() === date.getMonth() && this.#nextDate.getFullYear() === date.getFullYear()) {
            const day = document.getElementById(`right-${date.getDate()}`)
            day.classList.add('selected-day')
        }
    }

    #getCalendarMatrix = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        let countDays = 1
        let firstWeek = new Array(7).fill(null)

        const firstDay = new Date(year, month, 1)
        const firstDayWeekIndex = (firstDay.getDay() + 6) % 7

        // Как получаем нормальный индекс дня недели:
        // firstDay.getDay() - возвращает индекс дня недели, но в извращенном виде,
        // поэтому меняем его по правилу:
        // 1 - Понедельник -> 1 + 6 = 7 % 7 = 0
        // 2 - Вторник -> 2 + 6 = 8 % 7 = 1
        // 3 - Среда -> 3 + 6 = 9 % 7 = 2
        // 4 - Четверг -> 4 + 6 = 10 % 7 = 3
        // 5 - Пятница -> 5 + 6 = 11 % 7 = 4
        // 6 - Суббота -> 6 + 6 = 12 % 7 = 5
        // 0 - Воскресенье -> 0 + 6 = 6 % 7 = 6
        // (день + предпоследний день) % максимально кол-во дней

        let matrix = []

        for (let i = firstDayWeekIndex; i < 7; i++) {
            firstWeek[i] = countDays
            countDays++
        }

        matrix.push(firstWeek)

        while (countDays <= daysInMonth) {
            let week = new Array(7).fill(null)
            for (let i = 0; i < 7 && countDays <= daysInMonth; i++) {
                week[i] = countDays
                countDays++
            }
            matrix.push(week)
        }

        return matrix
    }

    #render() {
        this.#leftMonth.innerText = this.#currentDate.toLocaleString('en', {month: 'long', year: 'numeric'})
        this.#rightMonth.innerText = this.#nextDate.toLocaleString('en', {month: 'long', year: 'numeric'})

        const currentMonth = this.#getCalendarMatrix(this.#currentDate)
        const nextMonth = this.#getCalendarMatrix(this.#nextDate)

        this.#leftArea.innerHTML = ''
        this.#rightArea.innerHTML = ''

        currentMonth.forEach(week => {
            week.forEach(day => {
                if (!day) {
                    this.#leftArea.innerHTML += `<span class="empty"></span>`
                } else {
                    this.#leftArea.innerHTML += `<button class="date" id="left-${day}">${day}</button>`
                }
            })
        })

        nextMonth.forEach(week => {
            week.forEach(day => {
                if (!day) {
                    this.#rightArea.innerHTML += `<span class="empty"></span>`
                } else {
                    this.#rightArea.innerHTML += `<button class="date" id="right-${day}">${day}</button>`
                }
            })
        })
    }

    #currentDateFill() {
        let date = this.#today.getDate()
        if (this.#currentDate.getMonth() === this.#today.getMonth()) {
            date = "left-" + date;
        } else if (this.#nextDate.getMonth() === this.#today.getMonth()) {
            date = "right-" + date;
        }

        const dateElement = document.getElementById(date);
        if (dateElement) {
            dateElement.classList.add('today');
        }
    }

    #fullRender() {
        this.#render()
        this.#currentDateFill()
        this.#removeSelectedDays()
    }
}