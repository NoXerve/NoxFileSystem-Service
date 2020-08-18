/**
 * @file NoxFile Service initializer file. [initializer.js]
 * @author nooxy <thenooxy@gmail.com>
 * @author idoleat <dppss92132@gmail.com>
 * @copyright 2019-2020 nooxy. All Rights Reserved.
 * @description Initialize NoxFile.
 */

'use strict';

const Crypto = require('crypto');
const FS = require('fs');
const Constants = require('./constants.json');

module.exports.isMyWorkerFilesInitailized = function() {
  return FS.existsSync(Constants.noxfile_my_worker_initailized_locker_path);
}

module.exports.initailizeMyWorkerFiles = function(noxerve_agent, preloader_parameters, callback) {
  const worker_peers_settings_initialize = (next) => {
    if ( !module.exports.isMyWorkerFilesInitailized()) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        // terminal: false
      });

      console.log('Has not set up worker peer settings.');
      rl.question('Do you want to:\n 1. Setup as the first worker.\n 2. Join other worker peers? \nInput a number: \n', (answer) => {
        rl.close();
        if (answer === '1') {
          FS.writeFileSync(Constants.noxfile_static_global_random_seed_4096bytes_path, Crypto.randomBytes(4096));
          console.log('Created static global random seed file at "' + Constants.noxfile_static_global_random_seed_4096bytes_path + '".');

          FS.writeFileSync(Constants.noxfile_my_worker_settings_path, JSON.stringify({
            worker_id: 1,
            interfaces: preloader_parameters.settings.interfaces,
            interfaces_connect_settings: preloader_parameters.settings.interfaces_connect_settings,
          }, null, 2));
          console.log('Created my worker settings file at "' + Constants.noxfile_my_worker_settings_path + '".');

          FS.writeFileSync(Constants.noxfile_worker_peers_settings_path, JSON.stringify({
            1: {
              interfaces_connect_settings: preloader_parameters.settings.interfaces_connect_settings,
              detail: {
                name: 'The first noxfile service worker.'
              }
            }
          }, null, 2));
          console.log('Created worker peers settings file at "' + Constants.noxfile_worker_peers_settings_path + '".');
          next(false);
        } else if (answer === '2') {

        }
      });
    } else {
      next(false);
    }
  };

  worker_peers_settings_initialize((error) => {
    if (error) callback(error);
    else {
      FS.writeFileSync(Constants.noxfile_my_worker_initailized_locker_path, '');
      callback(false);
    }
  });
}

module.exports.initailizeNoXerveAgentWorker = function(noxerve_agent, preloader_parameters, callback) {
  noxerve_agent.Worker.on('worker-peer-authentication', (worker_id, worker_authenticity_information, is_valid) => {
    // if(worker_id === 0) {
    //   // [Flag]
    //   is_valid(false);
    // }
    // else {
    //
    // }

    if (worker_authenticity_information.worker_authentication_token === preloader_parameters.settings.worker_authentication_token) {
      is_valid(true);
    } else {
      is_valid(false);
    }
  });
  noxerve_agent.Worker.on('worker-peer-join', (new_worker_peer_id, new_worker_peer_interfaces_connect_settings, new_worker_peer_detail, next) => {
    console.log('Worker peer joined.', new_worker_peer_id, new_worker_peer_interfaces_connect_settings, new_worker_peer_detail);
    FS.readFile(Constants.noxservicesystem_worker_peers_settings_path, (error, worker_peers_settings_string) => {
      if (error) next(error, () => {});
      else {
        let worker_peers_settings = JSON.parse(worker_peers_settings_string);
        worker_peers_settings[new_worker_peer_id] = {
          interfaces_connect_settings: new_worker_peer_interfaces_connect_settings,
          detail: new_worker_peer_detail
        };
        FS.writeFile(Constants.noxservicesystem_worker_peers_settings_path, JSON.stringify(worker_peers_settings, null, 2), () => {
          if (error) next(error, () => {});
          else {
            const on_cancel = (next_of_cancel) => {
              console.log('Worker peer with worker id ' + new_worker_peer_id + ' joining canceled.');
              next_of_cancel(false);
            };
            next(false, on_cancel);
          }
        });
      }
    });
  });

  noxerve_agent.Worker.on('worker-peer-update', (remote_worker_peer_id, remote_worker_peer_interfaces_connect_settings, remote_worker_peer_detail, next) => {
    console.log('Worker peer updated.', remote_worker_peer_id, remote_worker_peer_interfaces_connect_settings, remote_worker_peer_detail);
    FS.readFile(Constants.noxservicesystem_worker_peers_settings_path, (error, worker_peers_settings_string) => {
      if (error) next(error, () => {});
      else {
        let worker_peers_settings = JSON.parse(worker_peers_settings_string);
        worker_peers_settings[remote_worker_peer_id] = {
          interfaces_connect_settings: remote_worker_peer_interfaces_connect_settings,
          detail: remote_worker_peer_detail
        };
        FS.writeFile(Constants.noxservicesystem_worker_peers_settings_path, JSON.stringify(worker_peers_settings, null, 2), () => {
          if (error) next(error, () => {});
          else {
            const on_cancel = (next_of_cancel) => {
              console.log('Worker peer with worker id ' + remote_worker_peer_id + ' updating canceled.');
              next_of_cancel(false);
            };
            next(false, on_cancel);
          }
        });
      }
    });
  });

  noxerve_agent.Worker.on('worker-peer-leave', (remote_worker_peer_id, next) => {
    console.log('Worker peer leaved.', remote_worker_peer_id);
    FS.readFile(Constants.noxservicesystem_worker_peers_settings_path, (error, worker_peers_settings_string) => {
      if (error) next(error, () => {});
      else {
        let worker_peers_settings = JSON.parse(worker_peers_settings_string);
        delete worker_peers_settings[remote_worker_peer_id];
        FS.writeFile(Constants.noxservicesystem_worker_peers_settings_path, JSON.stringify(worker_peers_settings, null, 2), () => {
          if (error) next(error, () => {});
          else {
            const on_cancel = (next_of_cancel) => {
              console.log('Worker peer with worker id ' + remote_worker_peer_id + ' leaving canceled.');
              next_of_cancel(false);
            };
            next(false, on_cancel);
          }
        });
      }
    });
  });
  // temporary skip GlobalRamdonSeed part
}
