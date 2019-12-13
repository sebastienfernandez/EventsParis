$(function() {

    // définition de la variable contenant tous les favoris

    const favs = JSON.parse(localStorage.getItem('favs'));

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

    // si la variable est vide

    if (favs.length === 0) {
        document.querySelector('#favorites-selection').innerHTML =
                    '<p class="p-results">Aucun favori dans votre liste...</p>'
    };

    // boucle affichant tous les favoris

    favs.forEach(fav => {
        console.log(fav);
        $.ajax({
            url: 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records/' + fav,
            dataType: 'jsonp'
        }).done(function(event) {
            $('#favorites-selection').append(
                '<div class="event" data-id='  + event.record.id +  '>' + 
                '<img class="event-image" alt="événement paris" title=' + event.record.fields.title + ' src=' + event.record.fields.cover.url + '/>' + 
                '<h3 class="event-name">' + event.record.fields.title + '</h3>' +
                '<p class="event-date-start">' + convertDateToString(event.record.fields.date_start) + '</p>' +
                '<p class="event-short-description">' + event.record.fields.lead_text + '</p>'  +
                '<button data-id="'+ event.record.id+'" class="heart selected">&#10084;</button>' +
            '</div><br>'
            );
            
        //  suppression de l'événement

        $('#favorites-selection').on('click', '.selected', function() {
            const favs = JSON.parse(localStorage.getItem('favs')) || [];
            const newFavs = favs.filter(f => f !== $(this).data("id"));
            localStorage.setItem('favs', JSON.stringify(newFavs));
            let elementToDisplay = $(this).parent();
            elementToDisplay.css('display', 'none');
            if (favs.length === 0) {
                document.querySelector('#favorites-selection').innerHTML =
                            '<p class="p-results">Aucun favoris dans votre liste...</p>'
            };
        })

        })

    })

    //afficher les détails de l'événement

$('#favorites-selection').on('click', '.event', function() {
    let eventId = $(this).data('id');
    console.log(eventId);
    const favorites = JSON.parse(localStorage.getItem('favs')) || [];
    $.ajax({
        url: 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records/' + eventId,
        dataType: 'jsonp'
    }).done(function(choosen) {
        console.log(choosen);
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

    // supression de tous les événements

    $("#clear-button").on('click',function() {
        if (confirm("Voulez vous vraiment supprimer tous vos favoris ?")) {
            localStorage.clear();
            document.querySelector('#favorites-selection').innerHTML =
                '<p class="p-results">Aucun favoris dans votre liste...</p>'
        } 
        
    });

})