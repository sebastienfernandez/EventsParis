/*  VERIFICATION DU LOCALSTORAGE    */
/*   si échec de la prise en charge du localstorage ou de sa disponibilité  */

function storageAvailable(type) {
    
    try {
        /* déclaration d'une variable storage et d'une varibale 'test'   */
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // tous es navigateurs sauf Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // et si code non présent (sans Firefox)
            e.name === 'QuotaExceededError' ||
            // code non présent avec Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // vérification du stockage
            (storage && storage.length !== 0);
    }
}

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


// si le localStorage marche

if (storageAvailable('localStorage')) {

    //selection du dernier favori ajouté

    let favoriteLast = JSON.parse(localStorage.favs)[JSON.parse(localStorage.favs).length - 1];

    //la valeur est mise en stockage local

    localStorage.setItem('last', favoriteLast);

    //si il n'y a pas aucun favori
    
    if (JSON.parse(localStorage.favs).length !== 0) {

        // requête du dernier événement d'après le dernier identifiant du localstorage

        $.ajax({
            url: 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records/' + favoriteLast,
            dataType: 'jsonp'
        }).done(function(last) {

            //affichage de cet événement

            $('#last-event').append(
                '<div class="event" data-id=' + last.record.id + '>' +
                    '<img class="event-image" alt="événement paris" title=' + last.record.fields.title + ' src=' + last.record.fields.cover.url + '/>' +
                    '<h3 class="event-name">' + last.record.fields.title + '</h3>' +
                    '<p class="event-date-start">' + convertDateToString(last.record.fields.date_start) + '</p>' +
                    '<p class="event-short-description">' + last.record.fields.lead_text + '</p>'  +
                    '<button data-id="'+last.record.id+'" class="heart selected">&#10084;</button>' +
                '</div>'
            )

        })

        //si aucun favori

    } else {
        document.querySelector('#last-event').innerHTML =
        '<p>Absence de favori dans cette session...</p>'
    }

    //  suppression de l'événement

    $('#last-event').on('click', '.selected', function() {

        //suppression de l'événement de l'écran et du localstorage

        const favs = JSON.parse(localStorage.getItem('favs')) || [];
        const newFavs = favs.filter(f => f !== $(this).data("id"));
        localStorage.setItem('favs', JSON.stringify(newFavs));
        let elementToDisplay = $(this).parent();
        elementToDisplay.css('display', 'none');

        let favoriteLast = JSON.parse(localStorage.favs)[JSON.parse(localStorage.favs).length - 1];

        //si il reste d'autres favoris

        if (JSON.parse(localStorage.favs).length !== 0) {

            $.ajax({
                url: 'https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records/' + favoriteLast,
                dataType: 'jsonp'
            }).done(function(last) {
    
                $('#last-event').append(
                    '<div class="event" data-id=' + last.record.id + '>' +
                        '<img class="event-image" alt="événement paris" title=' + last.record.fields.title + ' src=' + last.record.fields.cover.url + '/>' +
                        '<h3 class="event-name">' + last.record.fields.title + '</h3>' +
                        '<p class="event-date-start">' + convertDateToString(last.record.fields.date_start) + '</p>' +
                        '<p class="event-short-description">' + last.record.fields.lead_text + '</p>'  +
                        '<button data-id="'+last.record.id+'" class="heart selected">&#10084;</button>' +
                    '</div>'
                )
    
            })
    
        } else {
            document.querySelector('#last-event').innerHTML =
            '<p>Absence de favori dans cette session...</p>'
        }
        
    })

    //signalement d'un problème avec le localstorage

} else {
    alert("L'application EventParis nécessite la disponiblité du localStorage API");
}