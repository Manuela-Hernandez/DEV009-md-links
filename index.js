#!/usr/bin/env node
const mdLinks = require('./mdlinks.js');
const { stats } = require('./data.js');

const path = process.argv[2];
const validate = process.argv.includes('--validate');
const statsLinks = process.argv.includes('--stats');


mdLinks(path, validate)
    .then((links) => {
        if(statsLinks){
            console.log('stats en index: ', stats(links, validate));
        }else {
            console.log("index: ", links);
        }

    })
    .catch((error) => {
        console.log(error);
    });
