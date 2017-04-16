/*! version : 1.0
=======================================
bgboard
Javascript Backgammon Board
https://github.com/gtzampanakis/bgboard
=======================================

MIT License

Copyright (c) 2017 Giorgos Tzampanakis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

var BgBoard = (function() {

function pad(d, a) {
    if (d === "") {
        d = "0"
    }
    for (var b = 0; b < (d.length % a); b++) {
        d += "0"
    }
    return d
}

function rev(d) {
    var a = "";
    for (var b = d.length - 1; b >= 0; b--) {
        a += d.charAt(b)
    }
    return a
}

function base642bin(f) {
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var e = "";
    var a = "";
    for (var d = 0; d < f.length; d++) {
        if (b.indexOf(f.charAt(d)) == -1) {
            return false
        }
        e += rev(pad(rev(dec2Bin(b.indexOf(f.charAt(d)))), 6))
    }
    e = pad(e, 8);
    for (d = 0; d < (e.length / 8); d++) {
        a += rev(e.substring(d * 8, (d + 1) * 8))
    }
    return a
}

function dec2Bin(b) {
    var a = "";
    if (b === 0) {
        a = "0"
    }
    while (b > 0) {
        if (b % 2 == 1) {
            a = "1" + a
        } else {
            a = "0" + a
        }
        b = Math.floor(b / 2)
    }
    return a
}

function bin2Dec(e) {
    var b = 0;
    for (var d = 0; d < e.length; d++) {
        b = b * 2;
        if (e.charAt(d) == "1") {
            b = b + 1
        }
    }
    return b
}

function BgBoard(options) {

	options.scale = options.scale ? options.scale : 1;

	this.options = options;
	this.container = document.querySelector(options.containerSelector);
    this.container.className += ' bgboard_container';

	this.CHECK_SIDE_LENGTH 
		= BgBoard.BASE_CHECK_SIDE_LENGTH * options.scale;

	this.DIE_SIDE_LENGTH 
		= BgBoard.BASE_DIE_SIDE_LENGTH * options.scale;

	this.DICE_MARGIN 
		= BgBoard.BASE_DICE_MARGIN * options.scale;

	this.OVERFLOW_INDICATOR_SIZE 
		= BgBoard.BASE_OVERFLOW_INDICATOR_SIZE * options.scale;

	this.HALF_CHECK_SIDE_LENGTH = this.CHECK_SIDE_LENGTH / 2;

	this.BAR_LEFT_OFFSET = 
		  8 * this.CHECK_SIDE_LENGTH + this.HALF_CHECK_SIDE_LENGTH;
	this.BEAROFF_TRAY_LEFT_OFFSET = 
		 16 * this.CHECK_SIDE_LENGTH + this.HALF_CHECK_SIDE_LENGTH;

	this.BEAROFF_TRAY_WIDTH = 2 * this.CHECK_SIDE_LENGTH;

	this.BAR_VERT_OFFSET = 7 * this.CHECK_SIDE_LENGTH;

	this.BOARD_WIDTH = 18 * this.CHECK_SIDE_LENGTH;
	this.BOARD_HEIGHT = 
		this.CHECK_SIDE_LENGTH * 13+ this.CHECK_SIDE_LENGTH * 2 / 3;

	this.FIRST_DIE_LEFT_OFFSET 
			= 10 * this.CHECK_SIDE_LENGTH 
				+ 3 * this.CHECK_SIDE_LENGTH - this.DIE_SIDE_LENGTH 
				- this.DICE_MARGIN;
	this.SECOND_DIE_LEFT_OFFSET = 
						  this.FIRST_DIE_LEFT_OFFSET 
							+ this.DIE_SIDE_LENGTH + 2 * this.DICE_MARGIN;
	this.DICE_LEFT_OFFSETS = [this.FIRST_DIE_LEFT_OFFSET, 
								 this.SECOND_DIE_LEFT_OFFSET];

	this.OFFERED_CUBE_LEFT_OFFSET = 
							10 * this.CHECK_SIDE_LENGTH 
						+    3 * this.CHECK_SIDE_LENGTH 
						-   this.HALF_CHECK_SIDE_LENGTH 
						+ this.CHECK_SIDE_LENGTH / 12;

	this.DICE_TOP_OFFSET = 
						this.BOARD_HEIGHT / 2 - this.DIE_SIDE_LENGTH / 2;

	this.CENTERED_CUBE_TOP_OFFSET = this.DICE_TOP_OFFSET + 2;
	this.CENTERED_CUBE_LEFT_OFFSET = this.CHECK_SIDE_LENGTH / 2;

	this.OVERFLOW_LABEL_OFFSET = this.CHECK_SIDE_LENGTH / 6;

	this.CUBE_LEFT_OFFSET = this.BEAROFF_TRAY_WIDTH / 4;

	this.NUMBERS_ROW_HEIGHT = this.CHECK_SIDE_LENGTH / 2;

	this.POINT_HEIGHT = this.POINT_CAPACITY * this.CHECK_SIDE_LENGTH;

	this.CUBE_TEXT_SIZE = 
			this.HALF_CHECK_SIDE_LENGTH + this.HALF_CHECK_SIDE_LENGTH / 2;

	this.CUBE_OVERFLOW_LABEL_OFFSET = this.CHECK_SIDE_LENGTH / 24;

	this.container.style.width 
		= (BgBoard.BASE_CONTAINER_WIDTH * options.scale) + 'px';
	this.container.style.height
		= (BgBoard.BASE_CONTAINER_HEIGHT * options.scale) + 'px';

	var boardImage = new Image;
	boardImage.src = this.options.filesRoot + 'img/empty_board.jpg';
	boardImage.style.width = this.container.style.width;
	boardImage.style.height = this.container.style.height;
	boardImage.className = 'bgboard_empty_board';
	this.container.appendChild(boardImage);

	if (this.setDataFromGnuid(options.gnuid)) {
        this.drawBoard();
    }
    else {
        this.drawErrorNote();
    }

}

BgBoard.prototype.initData = function() {
	 this.arrPoints = new Array(0, 0, 0, 0, 0, 0, 
			 					0, 0, 0, 0, 0, 0, 
								0, 0, 0, 0, 0, 0, 
								0, 0, 0, 0, 0, 0);
	 this.arrCheckers = new Array(0, 0);
	 this.arrBar = new Array(0, 0);
	 this.intOnRoll = 0;
	 this.intDice = 0;
	 this.strDice;
	 this.intCubePos = 0;
	 this.intCubeVal = 0;
	 this.intMatchLgh = 0;
	 this.intScoreW = 0;
	 this.intScoreB = 0;
	 this.booCrawW = false;
	 this.booCrawB = false;
	 this.booCrawford = false;
	 this.isCrawford;
	 this.strReply = "";
	 this.intRestOnroll = 0;
	 this.intRestDice = 0;
	 this.intRestCpos = 0;
	 this.intRestCval = 0;
	 this.intRestMlgh = 0;
	 this.intRestWscr = 0;
	 this.intRestBscr = 0;
	 this.numbersPlayed = [ ]
	 this.decisionStatus = null;
	 this.movePairs = [];
}

BgBoard.prototype.setDataFromGnuid = function(gnuid) {
    
    if (!gnuid) {
        return false;
    }

    gnuid = gnuid.trim();

	this.initData();

    var strPosId = gnuid.split(':')[0];
    var strMatchId = gnuid.split(':')[1];

    if (strPosId.length != 14) {
        return false;
    }
    if (strMatchId.length != 12) {
        return false;
    }

    var posIdDecoded = base642bin(strPosId);
    var matchIdDecoded = base642bin(strMatchId);

    if (!posIdDecoded) {
        return false;
    }
    if (!matchIdDecoded) {
        return false;
    }

    var p = 0;
    var h = 0;
    var f = 0;
    var e = 15;
    for (var m = 0; m <= 23; m++) {
        h = 0;
        while (posIdDecoded.charAt(p) == "1") {
            if (m < 12) {
                f = m
            } else {
                f = 35 - m
            }
            h++;
            e--;
            p++
        }
        p++;
        if (h > 0) {
			this.arrPoints[m] = h;
        }
    }
    h = 0;
    while (posIdDecoded.charAt(p) == "1") {
        h++;
        e--;
        p++
    }
    p++;
	this.arrBar[0] = h;
    if (e < 0) {
        return false;
    }
    e = 15;
    for (m = 23; m >= 0; m--) {
        h = 0;
        while (posIdDecoded.charAt(p) == "1") {
            if (m < 12) {
                f = m
            } else {
                f = 35 - m
            } 
            h++;
            e--;
            p++
        }
        p++;
        if (h > 0) {
			this.arrPoints[m] = -h;
        }
    }
    h = 0;
    while (posIdDecoded.charAt(p) == "1") {
        h++;
        e--;
        p++
    }
	this.arrBar[1] = h;
    if (e < 0) {
        return false;
    }
    this.intCubeVal = Math.pow(
			2, parseInt(bin2Dec(rev(matchIdDecoded.substring(0, 4))), 10));
    var o = matchIdDecoded.substring(4, 6);
    m = (o == "11") ? 0 : ((o == "00") ? 1 : 2);
    var b = matchIdDecoded.substring(6, 7);
    if (b === 0 && m == 1) {
        m = 2;
		this.intCubePos = m;
    } else {
        if (b === 0 && m == 2) {
            m = 1;
			this.intCubePos = m;
        } else {
			this.intCubePos = m;
        }
    }
    m = matchIdDecoded.substring(6, 7);
    if (m === 0) {
        m = 1;
		this.intOnRoll = m;
    } else {
		this.intOnRoll = m;
    }
    var n = bin2Dec(rev(matchIdDecoded.substring(15, 18)));
    var l = bin2Dec(rev(matchIdDecoded.substring(18, 21)));
    if (n > 0 && l > 0) {
        o = (n < l) ? l + "-" + n : n + "-" + l;
		this.intDice = BgBoard.DICE_OUTCOMES.indexOf(o);
    } else {
		this.intDice = 0;
		if (matchIdDecoded.substring(12, 13) == '1') {
			this.decisionStatus = BgBoard.TAKE_OR_DROP_DECISION;
		}
		else {
			this.decisionStatus = BgBoard.DOUBLE_OR_ROLL_DECISION;
		}
    }
	this.strDice = o;
    m = bin2Dec(rev(matchIdDecoded.substring(21, 36)));
	this.intMatchLgh = m;
    this.intScoreW = bin2Dec(rev(matchIdDecoded.substring(36, 51)));
    if (this.intScoreW > 24) {
        this.intScoreW = 0
    }
    this.intScoreB = bin2Dec(rev(matchIdDecoded.substring(51, 66)));
    if (this.intScoreB > 24) {
        this.intScoreB = 0
    }
    m = matchIdDecoded.substring(6, 7);
    this.booCrawford = matchIdDecoded.substring(7, 8);
    if (this.booCrawford == 1) {
        this.booCrawford = "true"
        this.isCrawford = true
    } else {
        this.booCrawford = "false"
        this.isCrawford = false
    } 
    var r = bin2Dec(rev(matchIdDecoded.substring(11, 12)));
    var q = bin2Dec(rev(matchIdDecoded.substring(6, 7)));
    if (r != q) {
        var d = bin2Dec(rev(matchIdDecoded.substring(0, 4)));
        d = (d + 1);
		this.intCubeVal = Math.pow(2, d);
        if (r == "0") {
			this.intCubePos = 4;
        } else {
            if (r == "1") {
				this.intCubePos = 3;
            }
        }
    }

	if (matchIdDecoded.substring(6, 7) == '0') {
		this.arrPoints.reverse();
		for (var i = 0; i < this.arrPoints.length; i++) {
			this.arrPoints[i] = -this.arrPoints[i];
		}
		this.arrBar.reverse();
	}

    return true;
}

BgBoard.prototype.pointiCheckeriToVerticalOffset = function(pointi, checkeri) {
	var checkeriModified = checkeri > BgBoard.POINT_CAPACITY - 1 
						    ? BgBoard.POINT_CAPACITY - 1 
						    : checkeri;
	var offset = this.NUMBERS_ROW_HEIGHT;
	var type;
	if (pointi > 11) {
		type = 'bottom';
	}
	else {
		type = 'top';
	}
	offset += checkeriModified * this.CHECK_SIDE_LENGTH;
	return [type, offset];
}


BgBoard.prototype.drawBoard = function () {

	var toAppend = [ ];
	var checkersOff = [15, 15];

	function appendImgForOverCheckers(this_, lastImg) {
		if (checkeri >= BgBoard.POINT_CAPACITY + 1) {
			var imgOverflow = new Image;
			imgOverflow.src = this_.options.filesRoot
							+ 'img' + '/number' + checkeri + '.png';
			imgOverflow.width = this_.CHECK_SIDE_LENGTH + '';
			imgOverflow.height = this_.CHECK_SIDE_LENGTH + '';
			imgOverflow.style.position = 'absolute';
			imgOverflow.style.width = this_.OVERFLOW_INDICATOR_SIZE + 'px';
			imgOverflow.style.height = this_.OVERFLOW_INDICATOR_SIZE + 'px';
			imgOverflow.style.left =
				parseInt(lastImg.style.left, 10)
				+ (this_.CHECK_SIDE_LENGTH - this_.OVERFLOW_INDICATOR_SIZE) / 2
				+ 'px';
			imgOverflow.style[vertOffset[0]] = 
				vertOffset[1]
				+ (this_.CHECK_SIDE_LENGTH - this_.OVERFLOW_INDICATOR_SIZE) / 2
				+ 'px';
			toAppend.push(imgOverflow);
		}
	}

	for (var pointi = 0; pointi < 24; pointi++) {

		var encodedCheckers, numOfCheckers;
		encodedCheckers = this.arrPoints[pointi];
		numOfCheckers = Math.abs(encodedCheckers);

		if (numOfCheckers != 0) {
			var checkeri;
			for (checkeri = 0; checkeri < numOfCheckers; checkeri++) {
				var img = new Image();
				var playeri = this.arrPoints[pointi] > 0
								? BgBoard.PLAYER0
								: BgBoard.PLAYER1;
				var vertOffset = 
					this.pointiCheckeriToVerticalOffset(pointi, checkeri);
				img.src = this.options.filesRoot 
							+ 'img' + BgBoard.CHECKER_IMAGE_URLS[playeri];
				img.width = this.CHECK_SIDE_LENGTH + '';
				img.height = this.CHECK_SIDE_LENGTH + '';
				img.style.position = 'absolute';
				img.style.left = this.pointiToLeftOffset(pointi) + 'px';
				img.style[vertOffset[0]] = vertOffset[1] + 'px';
				img.className = 'bgboard_checker';
				toAppend.push(img);
				checkersOff[playeri] -= 1;
			}
			appendImgForOverCheckers(this, img);
		}
	}

	for (playeri = 0; playeri < 2; playeri++) {
		var numOfCheckers = this.arrBar[playeri];
		var checkeri;
		for (checkeri = 0; checkeri < numOfCheckers; checkeri++) {
			var img = new Image();
			img.src = this.options.filesRoot 
						+ 'img' + BgBoard.CHECKER_IMAGE_URLS[playeri];
			img.width = this.CHECK_SIDE_LENGTH + '';
			img.height = this.CHECK_SIDE_LENGTH + '';
			var vertOffset = this.pointiCheckeriToVerticalOffset(
					playeri == BgBoard.PLAYER0 ? 0 : 23,
					checkeri
			);
			img.style.position = 'absolute';
			img.style.left = this.BAR_LEFT_OFFSET + 'px';
			img.style[vertOffset[0]] 
				= vertOffset[1] + this.BAR_VERT_OFFSET + 'px';
			toAppend.push(img);
			checkersOff[playeri] -= 1;
		}
		appendImgForOverCheckers(this, img);
	}

	for (playeri = 0; playeri < 2; playeri++) {
		var numOfCheckers = checkersOff[playeri];
		var checkeri;
		for (checkeri = 0; checkeri < numOfCheckers; checkeri++) {
			var img = new Image();
			img.src = this.options.filesRoot 
						+ 'img' + BgBoard.CHECKER_IMAGE_URLS[playeri];
			img.width = this.CHECK_SIDE_LENGTH + '';
			img.height = this.CHECK_SIDE_LENGTH + '';
			var vertOffset = this.pointiCheckeriToVerticalOffset(
					playeri == BgBoard.PLAYER0 ? 0 : 23,
					checkeri
			);
			img.style.position = 'absolute';
			img.style.left = this.BEAROFF_TRAY_LEFT_OFFSET + 'px';
			img.style[vertOffset[0]] = vertOffset[1] + 'px';
			toAppend.push(img);
		}
		appendImgForOverCheckers(this, img);
	}

	if (this.strDice != '11' && this.strDice != '10') {
		var arrDice = this.strDice.split('-');
		for (var i = 0; i < arrDice.length; i++) {
			arrDice[i] = parseInt(arrDice[i], 10);
			if (arrDice[i] >= 1 && arrDice[i] <= 6) {
				var img = new Image();
				img.src = this.options.filesRoot 
							+ 'img/die' + arrDice[i] + '.png';
				img.width = this.DIE_SIDE_LENGTH + '';
				img.height = this.DIE_SIDE_LENGTH + '';
				img.style.position = 'absolute';
				img.style.left = this.DICE_LEFT_OFFSETS[i] + 'px';
				img.style.top = this.DICE_TOP_OFFSET + 'px';
				toAppend.push(img);
			}
		}
	}

	if (!this.isCrawford) {
		var img_blank = new Image();
		img_blank.src = this.options.filesRoot + 'img/cube_blank.png';
		img_blank.width = this.CHECK_SIDE_LENGTH + '';
		img_blank.height = this.CHECK_SIDE_LENGTH + '';
		var img_number = new Image();

		var imgs = [img_blank, img_number];
		for (var i = 0; i < 2; i++) {

			var img = imgs[i];

			img.style.position = 'absolute';

			if (this.intCubePos == BgBoard.CENTERED_CUBE) {
				img.style.top = this.CENTERED_CUBE_TOP_OFFSET + 'px';
			}
			else if (this.intCubePos == BgBoard.TOP_PLAYER_HAS_CUBE) {
				img.style.top = this.NUMBERS_ROW_HEIGHT + 'px';
			}
			else if (this.intCubePos == BgBoard.BOTTOM_PLAYER_HAS_CUBE) {
				img.style.bottom = this.NUMBERS_ROW_HEIGHT + 'px';
			}
			else if (this.intCubePos == BgBoard.TOP_PLAYER_OFFERS_CUBE) {
				img.style.top = this.DICE_TOP_OFFSET + 'px';
			}
			else if (this.intCubePos == BgBoard.BOTTOM_PLAYER_OFFERS_CUBE) {
				img.style.top = this.DICE_TOP_OFFSET + 'px';
			}

			if (this.intCubePos == BgBoard.TOP_PLAYER_HAS_CUBE 
					|| this.intCubePos == BgBoard.BOTTOM_PLAYER_HAS_CUBE) {
				img.style.left = this.CUBE_LEFT_OFFSET + 'px';
			}
			else if (this.intCubePos == BgBoard.TOP_PLAYER_OFFERS_CUBE 
					|| this.intCubePos == BgBoard.BOTTOM_PLAYER_OFFERS_CUBE) {
				img.style.left = this.OFFERED_CUBE_LEFT_OFFSET + 'px';
			}
			else if (this.intCubePos == BgBoard.CENTERED_CUBE) {
				img.style.left = this.CENTERED_CUBE_LEFT_OFFSET + 'px';
			}

			for (var imgi = 0; imgi < img.length; imgi++) {
				toAppend.push(img[imgi]);
			}
		}

		if (this.intCubeVal != 1 
				&& (this.intCubePos == BgBoard.TOP_PLAYER_HAS_CUBE 
					|| this.intCubePos == BgBoard.BOTTOM_PLAYER_OFFERS_CUBE)) {
				img_number.style.transform =  'rotate(180deg)';
				img_number.src = this.options.filesRoot 
									+ 'img/' + 'number' 
									+ this.intCubeVal + '.png';
				img_number.width = this.CHECK_SIDE_LENGTH + '';
				img_number.height = this.CHECK_SIDE_LENGTH + '';
		}
		else if (this.intCubeVal == 1) {
				img_number.style.transform =  'rotate(270deg)';
				img_number.src = this.options.filesRoot + 'img/number64.png';
				img_number.width = this.CHECK_SIDE_LENGTH + '';
				img_number.height = this.CHECK_SIDE_LENGTH + '';
		}
		else {
			img_number.src = this.options.filesRoot 
									+ 'img/' + 'number' 
									+ this.intCubeVal + '.png';
			img_number.width = this.CHECK_SIDE_LENGTH + '';
			img_number.height = this.CHECK_SIDE_LENGTH + '';
		}

		toAppend.push(img_blank);
		toAppend.push(img_number);
	}

	for (var i = 0; i < toAppend.length; i++) {
		this.container.appendChild(toAppend[i]);
	}

	this.container.innerHTML += (
				'<div class="bgboard_position_info">' +
				'<table>' +
				'<tr>' +
				'</tr>' +
				'<tr>' +
				'</tr>' +
				'</table>' +
				'</div>'
	);

	var infoTable = this.container.querySelector(
					'.bgboard_position_info > table');

	var trs = infoTable.querySelectorAll('tr');

	for (var i = 0; i < trs.length; i++) {

		var tr = trs[i];

		var td1 = document.createElement('td');
		if (i == 0) {
			td1.textContent = 'Match length: ' + this.intMatchLgh;
		}
		else if (i == 1) {
			if (this.isCrawford) {
				td1.textContent = 'Crawford game';
				td1.style['font-weight'] = 'bolder';
			}
		}
		tr.appendChild(td1);

		var td2 = document.createElement('td');
		var checkerImg = document.createElement('img');
		checkerImg.src = this.options.filesRoot
							+ 'img' + BgBoard.CHECKER_IMAGE_URLS[i];
		td2.appendChild(checkerImg);
		tr.appendChild(td2);

		var td3 = document.createElement('td');
		if (i == 0) {
			var away = this.intMatchLgh - this.intScoreW;
			td3.textContent = this.intScoreW + ' pts (' + away + '-away)';
		}
		else if (i == 1) {
			var away = this.intMatchLgh - this.intScoreB;
			td3.textContent = this.intScoreB + ' pts (' + away + '-away)';
		}
		tr.appendChild(td3);

		var pips0 = this.pipCount0();
		var pips1 = this.pipCount1();
		var pipsDiff = pips0 - pips1;

		var td4 = document.createElement('td');
		if (i == 0) {
			var sign = pipsDiff >= 0 ? '+' : '-';
			td4.textContent = (
				'pips: ' + pips0 + ' (' + sign + ' ' 
								+ Math.abs(pipsDiff) + ')'
			);
		}
		else if (i == 1) {
			var sign = pipsDiff < 0 ? '+' : '-';
			td4.textContent = (
				'pips: ' + pips1 + ' (' + sign + ' ' 
								+ Math.abs(pipsDiff) + ')'
			);
		}
		tr.appendChild(td4);
	}

}

BgBoard.prototype.drawErrorNote = function () {
    var errorDiv = document.createElement('div');
    errorDiv.className = 'bgboard_error';
    var errorText = document.createTextNode(
        'bgboard: Invalid Position or Match ID');
    errorDiv.appendChild(errorText);
    this.container.appendChild(errorDiv);
}

BgBoard.prototype.pointiToLeftOffset = function(pointi) {
	var leftOffsetInWidths = 2; // 2 for the left bearoff tray
	if (pointi <= 11) {
		leftOffsetInWidths += 11 - pointi;
		if (pointi <= 5) {
			leftOffsetInWidths += 2; // 2 for the bar
		}
	}
	else {
		leftOffsetInWidths += pointi - 12;
		if (pointi >= 18) {
			leftOffsetInWidths += 2; // 2 for the bar
		}
	}

	return leftOffsetInWidths * this.CHECK_SIDE_LENGTH;
}

BgBoard.prototype.pipCount0 = function() {
    var a = 0;
    for (i = 0; i < 24; i++) {
        if (this.arrPoints[i] > 0) {
            a += (i + 1) * this.arrPoints[i]
        }
    }
    a += 25 * this.arrBar[0];
    return a
}

BgBoard.prototype.pipCount1 = function() {
    var a = 0;
    for (i = 0; i < 24; i++) {
        if (this.arrPoints[i] < 0) {
            a += (24 - i) * Math.abs(this.arrPoints[i])
        }
    }
    a += 25 * this.arrBar[1];
    return a
}

BgBoard.DICE_OUTCOMES = [
	'1-1', '2-1', '2-2', '3-1', '3-2', '3-3',
	'4-1', '4-2', '4-3', '4-4', '5-1', '5-2',
	'5-3', '5-4', '5-5', '6-1', '6-2', '6-3',
	'6-4', '6-5', '6-6'
];

BgBoard.PLAYER0 = 0;
BgBoard.PLAYER1 = 1;

BgBoard.TOP_PLAYER_HAS_CUBE = 1;
BgBoard.BOTTOM_PLAYER_HAS_CUBE = 2;
BgBoard.CENTERED_CUBE = 0;
BgBoard.TOP_PLAYER_OFFERS_CUBE = 3;
BgBoard.BOTTOM_PLAYER_OFFERS_CUBE = 4;

BgBoard.BASE_CONTAINER_WIDTH = 432;
BgBoard.BASE_CONTAINER_HEIGHT = 328;

BgBoard.BASE_CHECK_SIDE_LENGTH = 24;
BgBoard.BASE_DIE_SIDE_LENGTH = 28;
BgBoard.BASE_DICE_MARGIN = 10;
BgBoard.BASE_OVERFLOW_INDICATOR_SIZE = 18;

BgBoard.POINT_CAPACITY = 5;

BgBoard.CHECKER_IMAGE_URLS = 
	['/checkers/red_checker.png', '/checkers/white_checker.png'];

BgBoard.DOUBLE_OR_ROLL_DECISION = 'DOUBLE_OR_ROLL_DECISION';
BgBoard.TAKE_OR_DROP_DECISION = 'TAKE_OR_DROP_DECISION';

return BgBoard;

})();

