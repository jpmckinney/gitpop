$('#submit').click(function () {
  var url = $('#url').val();
  if (url) {
    var parser, username, reponame, client;

    parser = document.createElement('a');
    parser.href = url;
    [username, reponame] = parser.pathname.split('/').filter(function (n) {return n}).slice(0, 2);

    client = Octokat({});

    client.repos(username, reponame).fetch().then(function (repo) {
      repo.forks.fetch({sort: 'stargazers'}).then(function (forks) {
        var $table = $(
          '<table>' +
            '<thead>' +
              '<tr>' +
                '<th>Stargazers</th>' +
                '<th>Watchers</th>' +
                '<th>Forks</th>' +
                '<th>Issues</th>' +
                '<th>Owner</th>' +
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
              '<td>' + repo.stargazersCount + '</td>' +
              '<td>' + repo.watchersCount + '</td>' +
              '<td>' + repo.forksCount + '</td>' +
              '<td>' + repo.openIssuesCount + '</td>' +
              '<td><a href="' + href + '">' + repo.fullName.split('/')[0] + '</a></td>' +
              '<td>' + repo.updatedAt + '</td>' +
            '</tr>'
          ).appendTo($tbody);
        });
        $table.append($tbody);
        $('result').html($table);
      });
    });
  }
});
