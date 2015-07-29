/* global Money */
"use strict";

//Even though this call exists in the money-core npm library, we need to call it again
//as under the covers this is building a list of types in memory
var MONEY_TYPE_NAME = 'Money';

EJSON.addType(MONEY_TYPE_NAME, Money.fromJSONValue);
