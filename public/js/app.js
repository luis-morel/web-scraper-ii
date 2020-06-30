$(document).ready(() => {

    // Comment Delete
    $('.ws-comments-comment-delete-btn').on('click', (event) => {
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

    // Comment Submit
    $('#ws-comments-comment-submit').on('click', (event) => {
        let elementId = '#ws-comments-comment-form-',
            name = $(`${elementId}name`).val().trim(),
            comment = $(`${elementId}comment`).val().trim(),
            headlineId = $(`.headlineContent`).attr('data-id');
        if (name.length === 0) name = 'Anonymous';
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