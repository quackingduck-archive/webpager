# Webpager

Pipe html chunks to the browser:

    $ echo "<h1>beep</h1>" | webpager
    $ echo "*beep*" | markdown | webpager

Heavily inspired by [bcat] by Ryan Tomayko which was in turn inspired by [TextMate's html output][tmho] by Allan Odgaard.

[bcat]:https://github.com/rtomayko/bcat
[tmho]:http://manual.macromates.com/en/commands#html_output

## Install

    npm install -g webpager

## Todo

* peek at incoming stream;
* don't include a html header if the stream already does;
* if the stream doesn't look like html then send as plaintext

