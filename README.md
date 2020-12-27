# home-brain-backend
The backend for home-brain.

## Installation
### Prerequisites for using Bluetooth (see also https://github.com/noble/noble)
1. `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`
1. `sudo apt-get install libcap2-bin`
2. `sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)`

### Configure Your Devices
#### MQTT
- Change `src/mqtt-things.json.template` to `src/mqtt-things.json` and apply your specific configuration.

List of Supported types:
- type: "onoff"
- type: "hygrometer"

#### Bluetooth
- Change `src/bluetooth-things.json.template` to `src/bluetooth-things.json` and apply your specific configuration.

List of Supported types:
- type: "eq3-thermostat"

### Running the Backend
2. Change `.env.template` to `.env`. Apply your specific configuration
3. `npm install`
4. `npm run dev`
