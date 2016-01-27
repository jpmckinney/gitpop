$('#submit').click(function (event) {
  var url, parser, username, reponame, client;

  event.preventDefault();

  $('#result').empty();

  url = $('#url').val();

  if (url) {
    if (url.indexOf('://') > -1) {
      parser = document.createElement('a');
      parser.href = url;
      username_reponame = parser.pathname.split('/').filter(function (n) {return n}).slice(0, 2);
      username = username_reponame[0];
      reponame = username_reponame[1];
    }
    else {
      username_reponame = url.split('/').slice(0, 2);
      username = username_reponame[0];
      reponame = username_reponame[1];
    }

    client = Octokat({});

    client.repos(username, reponame).fetch().then(function (repo) {
      repo.forks.fetch({sort: 'stargazers'}).then(function (forks) {
        var $table = $(
          '<table class="table table-striped table-hover table-condensed">' +
            '<thead>' +
              '<tr>' +
                '<th>Owner</th>' +
                '<th>Stargazers</th>' +
                '<th>Watchers</th>' +
                '<th>Forks</th>' +
                '<th>Issues</th>' +
                '<th>Modified</th>' +
              '</thead>' +
            '</table>'
          )
          , $tbody = $(
            '<tbody></tbody>'
          );

        [repo].concat(forks).forEach(function (repo) {
          var href = repo.url.replace('https://api.github.com/repos/', 'https://github.com/');
          $(
            '<tr>' +
              '<td><a href="' + href + '">' + repo.fullName.split('/')[0] + '</a></td>' +
              '<td>' + repo.stargazersCount + '</td>' +
              '<td>' + repo.subscribersCount + '</td>' +
              '<td>' + repo.forksCount + '</td>' +
              '<td>' + repo.openIssuesCount + '</td>' +
              '<td>' + moment(repo.updatedAt).format('YYYY-MM-DD') + '</td>' +
            '</tr>'
          ).appendTo($tbody);
        });

        $table.append($tbody);

        $('#result').html($table);
      });
    });
  }
});
