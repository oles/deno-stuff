const timeFormatter = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
})

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

document.addEventListener("DOMContentLoaded", function() {
    const main = document.querySelector("main");
    const time = document.querySelector("time");

    function renderEvents(events) {
        const now = new Date();

        main.innerHTML = events.map(function(event) {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            const isPast = startDate < now;

            const day = capitalize(startDate.toLocaleDateString("nb-NO", { weekday: "long" }));
            const date = startDate.toLocaleDateString("nb-NO", { month: "2-digit", day: "2-digit" });

            const startTime = timeFormatter.format(startDate);
            const endTime = timeFormatter.format(endDate);

            return (
`<article class="${isPast ? "past" : ""}">
    <time class="date">
        ${day}
        <br>
        ${date}
    </time>

    <section>
        <h1>${event.title}</h1>

        <time>${startTime} - ${endTime}</time>

        ${event.location ? `<address>${event.location}</address>` : ""}
    </section>
</article>`
            )
        }).join("");
    }

    function renderTime() {
        const now = new Date()

        time.textContent = timeFormatter.format(now);
    }

    async function fetchEvents() {
        const response = await fetch("/api/calendar");
        const result = await response.json();

        renderEvents(result);
    }

    setInterval(fetchEvents, 30000);
    setInterval(renderTime, 1000);

    fetchEvents();
    renderTime();
})
