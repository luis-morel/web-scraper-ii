$(document).ready(() => {

    $('#commentDelete').on('click', (event) => {
        let commentId = $(event.currentTarget).attr('data-id');
        let headline = { headlineId: $('#ws-comments-comment-submit').attr('data-id') };
        $.ajax({
            method: 'DELETE',
            url: `/comments/${commentId}`,
            data: headline
        })
            .then((res) => {
                let url = `${window.location.origin}/comments/${headline.headlineId}`;
                window.location.assign(url);
            });
    });

    $(document).on('click', '#commentButton', (event) => {
        let headline = { headlineId: $(event.currentTarget).attr('data-id') };
        $.ajax({
            method: 'GET',
            url: '/comments',
            data: headline
        })
            .then((pathname) => {
                let url = `${window.location.origin}${pathname}`;
                window.location.assign(url);
            });
    });

    $('#commentInput').on('keyup', (event) => {
        if (event.which == 13) {
            let comment = { message: $(event.currentTarget).val().trim() };
            let headlineId = $(this).attr('data-id');
            $('#commentInput').val('');
            $.ajax({
                method: 'POST',
                url: `/comments/${headlineId}`,
                data: comment
            })
                .then(() => {
                    let url = `${window.location.origin}/comments/${headlineId}`;
                    window.location.assign(url);
                });
        };
    });

    $('#ws-comments-comment-submit').on('click', (event) => {
        let elementId = '#ws-comments-comment-panel-',
            name = $(`${elementId}name`).val().trim(),
            comment = $(`${elementId}comment`).val().trim(),
            headlineId = $(`${elementId}comment`).attr('data-id');
        $(`${elementId}name`).val('');
        $(`${elementId}comment`).val('');
        $.ajax({
            method: 'POST',
            url: `/comments/${headlineId}`,
            data: { name, comment }
        })
            .then(() => {
                let url = `${window.location.origin}/comments/${headlineId}`;
                window.location.assign(url);
            });
    });

});