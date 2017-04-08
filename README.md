# bgboard

Javascript Backgammon Board

Inserts a simple and clear backgammon board using plain Javascript
(no dependencies).

![bgboard - example checker play position](http://i.imgur.com/GpQU9hE.png)

---

### Features

* Multiple boards per web page are possible.
* All types of decisions are supported:
	* Checker move
	* Roll or double
	* Take or drop
* Match information can also be drawn (match length, match score, crawford game or not).
* Easy board scaling via a single `scale` parameter.
* Position description is expected in the standard GNU Backgammon format (example: AMAAmLkFSEgBAA:UQmyAAAAAAAE).

Please note that `bgboard` does *not* support playing backgammon. Its purpose is simply to display
positions for discussion and demonstration. The position description
is expected in GNU Backgammon format.

Here is a minimal example:

```html
<!doctype html>
<html>
	<head>
		<link rel=stylesheet href=/css/bgboard.css>
		<script src=/js/bgboard.js></script>
		<meta charset=utf-8></meta>
	</head>
	<body>
		Here is the board:
		<div id=board1></div>
	</body>
	<script>
		var bgBoard1 = new BgBoard({
			/* Base URL of the bgboard installation. */
			filesRoot : '/',
			/* CSS selector for the containing div element. */
			containerSelector : '#board1',
			/* Scale the board size, for example 0.5 is half size. */
			scale : 0.8,
			/* Position to draw, format is p:m,
			 * where p is the GNU Backgammon Position ID
			 * and m is the GNU Backgammon Match ID.
			*/
			gnuid :	'AMAAmLkFSEgBAA:UQmyAAAAAAAE'
		});
	</script>
</html>
```

### Installation

Make the directories `img`, `js` and `css` accessible on your website. For example `http://www.example.com/static/bgboard/img`. That's it! Now you can use `http://www.example.com/static/bgboard` in the `filesRoot` option to the `BgBoard` constructor.

### Tests

There are tests that cover over 90% of the `bgboard` code. To run them open the file `/tests/test.html` in the desired browser. You can also run `run_server.sh` which launches a simple single-threaded web server on `http://localhost:8000`.
