import { mdiWater } from '@mdi/js';
import { ActionHandlerEvent, handleAction, hasAction, hasConfigOrEntityChanged, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, CSSResultGroup, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';

// This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import './editor';

import type { FlowerCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION, UNAVAILABLE } from './constants';
import { localize } from './localize/localize';
import { HassEntity, STATE_NOT_RUNNING } from 'home-assistant-js-websocket';

interface EntityInfo {
  errorResult?: TemplateResult;
  stateObj?: HassEntity;
  stateValue?: number;
  entityId?: string;
}

/* eslint no-console: 0 */
console.info(
  `%c  FLOWER-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'flower-card',
  name: 'Flower',
  description: 'A template custom card for you to create something awesome',
});

@customElement('flower-card')
export class FlowerCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('flower-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: FlowerCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: FlowerCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.entity_soil_moisture) {
      throw new Error('"entity_soil_moisture" must be specified');
    }

    this.config = {
      /* ... default config here  */
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }

    const infoSoilMoisture = this.getEntityInfo(this.config.entity_soil_moisture);

    console.log(infoSoilMoisture.stateObj);

    if (infoSoilMoisture.errorResult) {
      return infoSoilMoisture.errorResult;
    }

    return html`
      <ha-card
        class="flower-card"
        .header=${this.config.title}
        @action=${this.tryHandleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this.config.hold_action),
          hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
        tabindex="0"
        .label=${`Flower: ${this.config.entity || 'No Entity Defined'}`}
      >
        <div class="bgimage" style="background-image:url('${this.config.image}')"></div>
        <span class="overlay_value">
          <ha-svg-icon .path=${mdiWater}></ha-svg-icon><span class="value">${infoSoilMoisture.stateValue}</span
          ><span class="unit">%</span>
        </span>
      </ha-card>
    `;
  }

  private getEntityInfo(entityId: string): EntityInfo {
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return {
        entityId,
        errorResult: html`<hui-warning
          >${this.hass.config.state !== STATE_NOT_RUNNING
            ? this.hass.localize('ui.panel.lovelace.warning.entity_not_found', 'entity', entityId || '[empty]')
            : this.hass.localize('ui.panel.lovelace.warning.starting')}</hui-warning
        >`,
      };
    }

    if (stateObj.state === UNAVAILABLE) {
      return {
        entityId,
        stateObj,
        errorResult: html`
          <hui-warning
            >${this.hass.localize('ui.panel.lovelace.warning.entity_unavailable', 'entity', entityId)}</hui-warning
          >
        `,
      };
    }

    const stateValue = Number(stateObj.state);

    if (isNaN(stateValue)) {
      return {
        entityId,
        stateObj,
        stateValue,
        errorResult: html`
          <hui-warning
            >${this.hass.localize('ui.panel.lovelace.warning.entity_non_numeric', 'entity', entityId)}</hui-warning
          >
        `,
      };
    }

    return {
      entityId,
      stateObj,
      stateValue,
    };
  }

  private tryHandleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return css`
      :host {}
    
      .flower-card {
        overflow: hidden; 
      }
      
      .bgimage {        
        no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        aspect-ratio: 1 / 1;
        border-bottom-left-radius: 8px; 
        border-bottom-right-radius: 8px; 
      }

      .overlay_value {
        position: absolute;
        bottom: 8px;
        left: 8px;
        padding: 2px 6px 4px 0px;
        background: var( --ha-card-background, var(--card-background-color, white) );
        border-radius: var(--ha-card-border-radius, 4px);
      }

      .overlay_value.alert {
        background: #BB3B31;
        color: #fff;
      }

      .overlay_value > .value {
        font-size: 23px;
        display: inline-block;
        bottom: -4px;
        position: relative;
      }

      .overlay_value > .unit {
        font-size: 16px;
        display: inline-block;
        bottom: -4px;
        position: relative;
      }

      :host([narrow]) .overlay_value > .value  {
        font-size: 26px;
      }      
    `;
  }
}
