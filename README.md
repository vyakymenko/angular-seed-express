# Introduction

[![Greenkeeper badge](https://badges.greenkeeper.io/vyakymenko/angular-seed-express.svg)](https://greenkeeper.io/)

[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/lh1m985431jm79o3?svg=true)](https://ci.appveyor.com/project/vyakymenko/angular-seed-express)
[![Build Status](https://travis-ci.org/vyakymenko/angular-seed-express.svg?branch=master)](https://travis-ci.org/vyakymenko/angular-seed-express)
[![Dependency Status](https://david-dm.org/vyakymenko/angular-seed-express.svg)](https://david-dm.org/vyakymenko/angular-seed-express)
[![devDependency Status](https://david-dm.org/vyakymenko/angular-seed-express/dev-status.svg)](https://david-dm.org/vyakymenko/angular-seed-express#info=devDependencies)

**Want to feel like a full-stack Angular developer but know only Express?**

This is an express seed project for Angular apps based on [Minko Gechev's](https://github.com/mgechev) [angular-seed](https://github.com/mgechev/angular-seed).
Include:
 
- Full include from [Minko Gechev's](https://github.com/mgechev) [angular-seed](https://github.com/mgechev/angular-seed).
- [Express](https://expressjs.com/) Express Node.js server for production/development build API.
- [PM2](http://pm2.keymetrics.io/) daemon for a server running.
- [Nginx](https://github.com/vyakymenko/angular-nginx-config-example/blob/master/ng2-application.conf) configuration file for your server.

# Fast start

For Angular development information and wiki, look here:
 - [Angular-Seed](https://github.com/mgechev/angular-seed)
 - [Angular-Seed-WIKI](https://github.com/mgechev/angular-seed/wiki) Wiki Information about Seed!
 - [Angular-Seed-Advanced](https://github.com/NathanWalker/angular-seed-advanced) It's a [Nathan's Walker](https://github.com/NathanWalker) child seed for multi-platform Angular apps.

```bash
git clone --depth 1 https://github.com/vyakymenko/angular-seed-express.git
cd angular-seed-express
# install the project dependencies
$ npm install
# watches your files and uses livereload by default
$ npm start
# api document for the app
# $ npm run compodoc

# dev build
$ npm run build.dev
# prod build
$ npm run build.prod


# run Redis
$ src/redis-server
# stop Redis
$ src/redis-cli
$ shutdown SAVE


# run Express server (keep in touch, only after `npm run build.prod` )
$ node app.server.prod.js

# run server in daemon mode
$ pm2 start app.server.prod.js
```

# Express Server

Express server run for prod build.

```sh
# run Express server (keep in touch, only after `npm run build.prod` )
# keep in mind that prod build will be builded with prod env flag
$ node app.server.prod.js
```

# Daemonize Server

For daemonize your server I propose to uze `PM2`.
```sh
# before daemonize production server `npm run build.prod`
$ pm2 start app.server.prod.js

# restart only your project
$ pm restart <id>
# restart all project on daemon
$ pm2 restart all

# in cluster mode ( example 4 workers )
$ pm2 start app.server.prod.js -i 4
```

More details about [PM2](http://pm2.keymetrics.io/)

# How to configure my NginX

```
##
# Your Angular.io NginX .conf
##

http {
  log_format gzip '[$time_local] ' '"$request" $status $bytes_sent';
  access_log /dev/stdout;
  charset utf-8;

  default_type application/octet-stream;

  types {
    text/html               html;
    text/javascript         js;
    text/css                css;
    image/png               png;
    image/jpg               jpg;
    image/svg+xml           svg svgz;
    application/octet-steam eot;
    application/octet-steam ttf;
    application/octet-steam woff;
  }


  server {
    listen            3353;
    server_name       local.example.com;

    root app/;
    add_header "X-UA-Compatible" "IE=Edge,chrome=1";

    location ~ ^/(scripts|styles)/(.*)$ {
      root .tmp/;
      error_page 404 =200 @asset_pass;
      try_files $uri =404;
      break;
    }

    location @asset_pass {
      root app/;
      try_files $uri =404;
    }

    location / {
      expires -1;
      add_header Pragma "no-cache";
      add_header Cache-Control "no-store, no-cache, must-revalicate, post-check=0 pre-check=0";
      root app/;
      try_files $uri $uri/ /index.html =404;
      break;
    }
  }

  server {
    listen 3354;

    sendfile on;

    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_http_version 1.1;
    gzip_disable      "MSIE [1-6]\.";
    gzip_min_length   1100;
    gzip_vary         on;
    gzip_proxied      expired no-cache no-store private auth;
    gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level   9;


    root dist/;

    location ~ ^/(assets|bower_components|scripts|styles|views) {
      expires     31d;
      add_header  Cache-Control public;
    }

    ##
    # Main file index.html
    ##
    location / {
      try_files $uri $uri/ /index.html =404;
    }
  }
}
```

You can look in source file [here](https://github.com/vyakymenko/angular-nginx-config-example/blob/master/ng2-application.conf).



# Express Configuration

`app.server.dev.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Dev mode will give you only middleware.
// WARNING! DEPEND ON YOUR Angular SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Development`.
 */
require('./server')(9001, 'dev');
```

`app.server.prod.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Prod mode give you middleware + static.
// WARNING! DEPEND ON YOUR Angular SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Production`.
 */
require('./server')(9000);
```

# Reverse Proxy NginX Config Example
```
server {
    listen 80;

    # App Web Adress Listener
    server_name www.example.com example.com;

    location / {
        # Port where we have our daemon `pm2 start app.server.js`
        proxy_pass http://example.com:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# Redis Download/Install

 - About [Redis](http://redis.io/).
 - [Download](http://redis.io/download#download) and [install](http://redis.io/download#installation) latest stable version of Redis.
 - [Documentation](http://redis.io/documentation) about Redis.

# Redis Start

After installation we need to start our server:
```sh
# start server
$ src/redis-server
```

# Redis More Settings + Daemonize

 - Redis [Persistence](http://redis.io/topics/quickstart#redis-persistence)
 - Redis [More Properties](http://redis.io/topics/quickstart#installing-redis-more-properly)

# MongoDB

 - In progress

# MySQL

 - In progress

# Contributors

[<img alt="mgechev" src="https://avatars1.githubusercontent.com/u/455023?v=4&s=117" width="117">](https://github.com/mgechev) |[<img alt="ludohenin" src="https://avatars0.githubusercontent.com/u/1011516?v=4&s=117" width="117">](https://github.com/ludohenin) |[<img alt="d3viant0ne" src="https://avatars1.githubusercontent.com/u/8420490?v=4&s=117" width="117">](https://github.com/d3viant0ne) |[<img alt="Shyam-Chen" src="https://avatars1.githubusercontent.com/u/13535256?v=4&s=117" width="117">](https://github.com/Shyam-Chen) |[<img alt="NathanWalker" src="https://avatars2.githubusercontent.com/u/457187?v=4&s=117" width="117">](https://github.com/NathanWalker) |[<img alt="Nightapes" src="https://avatars1.githubusercontent.com/u/15911153?v=4&s=117" width="117">](https://github.com/Nightapes) |
:---: |:---: |:---: |:---: |:---: |:---: |
[mgechev](https://github.com/mgechev) |[ludohenin](https://github.com/ludohenin) |[d3viant0ne](https://github.com/d3viant0ne) |[Shyam-Chen](https://github.com/Shyam-Chen) |[NathanWalker](https://github.com/NathanWalker) |[Nightapes](https://github.com/Nightapes) |

[<img alt="tarlepp" src="https://avatars2.githubusercontent.com/u/595561?v=4&s=117" width="117">](https://github.com/tarlepp) |[<img alt="karlhaas" src="https://avatars2.githubusercontent.com/u/7677394?v=4&s=117" width="117">](https://github.com/karlhaas) |[<img alt="TheDonDope" src="https://avatars2.githubusercontent.com/u/1188033?v=4&s=117" width="117">](https://github.com/TheDonDope) |[<img alt="robstoll" src="https://avatars1.githubusercontent.com/u/5557885?v=4&s=117" width="117">](https://github.com/robstoll) |[<img alt="nareshbhatia" src="https://avatars1.githubusercontent.com/u/1220198?v=4&s=117" width="117">](https://github.com/nareshbhatia) |[<img alt="hank-ehly" src="https://avatars3.githubusercontent.com/u/11639738?v=4&s=117" width="117">](https://github.com/hank-ehly) |
:---: |:---: |:---: |:---: |:---: |:---: |
[tarlepp](https://github.com/tarlepp) |[karlhaas](https://github.com/karlhaas) |[TheDonDope](https://github.com/TheDonDope) |[robstoll](https://github.com/robstoll) |[nareshbhatia](https://github.com/nareshbhatia) |[hank-ehly](https://github.com/hank-ehly) |

[<img alt="kiuka" src="https://avatars1.githubusercontent.com/u/11283191?v=4&s=117" width="117">](https://github.com/kiuka) |[<img alt="fr-esco" src="https://avatars1.githubusercontent.com/u/4931297?v=4&s=117" width="117">](https://github.com/fr-esco) |[<img alt="vyakymenko" src="https://avatars1.githubusercontent.com/u/7300673?v=4&s=117" width="117">](https://github.com/vyakymenko) |[<img alt="jesperronn" src="https://avatars2.githubusercontent.com/u/6267?v=4&s=117" width="117">](https://github.com/jesperronn) |[<img alt="daniru" src="https://avatars3.githubusercontent.com/u/2070853?v=4&s=117" width="117">](https://github.com/daniru) |[<img alt="patrickmichalina" src="https://avatars3.githubusercontent.com/u/6701211?v=4&s=117" width="117">](https://github.com/patrickmichalina) |
:---: |:---: |:---: |:---: |:---: |:---: |
[kiuka](https://github.com/kiuka) |[fr-esco](https://github.com/fr-esco) |[vyakymenko](https://github.com/vyakymenko) |[jesperronn](https://github.com/jesperronn) |[daniru](https://github.com/daniru) |[patrickmichalina](https://github.com/patrickmichalina) |

[<img alt="nhutcorp" src="https://avatars3.githubusercontent.com/u/259458?v=4&s=117" width="117">](https://github.com/nhutcorp) |[<img alt="aboeglin" src="https://avatars0.githubusercontent.com/u/8297302?v=4&s=117" width="117">](https://github.com/aboeglin) |[<img alt="netstart" src="https://avatars1.githubusercontent.com/u/200232?v=4&s=117" width="117">](https://github.com/netstart) |[<img alt="eppsilon" src="https://avatars1.githubusercontent.com/u/5643?v=4&s=117" width="117">](https://github.com/eppsilon) |[<img alt="sasikumardr" src="https://avatars0.githubusercontent.com/u/1760104?v=4&s=117" width="117">](https://github.com/sasikumardr) |[<img alt="nulldev07" src="https://avatars0.githubusercontent.com/u/2115712?v=4&s=117" width="117">](https://github.com/nulldev07) |
:---: |:---: |:---: |:---: |:---: |:---: |
[nhutcorp](https://github.com/nhutcorp) |[aboeglin](https://github.com/aboeglin) |[netstart](https://github.com/netstart) |[eppsilon](https://github.com/eppsilon) |[sasikumardr](https://github.com/sasikumardr) |[nulldev07](https://github.com/nulldev07) |

[<img alt="gkalpak" src="https://avatars2.githubusercontent.com/u/8604205?v=4&s=117" width="117">](https://github.com/gkalpak) |[<img alt="markwhitfeld" src="https://avatars0.githubusercontent.com/u/1948265?v=4&s=117" width="117">](https://github.com/markwhitfeld) |[<img alt="Karasuni" src="https://avatars1.githubusercontent.com/u/15806406?v=4&s=117" width="117">](https://github.com/Karasuni) |[<img alt="sfabriece" src="https://avatars2.githubusercontent.com/u/3108592?v=4&s=117" width="117">](https://github.com/sfabriece) |[<img alt="ryzy" src="https://avatars1.githubusercontent.com/u/994940?v=4&s=117" width="117">](https://github.com/ryzy) |[<img alt="jerryorta-dev" src="https://avatars1.githubusercontent.com/u/341155?v=4&s=117" width="117">](https://github.com/jerryorta-dev) |
:---: |:---: |:---: |:---: |:---: |:---: |
[gkalpak](https://github.com/gkalpak) |[markwhitfeld](https://github.com/markwhitfeld) |[Karasuni](https://github.com/Karasuni) |[sfabriece](https://github.com/sfabriece) |[ryzy](https://github.com/ryzy) |[jerryorta-dev](https://github.com/jerryorta-dev) |

[<img alt="treyrich" src="https://avatars0.githubusercontent.com/u/1641028?v=4&s=117" width="117">](https://github.com/treyrich) |[<img alt="natarajanmca11" src="https://avatars2.githubusercontent.com/u/9244766?v=4&s=117" width="117">](https://github.com/natarajanmca11) |[<img alt="e-oz" src="https://avatars0.githubusercontent.com/u/526352?v=4&s=117" width="117">](https://github.com/e-oz) |[<img alt="nosachamos" src="https://avatars1.githubusercontent.com/u/1261686?v=4&s=117" width="117">](https://github.com/nosachamos) |[<img alt="pgrzeszczak" src="https://avatars0.githubusercontent.com/u/3300099?v=4&s=117" width="117">](https://github.com/pgrzeszczak) |[<img alt="alllx" src="https://avatars1.githubusercontent.com/u/701295?v=4&s=117" width="117">](https://github.com/alllx) |
:---: |:---: |:---: |:---: |:---: |:---: |
[treyrich](https://github.com/treyrich) |[natarajanmca11](https://github.com/natarajanmca11) |[e-oz](https://github.com/e-oz) |[nosachamos](https://github.com/nosachamos) |[pgrzeszczak](https://github.com/pgrzeszczak) |[alllx](https://github.com/alllx) |

[<img alt="LuxDie" src="https://avatars2.githubusercontent.com/u/12536671?v=4&s=117" width="117">](https://github.com/LuxDie) |[<img alt="JakePartusch" src="https://avatars0.githubusercontent.com/u/6424140?v=4&s=117" width="117">](https://github.com/JakePartusch) |[<img alt="JayKan" src="https://avatars0.githubusercontent.com/u/1400300?v=4&s=117" width="117">](https://github.com/JayKan) |[<img alt="JohnCashmore" src="https://avatars3.githubusercontent.com/u/2050794?v=4&s=117" width="117">](https://github.com/JohnCashmore) |[<img alt="larsthorup" src="https://avatars2.githubusercontent.com/u/1202959?v=4&s=117" width="117">](https://github.com/larsthorup) |[<img alt="admosity" src="https://avatars2.githubusercontent.com/u/4655972?v=4&s=117" width="117">](https://github.com/admosity) |
:---: |:---: |:---: |:---: |:---: |:---: |
[LuxDie](https://github.com/LuxDie) |[JakePartusch](https://github.com/JakePartusch) |[JayKan](https://github.com/JayKan) |[JohnCashmore](https://github.com/JohnCashmore) |[larsthorup](https://github.com/larsthorup) |[admosity](https://github.com/admosity) |

[<img alt="Doehl" src="https://avatars0.githubusercontent.com/u/1913751?v=4&s=117" width="117">](https://github.com/Doehl) |[<img alt="irsick" src="https://avatars0.githubusercontent.com/u/1380457?v=4&s=117" width="117">](https://github.com/irsick) |[<img alt="StefanKoenen" src="https://avatars3.githubusercontent.com/u/1442819?v=4&s=117" width="117">](https://github.com/StefanKoenen) |[<img alt="amedinavalencia" src="https://avatars0.githubusercontent.com/u/21317797?v=4&s=117" width="117">](https://github.com/amedinavalencia) |[<img alt="odk211" src="https://avatars3.githubusercontent.com/u/1321120?v=4&s=117" width="117">](https://github.com/odk211) |[<img alt="troyanskiy" src="https://avatars1.githubusercontent.com/u/1538862?v=4&s=117" width="117">](https://github.com/troyanskiy) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Doehl](https://github.com/Doehl) |[irsick](https://github.com/irsick) |[StefanKoenen](https://github.com/StefanKoenen) |[amedinavalencia](https://github.com/amedinavalencia) |[odk211](https://github.com/odk211) |[troyanskiy](https://github.com/troyanskiy) |

[<img alt="tsm91" src="https://avatars3.githubusercontent.com/u/4459551?v=4&s=117" width="117">](https://github.com/tsm91) |[<img alt="domfarolino" src="https://avatars1.githubusercontent.com/u/9669289?v=4&s=117" width="117">](https://github.com/domfarolino) |[<img alt="juristr" src="https://avatars3.githubusercontent.com/u/542458?v=4&s=117" width="117">](https://github.com/juristr) |[<img alt="jvitor83" src="https://avatars2.githubusercontent.com/u/3493339?v=4&s=117" width="117">](https://github.com/jvitor83) |[<img alt="ouq77" src="https://avatars2.githubusercontent.com/u/1796191?v=4&s=117" width="117">](https://github.com/ouq77) |[<img alt="ahmadqarshi" src="https://avatars1.githubusercontent.com/u/5607132?v=4&s=117" width="117">](https://github.com/ahmadqarshi) |
:---: |:---: |:---: |:---: |:---: |:---: |
[tsm91](https://github.com/tsm91) |[domfarolino](https://github.com/domfarolino) |[juristr](https://github.com/juristr) |[jvitor83](https://github.com/jvitor83) |[ouq77](https://github.com/ouq77) |[ahmadqarshi](https://github.com/ahmadqarshi) |

[<img alt="turbohappy" src="https://avatars1.githubusercontent.com/u/437299?v=4&s=117" width="117">](https://github.com/turbohappy) |[<img alt="gotenxds" src="https://avatars2.githubusercontent.com/u/3519520?v=4&s=117" width="117">](https://github.com/gotenxds) |[<img alt="devanp92" src="https://avatars2.githubusercontent.com/u/4533277?v=4&s=117" width="117">](https://github.com/devanp92) |[<img alt="DmitriyPotapov" src="https://avatars0.githubusercontent.com/u/5184083?v=4&s=117" width="117">](https://github.com/DmitriyPotapov) |[<img alt="fisenkodv" src="https://avatars0.githubusercontent.com/u/1039447?v=4&s=117" width="117">](https://github.com/fisenkodv) |[<img alt="evanplaice" src="https://avatars1.githubusercontent.com/u/303159?v=4&s=117" width="117">](https://github.com/evanplaice) |
:---: |:---: |:---: |:---: |:---: |:---: |
[turbohappy](https://github.com/turbohappy) |[gotenxds](https://github.com/gotenxds) |[devanp92](https://github.com/devanp92) |[DmitriyPotapov](https://github.com/DmitriyPotapov) |[fisenkodv](https://github.com/fisenkodv) |[evanplaice](https://github.com/evanplaice) |

[<img alt="JunaidZA" src="https://avatars3.githubusercontent.com/u/16782593?v=4&s=117" width="117">](https://github.com/JunaidZA) |[<img alt="c-ice" src="https://avatars3.githubusercontent.com/u/347238?v=4&s=117" width="117">](https://github.com/c-ice) |[<img alt="markharding" src="https://avatars3.githubusercontent.com/u/851436?v=4&s=117" width="117">](https://github.com/markharding) |[<img alt="ojacquemart" src="https://avatars1.githubusercontent.com/u/1189345?v=4&s=117" width="117">](https://github.com/ojacquemart) |[<img alt="rafaelss95" src="https://avatars0.githubusercontent.com/u/11965907?v=4&s=117" width="117">](https://github.com/rafaelss95) |[<img alt="rajeev-tripathi" src="https://avatars3.githubusercontent.com/u/12512503?v=4&s=117" width="117">](https://github.com/rajeev-tripathi) |
:---: |:---: |:---: |:---: |:---: |:---: |
[JunaidZA](https://github.com/JunaidZA) |[c-ice](https://github.com/c-ice) |[markharding](https://github.com/markharding) |[ojacquemart](https://github.com/ojacquemart) |[rafaelss95](https://github.com/rafaelss95) |[rajeev-tripathi](https://github.com/rajeev-tripathi) |

[<img alt="ArnaudPel" src="https://avatars3.githubusercontent.com/u/6020369?v=4&s=117" width="117">](https://github.com/ArnaudPel) |[<img alt="TuiKiken" src="https://avatars1.githubusercontent.com/u/959821?v=4&s=117" width="117">](https://github.com/TuiKiken) |[<img alt="vogloblinsky" src="https://avatars3.githubusercontent.com/u/2841805?v=4&s=117" width="117">](https://github.com/vogloblinsky) |[<img alt="edud69" src="https://avatars2.githubusercontent.com/u/1514745?v=4&s=117" width="117">](https://github.com/edud69) |[<img alt="idready" src="https://avatars1.githubusercontent.com/u/4941311?v=4&s=117" width="117">](https://github.com/idready) |[<img alt="zbarbuto" src="https://avatars3.githubusercontent.com/u/9100419?v=4&s=117" width="117">](https://github.com/zbarbuto) |
:---: |:---: |:---: |:---: |:---: |:---: |
[ArnaudPel](https://github.com/ArnaudPel) |[TuiKiken](https://github.com/TuiKiken) |[vogloblinsky](https://github.com/vogloblinsky) |[edud69](https://github.com/edud69) |[idready](https://github.com/idready) |[zbarbuto](https://github.com/zbarbuto) |

[<img alt="Yonet" src="https://avatars1.githubusercontent.com/u/3523671?v=4&s=117" width="117">](https://github.com/Yonet) |[<img alt="Green-Cat" src="https://avatars2.githubusercontent.com/u/3328823?v=4&s=117" width="117">](https://github.com/Green-Cat) |[<img alt="ip512" src="https://avatars0.githubusercontent.com/u/1699735?v=4&s=117" width="117">](https://github.com/ip512) |[<img alt="joshboley" src="https://avatars0.githubusercontent.com/u/5840836?v=4&s=117" width="117">](https://github.com/joshboley) |[<img alt="Marcelh1983" src="https://avatars1.githubusercontent.com/u/3284645?v=4&s=117" width="117">](https://github.com/Marcelh1983) |[<img alt="pbazurin-softheme" src="https://avatars3.githubusercontent.com/u/4518922?v=4&s=117" width="117">](https://github.com/pbazurin-softheme) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Yonet](https://github.com/Yonet) |[Green-Cat](https://github.com/Green-Cat) |[ip512](https://github.com/ip512) |[joshboley](https://github.com/joshboley) |[Marcelh1983](https://github.com/Marcelh1983) |[pbazurin-softheme](https://github.com/pbazurin-softheme) |

[<img alt="Bigous" src="https://avatars1.githubusercontent.com/u/6886560?v=4&s=117" width="117">](https://github.com/Bigous) |[<img alt="salemdar" src="https://avatars1.githubusercontent.com/u/6159613?v=4&s=117" width="117">](https://github.com/salemdar) |[<img alt="alexweber" src="https://avatars1.githubusercontent.com/u/14409?v=4&s=117" width="117">](https://github.com/alexweber) |[<img alt="allenhwkim" src="https://avatars1.githubusercontent.com/u/1437734?v=4&s=117" width="117">](https://github.com/allenhwkim) |[<img alt="hellofornow" src="https://avatars3.githubusercontent.com/u/3720413?v=4&s=117" width="117">](https://github.com/hellofornow) |[<img alt="yassirh" src="https://avatars2.githubusercontent.com/u/4649139?v=4&s=117" width="117">](https://github.com/yassirh) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Bigous](https://github.com/Bigous) |[salemdar](https://github.com/salemdar) |[alexweber](https://github.com/alexweber) |[allenhwkim](https://github.com/allenhwkim) |[hellofornow](https://github.com/hellofornow) |[yassirh](https://github.com/yassirh) |

[<img alt="amaltsev" src="https://avatars2.githubusercontent.com/u/2480962?v=4&s=117" width="117">](https://github.com/amaltsev) |[<img alt="tomlobato" src="https://avatars2.githubusercontent.com/u/1187704?v=4&s=117" width="117">](https://github.com/tomlobato) |[<img alt="taguan" src="https://avatars3.githubusercontent.com/u/1026937?v=4&s=117" width="117">](https://github.com/taguan) |[<img alt="bbarry" src="https://avatars0.githubusercontent.com/u/84951?v=4&s=117" width="117">](https://github.com/bbarry) |[<img alt="bbogdanov" src="https://avatars0.githubusercontent.com/u/15037947?v=4&s=117" width="117">](https://github.com/bbogdanov) |[<img alt="sonicparke" src="https://avatars2.githubusercontent.com/u/1139721?v=4&s=117" width="117">](https://github.com/sonicparke) |
:---: |:---: |:---: |:---: |:---: |:---: |
[amaltsev](https://github.com/amaltsev) |[tomlobato](https://github.com/tomlobato) |[taguan](https://github.com/taguan) |[bbarry](https://github.com/bbarry) |[bbogdanov](https://github.com/bbogdanov) |[sonicparke](https://github.com/sonicparke) |

[<img alt="brendanbenson" src="https://avatars0.githubusercontent.com/u/866866?v=4&s=117" width="117">](https://github.com/brendanbenson) |[<img alt="brian428" src="https://avatars3.githubusercontent.com/u/140338?v=4&s=117" width="117">](https://github.com/brian428) |[<img alt="briantopping" src="https://avatars2.githubusercontent.com/u/158115?v=4&s=117" width="117">](https://github.com/briantopping) |[<img alt="ckapilla" src="https://avatars3.githubusercontent.com/u/451875?v=4&s=117" width="117">](https://github.com/ckapilla) |[<img alt="cadriel" src="https://avatars2.githubusercontent.com/u/205520?v=4&s=117" width="117">](https://github.com/cadriel) |[<img alt="Cselt" src="https://avatars0.githubusercontent.com/u/11027521?v=4&s=117" width="117">](https://github.com/Cselt) |
:---: |:---: |:---: |:---: |:---: |:---: |
[brendanbenson](https://github.com/brendanbenson) |[brian428](https://github.com/brian428) |[briantopping](https://github.com/briantopping) |[ckapilla](https://github.com/ckapilla) |[cadriel](https://github.com/cadriel) |[Cselt](https://github.com/Cselt) |

[<img alt="dszymczuk" src="https://avatars3.githubusercontent.com/u/539352?v=4&s=117" width="117">](https://github.com/dszymczuk) |[<img alt="dmurat" src="https://avatars1.githubusercontent.com/u/470930?v=4&s=117" width="117">](https://github.com/dmurat) |[<img alt="peah90" src="https://avatars0.githubusercontent.com/u/4435255?v=4&s=117" width="117">](https://github.com/peah90) |[<img alt="dstockhammer" src="https://avatars1.githubusercontent.com/u/1156637?v=4&s=117" width="117">](https://github.com/dstockhammer) |[<img alt="madcalfus" src="https://avatars3.githubusercontent.com/u/8432125?v=4&s=117" width="117">](https://github.com/madcalfus) |[<img alt="dwido" src="https://avatars3.githubusercontent.com/u/154235?v=4&s=117" width="117">](https://github.com/dwido) |
:---: |:---: |:---: |:---: |:---: |:---: |
[dszymczuk](https://github.com/dszymczuk) |[dmurat](https://github.com/dmurat) |[peah90](https://github.com/peah90) |[dstockhammer](https://github.com/dstockhammer) |[madcalfus](https://github.com/madcalfus) |[dwido](https://github.com/dwido) |

[<img alt="totev" src="https://avatars3.githubusercontent.com/u/4454638?v=4&s=117" width="117">](https://github.com/totev) |[<img alt="JimbeanZN" src="https://avatars1.githubusercontent.com/u/6659033?v=4&s=117" width="117">](https://github.com/JimbeanZN) |[<img alt="emilio-simoes" src="https://avatars3.githubusercontent.com/u/1752519?v=4&s=117" width="117">](https://github.com/emilio-simoes) |[<img alt="ericdoerheit" src="https://avatars1.githubusercontent.com/u/8611720?v=4&s=117" width="117">](https://github.com/ericdoerheit) |[<img alt="gp187" src="https://avatars0.githubusercontent.com/u/3019963?v=4&s=117" width="117">](https://github.com/gp187) |[<img alt="gsamokovarov" src="https://avatars0.githubusercontent.com/u/604618?v=4&s=117" width="117">](https://github.com/gsamokovarov) |
:---: |:---: |:---: |:---: |:---: |:---: |
[totev](https://github.com/totev) |[JimbeanZN](https://github.com/JimbeanZN) |[emilio-simoes](https://github.com/emilio-simoes) |[ericdoerheit](https://github.com/ericdoerheit) |[gp187](https://github.com/gp187) |[gsamokovarov](https://github.com/gsamokovarov) |

[<img alt="koodikindral" src="https://avatars3.githubusercontent.com/u/6285484?v=4&s=117" width="117">](https://github.com/koodikindral) |[<img alt="hkashlan" src="https://avatars2.githubusercontent.com/u/4923194?v=4&s=117" width="117">](https://github.com/hkashlan) |[<img alt="hpinsley" src="https://avatars0.githubusercontent.com/u/750098?v=4&s=117" width="117">](https://github.com/hpinsley) |[<img alt="NN77" src="https://avatars2.githubusercontent.com/u/3319904?v=4&s=117" width="117">](https://github.com/NN77) |[<img alt="isidroamv" src="https://avatars0.githubusercontent.com/u/4197621?v=4&s=117" width="117">](https://github.com/isidroamv) |[<img alt="JohnnyQQQQ" src="https://avatars0.githubusercontent.com/u/3528218?v=4&s=117" width="117">](https://github.com/JohnnyQQQQ) |
:---: |:---: |:---: |:---: |:---: |:---: |
[koodikindral](https://github.com/koodikindral) |[hkashlan](https://github.com/hkashlan) |[hpinsley](https://github.com/hpinsley) |[NN77](https://github.com/NN77) |[isidroamv](https://github.com/isidroamv) |[JohnnyQQQQ](https://github.com/JohnnyQQQQ) |

[<img alt="jeffbcross" src="https://avatars2.githubusercontent.com/u/463703?v=4&s=117" width="117">](https://github.com/jeffbcross) |[<img alt="Drane" src="https://avatars1.githubusercontent.com/u/389499?v=4&s=117" width="117">](https://github.com/Drane) |[<img alt="johnjelinek" src="https://avatars2.githubusercontent.com/u/873610?v=4&s=117" width="117">](https://github.com/johnjelinek) |[<img alt="JunusErgin" src="https://avatars1.githubusercontent.com/u/7281463?v=4&s=117" width="117">](https://github.com/JunusErgin) |[<img alt="justindujardin" src="https://avatars0.githubusercontent.com/u/101493?v=4&s=117" width="117">](https://github.com/justindujardin) |[<img alt="karlhiramoto" src="https://avatars2.githubusercontent.com/u/22713?v=4&s=117" width="117">](https://github.com/karlhiramoto) |
:---: |:---: |:---: |:---: |:---: |:---: |
[jeffbcross](https://github.com/jeffbcross) |[Drane](https://github.com/Drane) |[johnjelinek](https://github.com/johnjelinek) |[JunusErgin](https://github.com/JunusErgin) |[justindujardin](https://github.com/justindujardin) |[karlhiramoto](https://github.com/karlhiramoto) |

[<img alt="lihaibh" src="https://avatars3.githubusercontent.com/u/4681233?v=4&s=117" width="117">](https://github.com/lihaibh) |[<img alt="Brooooooklyn" src="https://avatars1.githubusercontent.com/u/3468483?v=4&s=117" width="117">](https://github.com/Brooooooklyn) |[<img alt="tandu" src="https://avatars0.githubusercontent.com/u/273313?v=4&s=117" width="117">](https://github.com/tandu) |[<img alt="inkidotcom" src="https://avatars3.githubusercontent.com/u/100466?v=4&s=117" width="117">](https://github.com/inkidotcom) |[<img alt="mpetkov" src="https://avatars1.githubusercontent.com/u/8858458?v=4&s=117" width="117">](https://github.com/mpetkov) |[<img alt="daixtrose" src="https://avatars2.githubusercontent.com/u/5588692?v=4&s=117" width="117">](https://github.com/daixtrose) |
:---: |:---: |:---: |:---: |:---: |:---: |
[lihaibh](https://github.com/lihaibh) |[Brooooooklyn](https://github.com/Brooooooklyn) |[tandu](https://github.com/tandu) |[inkidotcom](https://github.com/inkidotcom) |[mpetkov](https://github.com/mpetkov) |[daixtrose](https://github.com/daixtrose) |

[<img alt="MathijsHoogland" src="https://avatars2.githubusercontent.com/u/7372934?v=4&s=117" width="117">](https://github.com/MathijsHoogland) |[<img alt="maxklenk" src="https://avatars0.githubusercontent.com/u/3898310?v=4&s=117" width="117">](https://github.com/maxklenk) |[<img alt="mjwwit" src="https://avatars3.githubusercontent.com/u/4455124?v=4&s=117" width="117">](https://github.com/mjwwit) |[<img alt="oferze" src="https://avatars3.githubusercontent.com/u/5157769?v=4&s=117" width="117">](https://github.com/oferze) |[<img alt="ocombe" src="https://avatars0.githubusercontent.com/u/265378?v=4&s=117" width="117">](https://github.com/ocombe) |[<img alt="gdi2290" src="https://avatars3.githubusercontent.com/u/1016365?v=4&s=117" width="117">](https://github.com/gdi2290) |
:---: |:---: |:---: |:---: |:---: |:---: |
[MathijsHoogland](https://github.com/MathijsHoogland) |[maxklenk](https://github.com/maxklenk) |[mjwwit](https://github.com/mjwwit) |[oferze](https://github.com/oferze) |[ocombe](https://github.com/ocombe) |[gdi2290](https://github.com/gdi2290) |

[<img alt="typekpb" src="https://avatars1.githubusercontent.com/u/499820?v=4&s=117" width="117">](https://github.com/typekpb) |[<img alt="pavlovich" src="https://avatars0.githubusercontent.com/u/1209167?v=4&s=117" width="117">](https://github.com/pavlovich) |[<img alt="philipooo" src="https://avatars3.githubusercontent.com/u/1702399?v=4&s=117" width="117">](https://github.com/philipooo) |[<img alt="redian" src="https://avatars2.githubusercontent.com/u/816941?v=4&s=117" width="117">](https://github.com/redian) |[<img alt="robbatt" src="https://avatars2.githubusercontent.com/u/1379424?v=4&s=117" width="117">](https://github.com/robbatt) |[<img alt="robertpenner" src="https://avatars0.githubusercontent.com/u/79827?v=4&s=117" width="117">](https://github.com/robertpenner) |
:---: |:---: |:---: |:---: |:---: |:---: |
[typekpb](https://github.com/typekpb) |[pavlovich](https://github.com/pavlovich) |[philipooo](https://github.com/philipooo) |[redian](https://github.com/redian) |[robbatt](https://github.com/robbatt) |[robertpenner](https://github.com/robertpenner) |

[<img alt="Sjiep" src="https://avatars3.githubusercontent.com/u/5003111?v=4&s=117" width="117">](https://github.com/Sjiep) |[<img alt="RoxKilly" src="https://avatars1.githubusercontent.com/u/12346501?v=4&s=117" width="117">](https://github.com/RoxKilly) |[<img alt="siovene" src="https://avatars0.githubusercontent.com/u/891580?v=4&s=117" width="117">](https://github.com/siovene) |[<img alt="SamVerschueren" src="https://avatars2.githubusercontent.com/u/1913805?v=4&s=117" width="117">](https://github.com/SamVerschueren) |[<img alt="sclausen" src="https://avatars1.githubusercontent.com/u/916076?v=4&s=117" width="117">](https://github.com/sclausen) |[<img alt="heavymery" src="https://avatars1.githubusercontent.com/u/3417123?v=4&s=117" width="117">](https://github.com/heavymery) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Sjiep](https://github.com/Sjiep) |[RoxKilly](https://github.com/RoxKilly) |[siovene](https://github.com/siovene) |[SamVerschueren](https://github.com/SamVerschueren) |[sclausen](https://github.com/sclausen) |[heavymery](https://github.com/heavymery) |

[<img alt="na-oma" src="https://avatars2.githubusercontent.com/u/13700206?v=4&s=117" width="117">](https://github.com/na-oma) |[<img alt="tapas4java" src="https://avatars0.githubusercontent.com/u/2254963?v=4&s=117" width="117">](https://github.com/tapas4java) |[<img alt="tsvetomir" src="https://avatars1.githubusercontent.com/u/247917?v=4&s=117" width="117">](https://github.com/tsvetomir) |[<img alt="valera-rozuvan" src="https://avatars1.githubusercontent.com/u/2273090?v=4&s=117" width="117">](https://github.com/valera-rozuvan) |[<img alt="vincentpalita" src="https://avatars3.githubusercontent.com/u/2738822?v=4&s=117" width="117">](https://github.com/vincentpalita) |[<img alt="VladimirMakaev" src="https://avatars3.githubusercontent.com/u/2001475?v=4&s=117" width="117">](https://github.com/VladimirMakaev) |
:---: |:---: |:---: |:---: |:---: |:---: |
[na-oma](https://github.com/na-oma) |[tapas4java](https://github.com/tapas4java) |[tsvetomir](https://github.com/tsvetomir) |[valera-rozuvan](https://github.com/valera-rozuvan) |[vincentpalita](https://github.com/vincentpalita) |[VladimirMakaev](https://github.com/VladimirMakaev) |

[<img alt="Yalrafih" src="https://avatars1.githubusercontent.com/u/7460011?v=4&s=117" width="117">](https://github.com/Yalrafih) |[<img alt="arioth" src="https://avatars3.githubusercontent.com/u/3458082?v=4&s=117" width="117">](https://github.com/arioth) |[<img alt="billsworld" src="https://avatars3.githubusercontent.com/u/16911647?v=4&s=117" width="117">](https://github.com/billsworld) |[<img alt="blackheart01" src="https://avatars1.githubusercontent.com/u/1414277?v=4&s=117" width="117">](https://github.com/blackheart01) |[<img alt="butterfieldcons" src="https://avatars2.githubusercontent.com/u/12204784?v=4&s=117" width="117">](https://github.com/butterfieldcons) |[<img alt="danielcrisp" src="https://avatars1.githubusercontent.com/u/1104814?v=4&s=117" width="117">](https://github.com/danielcrisp) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Yalrafih](https://github.com/Yalrafih) |[arioth](https://github.com/arioth) |[billsworld](https://github.com/billsworld) |[blackheart01](https://github.com/blackheart01) |[butterfieldcons](https://github.com/butterfieldcons) |[danielcrisp](https://github.com/danielcrisp) |

[<img alt="gforceg" src="https://avatars3.githubusercontent.com/u/14267747?v=4&s=117" width="117">](https://github.com/gforceg) |[<img alt="jgolla" src="https://avatars3.githubusercontent.com/u/1542447?v=4&s=117" width="117">](https://github.com/jgolla) |[<img alt="locinus" src="https://avatars1.githubusercontent.com/u/29314302?v=4&s=117" width="117">](https://github.com/locinus) |[<img alt="omerfarukyilmaz" src="https://avatars3.githubusercontent.com/u/5538485?v=4&s=117" width="117">](https://github.com/omerfarukyilmaz) |[<img alt="ZuSe" src="https://avatars3.githubusercontent.com/u/522403?v=4&s=117" width="117">](https://github.com/ZuSe) |[<img alt="rossedfort" src="https://avatars3.githubusercontent.com/u/11775628?v=4&s=117" width="117">](https://github.com/rossedfort) |
:---: |:---: |:---: |:---: |:---: |:---: |
[gforceg](https://github.com/gforceg) |[jgolla](https://github.com/jgolla) |[locinus](https://github.com/locinus) |[omerfarukyilmaz](https://github.com/omerfarukyilmaz) |[ZuSe](https://github.com/ZuSe) |[rossedfort](https://github.com/rossedfort) |

[<img alt="ruffiem" src="https://avatars1.githubusercontent.com/u/1785492?v=4&s=117" width="117">](https://github.com/ruffiem) |[<img alt="savcha" src="https://avatars0.githubusercontent.com/u/879542?v=4&s=117" width="117">](https://github.com/savcha) |[<img alt="tobiaseisenschenk" src="https://avatars3.githubusercontent.com/u/17195795?v=4&s=117" width="117">](https://github.com/tobiaseisenschenk) |[<img alt="ultrasonicsoft" src="https://avatars3.githubusercontent.com/u/4145169?v=4&s=117" width="117">](https://github.com/ultrasonicsoft) |[<img alt="Falinor" src="https://avatars2.githubusercontent.com/u/9626158?v=4&s=117" width="117">](https://github.com/Falinor) |
:---: |:---: |:---: |:---: |:---: |
[ruffiem](https://github.com/ruffiem) |[savcha](https://github.com/savcha) |[tobiaseisenschenk](https://github.com/tobiaseisenschenk) |[ultrasonicsoft](https://github.com/ultrasonicsoft) |[Falinor](https://github.com/Falinor) |

# Change Log

You can follow the [Angular change log here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

# License

MIT
