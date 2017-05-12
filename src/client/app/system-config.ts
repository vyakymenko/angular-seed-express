/**
 * Since package update:
 *
 * "@types/systemjs": "^0.20.2",
 */
// declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));
