const i2c = require('i2c-bus');
const vasync = require('vasync');

const MCP_ONE_ADDR = 0x20;
const MCP_TWO_ADDR = 0x22;
const IO_DIR_A = 0x00;
const IO_DIR_B = 0x01;
const OLATA = 0x14;
const OLATB = 0x15;

const FIRING_DELAY_MS = 10;

const firing_order = [
    { 'pin': 0xfe, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfd, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfb, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xf7, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xef, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xdf, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xbf, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x7f, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfe, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfd, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfb, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xf7, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xef, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xdf, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xbf, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x7f, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0xfe, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xfd, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xfb, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xf7, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xef, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xdf, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xbf, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0x7f, 'side': OLATB, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xfe, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xfd, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xfb, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xf7, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xef, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xdf, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xbf, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0x7f, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 },
    { 'pin': 0xff, 'side': OLATA, 'mcp': MCP_TWO_ADDR, 'delay': 1000 }
];

const i2c1 = i2c.openSync(1);

function setRelay(firing_info, cb) {
    vasync.pipeline({
        'funcs': [
            function fire(_, callback) {
                console.log('Setting relay value: ' + firing_info.pin);
                i2c1.writeByteSync(firing_info.mcp, firing_info.side, firing_info.pin);
                callback();
            },
            function reset(_, callback) {
                setTimeout(function () {
                    console.log('Unsetting relay!');
                    i2c1.writeByteSync(firing_info.mcp, firing_info.side, 0xff);
                    callback();
                }, firing_info.delay + FIRING_DELAY_MS);
            }
        ]
    }, function (err, results) {
            if (err) {
                console.log('err: %s', err);
            } else {
                cb();
            }
            return;
    });
}

function setIOMode(delay) {
    setTimeout(function () {
        i2c1.writeByteSync(MCP_ONE_ADDR, IO_DIR_A, 0x00);
        i2c1.writeByteSync(MCP_ONE_ADDR, IO_DIR_B, 0x00);
        i2c1.writeByteSync(MCP_TWO_ADDR, IO_DIR_A, 0x00);
        i2c1.writeByteSync(MCP_TWO_ADDR, IO_DIR_B, 0x00);
    }, delay);
}

function setAllPinsOff(delay) {
    setTimeout(function () {
        i2c1.writeByteSync(MCP_ONE_ADDR, OLATA, 0xff);
        i2c1.writeByteSync(MCP_ONE_ADDR, OLATB, 0xff);
        i2c1.writeByteSync(MCP_TWO_ADDR, OLATA, 0xff);
        i2c1.writeByteSync(MCP_TWO_ADDR, OLATB, 0xff);
    }, delay);
}

setIOMode(0);
setAllPinsOff(FIRING_DELAY_MS);

vasync.forEachPipeline({
    'func': setRelay,
    'inputs': firing_order
}, function (err, results) {
    if (err) {
        console.log('error: %s', err.message);
    }

    setAllPinsOff(FIRING_DELAY_MS);
});

i2c1.closeSync();
