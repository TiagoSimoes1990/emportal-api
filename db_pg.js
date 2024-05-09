/*	db_pg.js
 	==========================
 	Abstract class for connecting to a PostgreSQL database.
 
  	Required modules:
  		node-postgres	- PostgreSQL client for Node.js (https://www.npmjs.com/package/node-postgres)
  						  https://node-postgres.com
       dayjs		    - parses, validates, manipulates and displays dates and times
  		pg-format		- dynamic SQL queries (https://www.npmjs.com/package/pg-format) (for bulk inserts)
 
 	Created:    05 Sep 2023
    ==========================
 */

// Import Required Modules;
import { Pool, types } from 'pg';
import format from 'pg-format';
import dayjs from 'dayjs';