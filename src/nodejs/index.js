/**
 * @file NoxFile Service index file. [index.js]
 * @author idoleat <dppss92132@gmail.com>
 * @copyright 2019-2020 nooxy. All Rights Reserved.
 */

'use strict';

/**
 * @module NoxFile
 */

const Initializer = require('./initializer');
const Manifest = require('./manifest.json');

function NoxFile(noxerve_agent, preloader_parameters){
     this._noxerve_agent = noxerve_agent;
     this._preloader_parameters = preloader_parameters;
     this._deploy = function() {};
}

NoxFile.prototype.start = function(finish_start) {
    console.log(Manifest.service_display_name + ' service(version ' + Manifest.service_version + ') worker started.');
    console.log(Manifest.service_description);

    const if_error_close_preloader = (error, next) => {
        if(error) {
            finish_start(1);
            console.log(error);
            setTimeout(() => {this._preloader_parameters.closePreloader()}, 100);
        }
        else {/*
            this._noxerve_agent.Service.onActivityCreate('default', (parameter, service_of_activity)=> {
                // service_of_activity.define('');
            });*/
            next();
        }
    };

    // Initialize.
    const initailize_noxerve_agent_worker = () => {
      Initializer.initailizeNoXerveAgentWorker(this._noxerve_agent, this._preloader_parameters, (error) => {
        if_error_close_preloader(error, ()=> {
          finish_start(1);
        });
      });
    };

    if(Initializer.isMyWorkerFilesInitailized()) {
        this._noxerve_agent.start((error) => {
            if_error_close_preloader(error, ()=> {
                initailize_noxerve_agent_worker();
            });
        });
    }

    else {
        console.log('NoxFile Service files not initailized. Initializing...');
        Initializer.initailizeMyWorkerFiles(this._noxerve_agent, this._preloader_parameters, (error) => {
            if_error_close_preloader(error, ()=> {
                console.log('NoxFile Service files Initialized.');
                this._noxerve_agent.start((error) => {
                    if_error_close_preloader(error, ()=> {
                        initailize_noxerve_agent_worker();
                    });
                });
            });
        });
    }
}

NoxFile.prototype.close = function() {

}

// version
NoxFile.prototype.version = function() {

}

// cd
NoxFile.prototype.cd = function() {

}

// ls
NoxFile.prototype.ls = function() {

}

// Write data to a file
NoxFile.prototype.write = function() {

}

// Read data to a file
NoxFile.prototype.read = function() {

}

// current working directory
NoxFile.prototype.cwd = function() {

}

// make directory
NoxFile.prototype.mkdir = function() {

}

// remove directory
NoxFile.prototype.rmdir = function() {

}

// remove file
NoxFile.prototype.rm = function() {

}

// copy file
NoxFile.prototype.cp = function() {

}

// get the status of the service
NoxFile.prototype.status = function() {

}

/*
NoxFile._deploy.prototype.exec_command() = function(command) {

}*/

module.exports = NoxFile;
