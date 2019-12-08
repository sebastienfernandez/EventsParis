$(function() {


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

            document.querySelector('#results').innerHTML =
                events.data.map(m => '<p>' + m + '</p>');
            console.log(events);
        })

        

    });

});