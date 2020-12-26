# home-brain-backend
The backend for home-brain.

## Installation
1. Change `.env.template` to `.env`. Apply your specific configuration
2. `npm install`
3. `npm run dev`

## Configure Your Devices

### MQTT
- Change `src/mqtt-things.json.template` to `src/mqtt-things.json` and apply your specific configuration.

List of Supported types:
- type: "onoff"
- type: "hygrometer"

### Bluetooth
- Change `src/bluetooth-things.json.template` to `src/bluetooth-things.json` and apply your specific configuration.

List of Supported types:
- type: "eq3-thermostat"

