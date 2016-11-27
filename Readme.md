# Youtrack_EssentialAddons

Youtrack_EssentialAddons is a Node.js application which contains a number of essential addons to the youtrack application. Two essential features which this application provides include
* Printing of Agile cards to place on the physical board (each card contains ticket number, story points, description & Assignee). Each card is the size of a regular sticky note
* Exports queries to CSV so be able to easily filter / backup/ take snapshots. Useful for scrum masters to keep track of progress



## Requirements

* Node.js 6.0 and higher
* NPM 2.15.1 and higher

## Setup

**configuration file**
* config/config.coffee.template must be renamed to config.coffee
* Relative sections in config.coffee must be renamed to reflect the changes of your youtrack instance

### parameters
For convience, some of the parameters could be entered as environment variables, inside the configuration file or overridden in parameters
**Youtrack email address**
    * -email parameter OR
    * youtrack_email environment variable OR
    * place email address inside config.coffee


**Youtrack Password**
  * -pass parameter OR
  * youtrack_password environment variable OR
  * place email address inside config.coffee


**Sprint Number**
  * -sprint parameter OR
  * -can be placed inside config.coffee

**-Changes**
When present, application only prints changes (eg. useful for printing new Agile cards for changes which happened since last change)

**-print** (windows only)
    When present, a powershell script is Launched with prints a pdf containing Agile Tickets. The powershell script must be modified to include the correct filename(s), which need to be printed


## Current state
Currently this application is used for monitoring a sprint and is used to print Agile cards on a daily basis.

Running & installing application
```
"npm install" (installs dependencies)
"gulp" [inside root folder and is used for compiling the coffee-script configuration. Needs to be run everytime config.coffee is updated]
node dist/index.js
OR (eg using parameters)
node dist/index.js -email test@xy.com -pass password -sprint 33 -changes
```
