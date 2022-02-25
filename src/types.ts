import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'flower-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface FlowerCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  image?: string; 

  entity_soil_moisture: string; 
  entity_temperature: string; 
  entity_illuminance: string; 

  tap_action?: ActionConfig;
}
