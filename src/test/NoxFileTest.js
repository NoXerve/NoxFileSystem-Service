/**
 * @file NoxFile tester file. [NoxFileTest.js]
 * @author idoleat <dppss92132@gmail.com>
 * @copyright 2019-2020 nooxy. All Rights Reserved.
 * @description Start testing by enter command "node NoxFileTest.js".
 */

'use strict';

const fs = require('fs');

/// only for prototpype test
let NoXerveAgent = new(require('../../../NoXerve/src/noxerve_agent/nodejs/index'))({
  secured_node: true,
  rsa_2048_key_pair: {
    public: fs.readFileSync('./public.pem', 'utf8'),
    private: fs.readFileSync('./private.pem', 'utf8'),
  }
});
///

let worker1 = new(require('../nodejs/index'))(NoXerveAgent, {});
worker1.start();
