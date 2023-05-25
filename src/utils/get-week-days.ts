interface GetWeekDaysParams {
    short?: boolean
  }

export function getWeekDays({ short = false }: GetWeekDaysParams) {
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

    //Para criar array com 7 posicoes, com valores undefined
    //keys() para retornar o indice 
    return Array.from(Array(7).keys())
    .map(day => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
        if (short) {
          return weekDay.substring(0, 3).toUpperCase()
        }
})
}