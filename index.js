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
    { 'pin': 0x01, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 0 },
    { 'pin': 0x02, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x04, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x08, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x10, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x20, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x40, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x80, 'side': OLATB, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x01, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x02, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x04, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x08, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x10, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x20, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x40, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 },
    { 'pin': 0x80, 'side': OLATA, 'mcp': MCP_ONE_ADDR, 'delay': 1000 }
];

const i2c1 = i2c.openSync(1);

function setRelay(firing_info, cb) {
    setTimeout(function () {
        console.log('Setting relay value: ' + firing_info.pin);
        i2c1.writeWordSync(firing_info.mcp, firing_info.side, firing_info.pin);
        cb();
    }, firing_info.delay + FIRING_DELAY_MS);
}

function setIOMode(mcp_addr, delay) {
    setTimeout(function () {
        i2c1.writeWordSync(mcp_addr, IO_DIR_A, 0x00);
        i2c1.writeWordSync(mcp_addr, IO_DIR_B, 0x00);
    }, delay);
}

function setAllPinsOff(mcp_addr, delay) {
    setTimeout(function () {
        i2c1.writeWordSync(mcp_addr, OLATA, 0x00);
        i2c1.writeWordSync(mcp_addr, OLATB, 0x00);
    }, delay);
}

setIOMode(MCP_ONE_ADDR, 0);
setAllPinsOff(MCP_ONE_ADDR, FIRING_DELAY_MS);

vasync.forEachPipeline({
    'func': setRelay,
    'inputs': firing_order 
}, function (err, results) {
    if (err) {
        console.log('error: %s', err.message);
    }

    setAllPinsOff(MCP_ONE_ADDR, FIRING_DELAY_MS);
});

i2c1.closeSync();
