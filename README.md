# DIYRuZ_Flower_Card

A plant status card for [DIYRuZ_Flower](https://www.zigbee2mqtt.io/devices/DIYRuZ_Flower.html) plant sensor.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)


## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:flower-card`                   |
| name              | string  | **Optional** | Card name                                   | `Flower`       |
| show_error        | boolean | **Optional** | Show what an error looks like for the card  | `false`             |
| show_warning      | boolean | **Optional** | Show what a warning looks like for the card | `false`             |
| entity            | string  | **Optional** | Home Assistant entity ID.                   | `none`              |
| tap_action        | object  | **Optional** | Action to take on tap                       | `action: more-info` |
| hold_action       | object  | **Optional** | Action to take on hold                      | `none`              |
| double_tap_action | object  | **Optional** | Action to take on double tap                | `none`              |

## Action Options

| Name            | Type   | Requirement  | Description                                                                                        | Default     |
| --------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------- | ----------- |
| action          | string | **Required** | Action to perform (more-info, toggle, call-service, navigate url, none)                            | `more-info` |
| navigation_path | string | **Optional** | Path to navigate to (e.g. /lovelace/0/) when action defined as navigate                            | `none`      |
| url             | string | **Optional** | URL to open on click when action is url. The URL will open in a new tab                            | `none`      |
| service         | string | **Optional** | Service to call (e.g. media_player.media_play_pause) when action defined as call-service           | `none`      |
| service_data    | object | **Optional** | Service data to include (e.g. entity_id: media_player.bedroom) when action defined as call-service | `none`      |
| haptic          | string | **Optional** | Haptic feedback _success, warning, failure, light, medium, heavy, selection_                       | `none`      |
| repeat          | number | **Optional** | How often to repeat the `hold_action` in milliseconds.                                             | `none`      |


### notes


# https://www.home-assistant.io/integrations/trend/
binary_sensor:
  - platform: trend
    sensors:
      flower_palme_soil_moisture_state:
        entity_id: sensor.flower_palme_soil_moisture
        sample_duration: 7200
        max_samples: 120
        min_gradient: 0.0008
        device_class: moisture
