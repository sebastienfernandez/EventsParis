$(function() {

    function convertDateToString(string) {
        let date = new Date(string);
        let nbDay = date.getDate();
        let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        if (minutes !== 0) {
            return 'Le ' + nbDay + ' ' + monthNames[monthIndex] + ' ' + year + ' à ' + hour + 'h' + minutes;
        } else {
            return 'Le ' + nbDay + ' ' + monthNames[monthIndex] + ' ' + year + ' à ' + hour + 'h';
        }
        
    }


    $(document).on('keypress', function(e) {
        if(e.which == 13) {
            $("#submit").click();
        }
    })

    $("#submit").click(function() {

        $.ajax({
            url : 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records?search=' + $("#name").val(),
            dataType: 'jsonp'
        }).done(function(events) {

            const favorites = JSON.parse(localStorage.getItem('favs')) || [];

            console.log(events.records)
            document.querySelector('#results').innerHTML = 
            events.records.map(event => '<div class="event">' + 
                '<img class="event-image" alt="événement paris" title=' + event.record.fields.title + ' src=' + event.record.fields.cover.url + '/>' + 
                '<h3 class="event-name">' + event.record.fields.title + '</h3>' +
                '<p class="event-date-start">' + convertDateToString(event.record.fields.date_start) + '</p>' +
                '<p class="event-short-description">' + event.record.fields.lead_text + '</p>'  +
                selectedButton(favorites.find(f => event.record.id === f), event) +
            '</div>')

            if(events.records.length === 0) {
                document.querySelector('#results').innerHTML =
                '<p class="off-results">Aucun résultat pour cette recherche...</p>'
            }
            
        })

        

    });

});

function selectedButton (selected, track) {
    return selected ? '<button data-id="'+track.record.id+'" class="heart selected">&#10084;</button>' : '<button data-id="'+track.record.id+'" class="heart unselected">&#10084;</button>'
}

$('#results').on('click', '.unselected', function() {
    const favs = JSON.parse(localStorage.getItem('favs')) || [];
    favs.push($(this).data('id'));

    localStorage.setItem('favs', JSON.stringify(favs));

    $(this).removeClass('unselected');
    $(this).addClass('selected');
    console.log(localStorage)
});

$('#results').on('click', '.selected', function() {
    const favs = JSON.parse(localStorage.getItem('favs')) || [];
    const newFavs = favs.filter(f => f !== $(this).data("id"));
    localStorage.setItem('favs', JSON.stringify(newFavs));

    $(this).removeClass('selected');
    $(this).addClass('unselected');
    console.log(localStorage)

})