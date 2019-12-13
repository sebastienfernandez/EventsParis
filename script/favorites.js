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

    // supression de tous les événements

    $("#clear-button").on('click',function() {
        if (confirm("Voulez vous vraiment supprimer tous vos favoris ?")) {
            localStorage.clear();
            document.querySelector('#favorites-selection').innerHTML =
                '<p class="p-results">Aucun favoris dans votre liste...</p>'
        } 
        
    });

})