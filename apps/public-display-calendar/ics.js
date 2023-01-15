import IcalExpander from 'npm:ical-expander@3.1.0'

export default function parseICS({ics, before, after}) {
    // inspired by https://github.com/mifi/ical-expander#example
    const icalExpander = new IcalExpander({ ics })

    const parsed = icalExpander.between(before, after)

    const events = [
        ...parsed.events,
        ...parsed.occurrences.map(function(occurence) {
            return {
                ...occurence,
                summary: occurence.item.summary,
                component: occurence.item.component
            }
        })
    ]

    const mapped = events.map(function(event) {
        const { summary, startDate, endDate } = event

        const location = event.component.getFirstPropertyValue('location')

        return {
            title: summary,
            startDate: startDate.toJSDate(),
            endDate: endDate.toJSDate(),
            location
        }
    })

    return mapped
}
