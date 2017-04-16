function t(gnuid, should_succeed, assert) {
	assert.notOk(document.querySelector('#qunit-fixture > img'));

	var bgboard = new BgBoard({
		filesRoot : '/',
		containerSelector : '#qunit-fixture',
		gnuid : gnuid
	});

    if (should_succeed) {
        var foundNonzero = false;
        for (var i = 0; i < bgboard.arrPoints.length; i++) {
            if (bgboard.arrPoints[i] != 0) {
                foundNonzero = true;
                break;
            }
        }

        assert.ok(foundNonzero);
    }

	var c = document.querySelector('#qunit-fixture');

	assert.ok(c.querySelector('img.bgboard_empty_board'));

    if (should_succeed) {
        assert.ok(c.querySelector('img.bgboard_checker'));
        assert.ok(c.querySelector('.bgboard_position_info img'));
    } else {
        assert.ok(c.querySelector('div.bgboard_error'));
    }
}

/* Some arbitrary gnuids adding up to good code coverage. */
QUnit.test('s id 1', function(a) {t('AwAAGAAAAAAAAA:ARmgACAAEAAE', true, a)})
QUnit.test('s id 2', function(a) {t('IIUHgR74HHwADA:UgmzAAAAAAAA', true, a)})
QUnit.test('s id 3', function(a) {t('IIUHgR74HHwADA:cAmzAAAAAAAA', true, a)})
QUnit.test('s id 4', function(a) {t('IIUHgR74HHwADA:cQmzAAAAAAAA', true, a)})
QUnit.test('s id 5', function(a) {t('AMAAmLkFSEgBAA:UQmyAAAAAAAE', true, a)})
QUnit.test('s id 6', function(a) {t('vm8AAADbHCAOBg:UQmlAAAAAAAE', true, a)})
QUnit.test('s id 7', function(a) {t('/HcAAIDZFQTBBg:cImyADAACAAE', true, a)})
QUnit.test('s id 8', function(a) {t('ZrsNADBsOxsAMA:cImpAAAAAAAE', true, a)})
QUnit.test('s id 9', function(a) {t('2L6BAShsm8IAWA:cImuAAAAAAAE', true, a)})
QUnit.test('s id 10', function(a) {t('v58AABSxrSUDAg:QQmvADAAAAAE', true, a)})
QUnit.test('s id 11', function(a) {t('z10HACDatglkAA:8ImkABAAIAAE', true, a)})
QUnit.test('s id 12', function(a) {t('2Ns2ABC03Q0ADA:cAmzABAAEAAE', true, a)})
QUnit.test('s id 13', function(a) {t('st7AARSwt4kBDA:cAm3AAAAAAAE', true, a)})
QUnit.test('s id 14', function(a) {t('+24CBgDbbgOIAA:cImkAAAAAAAE', true, a)})
QUnit.test('s id 15', function(a) {t('/w0AAA/mdisAAg:QQmyABAAAAAE', true, a)})
QUnit.test('s id 16', function(a) {t('i20bwAC2zGYABg:cAmvAAAAAAAE', true, a)})
QUnit.test('s id 17', function(a) {t('/wAAIGCuSCpGAA:UQmpABAAAAAE', true, a)})
QUnit.test('s id 18', function(a) {t('vs4DAhCY28HBAA:cAmuAAAAEAAE', true, a)})
QUnit.test('s id 19', function(a) {t('szlBgCyczcGAQQ:cAmgAAAACAAE', true, a)})

/* Empty gnuid. */
QUnit.test('f id 1', function(a) {t('', false, a)})

/* Position ID shorter than normal. */
QUnit.test('f id 2', function(a) {t('szlBgCyczcGAQ:cAmgAAAACAAE', false, a)})

/* Match ID shorter than normal. */
QUnit.test('f id 3', function(a) {t('szlBgCyczcGAQQ:cAmgAAAACAA', false, a)})

/* Position ID contains invalid character ($). */
QUnit.test('f id 4', function(a) {t('szlBgCyczcGAQ$:cAmgAAAACAAE', false, a)})

/* Match ID contains invalid character ($). */
QUnit.test('f id 5', function(a) {t('szlBgCyczcGAQQ:cAmgAAAACAA$', false, a)})
