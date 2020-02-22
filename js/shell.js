var shell = $('.shell');
var editor = $(".tedit");
var editorTitle = $("#tetitle");
var output = $("#teditcontent");
var mdurl = "";
var converter = new showdown.Converter();

$(document).ready(function() {
  editor.hide();
});

// Fake in memory filesystem
var fs = {
  "about.txt": "\r\n[[b;;]ABOUT ME]\r\n\r\nI'm a coder, currently focusing on frontend web development.\r\nBesides programming I also do video editing, music and design.\r\nIf you'd like to hire me for a job or want to see some more\r\nexamples/references, contacts are in [[b;;]/contacts.txt] file.\r\n",
  'projects': {
    "music": {
      "IDKLOL.mp3": "audio",
      "Prognome.mp3": "audio"
    },
    "visual": {
      "smokinglady.jpg": "image",
      "barrensunset.jpg": "image"
    },
    "tech": {
      "dcprotez.md": "# DC Protez\r\n\r\nPrague based non-profit organization Prot\u011B\u017E focuses on volunteer work and community services.\r\n\r\nWebsite: [https://www.dcprotez.cz](https://www.dcprotez.cz)\r\n\r\n![DC Protez preview](techProjects/dcprotez.jpg \"Preview\")\r\n",
      "skolickagrebovka.md": "# Skolicka Grebovka\r\n\r\n\u0160koli\u010Dka Gr\u00E9bovka is a children's group for preschool children two years and older.\r\n\r\nWebsite: [https://www.skolickagrebovka.cz](https://www.skolickagrebovka.cz)\r\n\r\n![Skolicka Grebovka preview](techProjects/skolickagrebovka.jpg \"Preview\")\r\n",
      "bitcoingo.md": "# BitcoinGo\r\n\r\nAbandoned cryptocurrency project based on the Ethereum blockchain, fully decentralized and community-driven.\r\n\r\nArchived website: [http://bitcoingo.matronator.com](http://bitcoingo.matronator.com)\r\n\r\n![BitcoinGo.io preview](techProjects/bitcoingo.jpg \"Preview\")\r\n",
      "noblesmanor.md": "# Nobles Manor apartments\r\n\r\nBooking website for Nobles Manor under the Castle apartments in the Lesser Town of Prague.\r\n\r\nArchived website: [http://noblesmanor.matronator.com](http://noblesmanor.matronator.com)\r\n\r\n![Nobles Manor preview](techProjects/noblesmanor.jpg \"Preview\")\r\n",
      "burner.md": "# Message Burner\r\n\r\nService for creating self-destructing private messages, inspired by Privnote.\r\n\r\nWebsite: [https://burner.matronator.com](https://burner.matronator.com)\r\n\r\n![Burner preview](techProjects/burner.jpg \"Preview\")\r\n",
      "magicwars.md": "# Magic Wars\r\n\r\nA single player card game for Windows. Demo contains three decks and enemies. Project inactive for several years now.\r\n\r\nDemo (Windows only): [Download (15.3 MB)](http://files.matronator.com/magicwarsdemo.zip)\r\n\r\nWebsite: [http://magicwars.8u.cz](http://magicwars.8u.cz)\r\n\r\n![Magic Wars preview](techProjects/magicwars.jpg \"Preview\")\r\n",
      "feedtheflames.md": "# Feed the flames\r\n\r\nSimple open source HTML5/JavaScript game concept made with CraftyJS.\r\n\r\nWebsite: [https://matronator.github.io/feed-the-flames](https://matronator.github.io/feed-the-flames/)\r\n\r\nSource code: [https://github.com/matronator/feed-the-flames](https://github.com/matronator/feed-the-flames)\r\n\r\n![Feed the flames preview](techProjects/feedtheflames.jpg \"Preview\")\r\n",
      "symphony.md": "# Symphony of Destruction\r\n\r\nA simple relaxation website from back in the day. Requires enabled autoplay on videos to fully work.\r\n\r\nWebsite: [http://destruction.matronator.com](http://destruction.matronator.com)\r\n\r\n![Symphony of Destruction preview](techProjects/symphony.jpg \"Preview\")\r\n",
      "faucet.md": "# Matronator's Bitcoin Faucet\r\n\r\nOne of the highest paying bitcoin faucet on FaucetSystem.com.\r\n\r\nWebsite: [https://btc.matronator.com](https://btc.matronator.com/?r=34NByYEZHm6Fgwc3GUWMveGHkWnEbpBw8q)\r\n\r\n![Faucet preview](techProjects/faucet.jpg \"Preview\")\r\n"
    }
  },
  "contact.txt": "\r\n[[b;;]CONTACT]\r\n\r\nEmail\r\n[[b;;]info@matronator.com]\r\n\r\nSocial\r\n[[!;;;;https://github.com/matronator]GitHub]\r\n[[!;;;;https://www.linkedin.com/in/matronator]LinkedIn]\r\n[[!;;;;https://www.youtube.com/c/Matronator?sub_confirmation=1]YouTube]\r\n[[!;;;;https://soundcloud.com/matronator]SoundCloud]\r\n[[!;;;;https://www.mixcloud.com/matronator/]MixCloud]\r\n[[!;;;;https://www.instagram.com/matronator/]Instagram]\r\n"
};

var path = [];
var cwd = fs;
function restore_cwd(fs, path) {
  path = path.slice();
  while (path.length) {
    var dir_name = path.shift();
    if (!is_dir(fs[dir_name])) {
      throw $.terminal.escape_brackets(dir_name);
    }
    fs = fs[dir_name];
  }
  return fs;
}
function is_dir(obj) {
  return typeof obj === 'object';
}
function is_file(obj) {
  return typeof obj === 'string';
}
function openTextedit(filname) {
  editorTitle.text(filname);
  mdurl = "techProjects/" + filname;
  $.ajax({
    url: mdurl,
    type: "GET",
    dataType: "text"
  }).done(function(results) {
    html = converter.makeHtml(results);
    output.html(html);
    editor.show();
    editor.addClass("window-active");
    $(".macosterm").removeClass("window-active");
  });
}
function closeTextedit() {
  editor.hide();
}
var commands = {
  cd: function (dir) {
    this.pause();
    if (dir === '/') {
      path = [];
      cwd = restore_cwd(fs, path);
    } else if (dir === '..') {
      if (path.length) {
        path.pop(); // remove from end
        cwd = restore_cwd(fs, path);
      }
    } else if (dir.match(/\//)) {
      var p = dir.replace(/\/$/, '').split('/').filter(Boolean);
      if (dir[0] !== '/') {
        p = path.concat(p);
      }
      cwd = restore_cwd(fs, p);
      path = p;
    } else if (!is_dir(cwd[dir])) {
      if (is_file(cwd[dir])) {
        this.error("-bash: cd: " + $.terminal.escape_brackets(dir) + ': Not a directory');
      } else {
        this.error("-bash: cd: " + $.terminal.escape_brackets(dir) + ': No such file or directory');
      }
    } else {
      cwd = cwd[dir];
      path.push(dir);
    }
    this.resume();
  },
  ls: function () {
    if (!is_dir(cwd)) {
      throw new Error('Internal Error Invalid directory');
    }
    var dir = Object.keys(cwd).map(function (key) {
      if (is_dir(cwd[key])) {
        return key + '/';
      }
      return key;
    });
    this.echo("[[;white;]" + dir.join('\n') + "]");
  },
  md: function (file) {
    if (!is_file(cwd[file])) {
      if (is_dir(cwd[file])) {
        this.error("md: " + $.terminal.escape_brackets(file) + ": Is a directory");
      } else {
        this.error("md: " + $.terminal.escape_brackets(file) + ": No such file or directory");
      }
    } else {
      if (file.endsWith(".md")) {
        openTextedit(file);
      } else {
        this.error("md: " + $.terminal.escape_brackets(file) + ": Can't read file");
      }
    }
  },
  cat: function (file) {
    if (!is_file(cwd[file])) {
      if (is_dir(cwd[file])) {
        this.error("cat: " + $.terminal.escape_brackets(file) + ": Is a directory");
      } else {
        this.error("cat: " + $.terminal.escape_brackets(file) + ": No such file or directory");
      }
    } else {
      if (file.endsWith(".txt") || file.endsWith(".md")) {
        this.echo(cwd[file]);
      } else {
        this.error("cat: " + $.terminal.escape_brackets(file) + ": Can't read file");
      }
    }
  },
  help: function () {
    this.echo("[[b;white;]?, h, help][[i;;] - Display information about available commands]");
    this.echo("[[b;white;]cd \[DIR\\]][[i;;] - Change the current directory to DIR]");
    this.echo("[[b;white;]ls][[i;;] - List contents of current directory]");
    this.echo("[[b;white;]cat \[file\\]][[i;;] - Print contents of a file]");
    this.echo("[[b;white;]md \[file\\]][[i;;] - Open markdown file in 'Markdown Reader']");
  },
  h: function () {
    this.exec("help", true);
  },
  "?": function () {
    this.exec("help", true);
  }
};
function completion(string, callback) {
  var command = this.get_command();
  var cmd = $.terminal.parse_command(command);
  function dirs(cwd) {
    return Object.keys(cwd).filter(function (key) {
      return is_dir(cwd[key]);
    }).map(function (dir) {
      return dir + '/';
    });
  }
  if (cmd.name === 'ls') {
    callback([]);
  } else if (cmd.name === 'cd') {
    var p = string.split('/').filter(Boolean);
    if (p.length === 1) {
      if (string[0] === '/') {
        callback(dirs(fs));
      } else {
        callback(dirs(cwd));
      }
    } else {
      if (string[0] !== '/') {
        p = path.concat(p);
      }
      if (string[string.length - 1] !== '/') {
        p.pop();
      }
      var prefix = string.replace(/\/[^/]*$/, '');
      callback(dirs(restore_cwd(fs, p)).map(function (dir) {
        return prefix + '/' + dir;
      }));
    }
  } else if (cmd.name === 'cat') {
    var files = Object.keys(cwd).filter(function (key) {
      return is_file(cwd[key]);
    });
    callback(files);
  } else if (cmd.name === 'md') {
    var files = Object.keys(cwd).filter(function (key) {
      return is_file(cwd[key]);
    });
    callback(files);
  } else {
    callback(Object.keys(commands));
  }
}
var term = $('.content').terminal(commands, {
  greetings: "___  ___      _                         _             \r\n|  \\/  |     | |                       | |            \r\n| .  . | __ _| |_ _ __ ___  _ __   __ _| |_ ___  _ __ \r\n| |\\/| |/ _` | __| '__/ _ \\| '_ \\ / _` | __/ _ \\| '__|\r\n| |  | | (_| | |_| | | (_) | | | | (_| | || (_) | |   \r\n\\_|  |_/\\__,_|\\__|_|  \\___/|_| |_|\\__,_|\\__\\___/|_|   \r\n\r\nTerminal portfolio v0.1\r\n\r\nMade with jQuery Terminal Emulator v. 2.12.0 (c) 2011-2019 Jakub T. Jankiewicz",
  height: 500,
  prompt: prompt(),
  completion: completion,
  checkArity: false,
  exceptionHandler: function(execption) {
    return this.error("-bash: cd: " + execption + ': No such file or directory');
  },
  onInit: function() {
    this.echo("Welcome to my portfolio terminal. [[;white;]Type 'help' for list of available commands\r\nYou can autocomplete commands and file/folder names by pressing 'TAB']\r\n");
  }
});
if (!term.enabled()) {
  term.find('.cursor').addClass('blink');
}
function prompt() {
  return function (callback) {
    var prompt;
    prompt = 'guest@matronator.com:/' + path.join('/') + '$ ';
    $('.title').html(prompt);
    callback(prompt);
  };
}
