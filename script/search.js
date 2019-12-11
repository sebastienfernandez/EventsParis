$(function() {

    function convertDateToString(string) {
        let date = new Date(string);
        let nbDay = date.getDate();
        let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        return 'Le ' + nbDay + ' ' + monthNames[monthIndex] + ' ' + year + ' à ' + hour + ':' + minutes;
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

            //const favorites = JSON.parse(localStorage.getItem('favs')) || [];

            /*document.querySelector('#results').innerHTML =
                events.data.map(m => '<p>' + m + '</p>');
            console.log('lol');*/

            console.log(events.records[0].record.fields);
            console.log(events.records)
            document.querySelector('#results').innerHTML = 
            events.records.map(m => '<div class="event">' + 
                '<img class="event-image" alt="événement paris" title=' + m.record.fields.title + ' src=' + m.record.fields.cover.url + '/>' + 
                '<h3 class="event-name">' + m.record.fields.title + '</h3>' +
                '<p class="event-date-start">' + convertDateToString(m.record.fields.date_start) + '</p>' +
                '<p class="event-short-description">' + m.record.fields.lead_text + '</p>' + 
                '<button class="heart unselected">&#10084;</button>' +
            '</div>')
            
        })

        

    });

});