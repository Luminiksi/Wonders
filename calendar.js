export class Calendar {
    #leftArea
    #rightArea
    #leftButton
    #rightButton
    #leftMonth
    #rightMonth
    #currentDate
    #nextDate

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
    }


    init() {
        this.#render()

        this.#leftButton.addEventListener("click", () => {
            this.#currentDate.setMonth(this.#currentDate.getMonth() - 1);
            this.#nextDate.setMonth(this.#nextDate.getMonth() - 1);
            this.#render()
        })

        this.#rightButton.addEventListener("click", () => {
            this.#currentDate.setMonth(this.#currentDate.getMonth() + 1);
            this.#nextDate.setMonth(this.#nextDate.getMonth() + 1);
            this.#render()
        })
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
                    this.#leftArea.innerHTML += `<button class="date">${day}</button>`
                }
            })
        })

        nextMonth.forEach(week => {
            week.forEach(day => {
                if (!day) {
                    this.#rightArea.innerHTML += `<span class="empty"></span>`
                } else {
                    this.#rightArea.innerHTML += `<button class="date">${day}</button>`
                }
            })
        })
    }
}