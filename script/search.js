$(function() {

    // fonction de conversion de la date pour affichage

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

    //l'appui de la touche enter déclenche la validation du formulaire

    $(document).on('keypress', function(e) {
        if(e.which == 13) {
            $("#submit").click();
        }
    })

    $("#submit").click(function() {

        // requête de recherche des événements

        $.ajax({
            url : 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records?search=' + $("#name").val(),
            dataType: 'jsonp'
        }).done(function(events) {

            const favorites = JSON.parse(localStorage.getItem('favs')) || [];

            // affichage de ces événements

            document.querySelector('#results').innerHTML = 
            events.records.map(event => '<div class="event" data-id=' + event.record.id + '>' + 
                '<img class="event-image" alt="événement paris" title=' + event.record.fields.title + ' src=' + event.record.fields.cover.url + '/>' + 
                '<h3 class="event-name">' + event.record.fields.title + '</h3>' +
                '<p class="event-date-start">' + convertDateToString(event.record.fields.date_start) + '</p>' +
                '<p class="event-short-description">' + event.record.fields.lead_text + '</p>'  +
                selectedButton(favorites.find(f => event.record.id === f), event) +
            '</div>').join('<br>');

            if(events.records.length === 0) {
                document.querySelector('#results').innerHTML =
                '<p class="off-results">Aucun résultat pour cette recherche...</p>'
            }
            
        })

        

    });

});

//afficher les détails de l'événement

$('#results').on('click', '.event', function() {
    let eventId = $(this).data('id');
    const favorites = JSON.parse(localStorage.getItem('favs')) || [];
    $.ajax({
        url: 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records/' + eventId,
        dataType: 'jsonp'
    }).done(function(choosen) {
        document.querySelector('main').innerHTML = 
         '<div class="choosen-event">'  + 
            '<h1>' + choosen.record.fields.title + '</h1>' +
            '<div class="choosen-event-main">' +
            '<section>' +
                '<img class="large-image" src=' + choosen.record.fields.cover.url + '/>' +
                '<p>' + choosen.record.fields.lead_text + '</p>' +
                '<p>' + choosen.record.fields.description + '</p>' +
            '</section>' +
            '<aside>' +
                selectedButton(favorites.find(f => choosen.record.id === f), choosen) +
                '<h3>Dates :</h3>' +
                '<p>' + choosen.record.fields.date_description + '</p>' +
                '<h3>Prix : </h3>' +
                '<p>' + choosen.record.fields.price_detail + '</p>' +
                '<h3>Localisation : </h3>' +
                '<p>' + choosen.record.fields.contact_name + '<br>' + choosen.record.fields.address_street + '</p>' +
                '<h3>En transports</h3>' +
                '<p>' + choosen.record.fields.transport + '</p>' +
                "<h3>Plus d'infos</h3>" +
                '<p>' + choosen.record.fields.contact_phone + '</p>' +
                '<a href=' + choosen.record.fields.contact_mail + '>' + choosen.record.fields.contact_mail + '</a><br>' + 
                '<a href=' + choosen.record.fields.contact_facebook + '>' + choosen.record.fields.contact_facebook + '</a>' +
            '</aside>' +
            '</div>' +
         '</div>'
    })
})

// configuration des boutons

function selectedButton (selected, event) {
    return selected ? '<button data-id="'+ event.record.id +'" class="heart selected">&#10084;</button>' : '<button data-id="'+ event.record.id +'" class="heart unselected">&#10084;</button>'
}

// le bouton indique un événement non sélectionné

$('#results').on('click', '.unselected', function() {

    const favs = JSON.parse(localStorage.getItem('favs')) || [];

    favs.push($(this).data('id'));

    localStorage.setItem('favs', JSON.stringify(favs));

    $(this).removeClass('unselected');

    $(this).addClass('selected');

});

// idem, pour l'événement détaillé

$('main').on('click', '.unselected', function() {

    const favs = JSON.parse(localStorage.getItem('favs')) || [];

    favs.push($(this).data('id'));

    localStorage.setItem('favs', JSON.stringify(favs));

    $(this).removeClass('unselected');

    $(this).addClass('selected');

});

// le bouton indique un événement sélectionné

$('#results').on('click', '.selected', function() {

    const favs = JSON.parse(localStorage.getItem('favs')) || [];

    const newFavs = favs.filter(f => f !== $(this).data("id"));

    localStorage.setItem('favs', JSON.stringify(newFavs));

    $(this).removeClass('selected');

    $(this).addClass('unselected');

})

// idem, pour l'événement détaillé

$('main').on('click', '.selected', function() {

    const favs = JSON.parse(localStorage.getItem('favs')) || [];

    const newFavs = favs.filter(f => f !== $(this).data("id"));

    localStorage.setItem('favs', JSON.stringify(newFavs));

    $(this).removeClass('selected');

    $(this).addClass('unselected');

})

