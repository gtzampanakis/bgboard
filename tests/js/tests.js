function inner(gnuid, assert) {
	assert.notOk(document.querySelector('#qunit-fixture > img'));

	var bgboard = new BgBoard({
		filesRoot : '/',
		containerSelector : '#qunit-fixture',
		gnuid : gnuid
	});

	var foundNonzero = false;
	for (var i = 0; i < bgboard.arrPoints.length; i++) {
		if (bgboard.arrPoints[i] != 0) {
			foundNonzero = true;
			break;
		}
	}

	assert.ok(foundNonzero);

	bgboard.drawBoard();

	var c = document.querySelector('#qunit-fixture');

	assert.ok(c.querySelector('img.bgboard_empty_board'));
	assert.ok(c.querySelector('img.bgboard_checker'));
	assert.ok(c.querySelector('.gnubg_position_info img'));
}

QUnit.test('gnuid 1', function(a) {inner('AwAAGAAAAAAAAA:ARmgACAAEAAE', a)})
QUnit.test('gnuid 2', function(a) {inner('IIUHgR74HHwADA:UgmzAAAAAAAA', a)})
QUnit.test('gnuid 3', function(a) {inner('IIUHgR74HHwADA:cAmzAAAAAAAA', a)})
QUnit.test('gnuid 4', function(a) {inner('IIUHgR74HHwADA:cQmzAAAAAAAA', a)})
QUnit.test('gnuid 5', function(a) {inner('AMAAmLkFSEgBAA:UQmyAAAAAAAE', a)})
QUnit.test('gnuid 6', function(a) {inner('vm8AAADbHCAOBg:UQmlAAAAAAAE', a)})
QUnit.test('gnuid 7', function(a) {inner('/HcAAIDZFQTBBg:cImyADAACAAE', a)})
QUnit.test('gnuid 8', function(a) {inner('ZrsNADBsOxsAMA:cImpAAAAAAAE', a)})
QUnit.test('gnuid 9', function(a) {inner('2L6BAShsm8IAWA:cImuAAAAAAAE', a)})
QUnit.test('gnuid 10', function(a) {inner('v58AABSxrSUDAg:QQmvADAAAAAE', a)})
QUnit.test('gnuid 11', function(a) {inner('z10HACDatglkAA:8ImkABAAIAAE', a)})
QUnit.test('gnuid 12', function(a) {inner('2Ns2ABC03Q0ADA:cAmzABAAEAAE', a)})
QUnit.test('gnuid 13', function(a) {inner('st7AARSwt4kBDA:cAm3AAAAAAAE', a)})
QUnit.test('gnuid 14', function(a) {inner('+24CBgDbbgOIAA:cImkAAAAAAAE', a)})
QUnit.test('gnuid 15', function(a) {inner('/w0AAA/mdisAAg:QQmyABAAAAAE', a)})
QUnit.test('gnuid 16', function(a) {inner('i20bwAC2zGYABg:cAmvAAAAAAAE', a)})
QUnit.test('gnuid 17', function(a) {inner('/wAAIGCuSCpGAA:UQmpABAAAAAE', a)})
QUnit.test('gnuid 18', function(a) {inner('vs4DAhCY28HBAA:cAmuAAAAEAAE', a)})
QUnit.test('gnuid 19', function(a) {inner('szlBgCyczcGAQQ:cAmgAAAACAAE', a)})
