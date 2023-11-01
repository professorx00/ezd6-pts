import { EZD6 } from "../util/config";
import { MiniCharSheet } from "../../../../systems/ezd6/module/sheets/minicharsheet.js";

export class PTSMiniCharSheet extends MiniCharSheet {
   constructor(object, options) {
      super(object, options);
      this.actor = object || {};
   }

   static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
         template: "modules/ezd6-pts/templates/formapplications/minichar.hbs",
         closeOnSubmit: false,
         width: "290",
         height: "auto",
         resizable: false,
         classes: ["ezd6", "sheet", "mini"],
      });
   }

   get id() {
      let id = `ezd6-mini-sheet-${this.actor.id}`;
      if (this.actor.isToken) {
         id += `-${this.actor.token.id}`;
      }
      return id;
   }

   get title() {
      return this.actor.name;
   }

   getData(options) {
      const data = super.getData(options);
      data.strikesHtml = this.renderStrikes();
      data.mentalHtml = this.renderMental();
      data.heroDiceHtml = this.renderHeroDice();
      data.karmaHtml = this.renderKarma();
      return data;
   }

   renderStrikes() {
      let html = "";
      const strikes = this.actor.system.strikes.value;

      for (let i = 0; i < this.actor.system.strikes.max; i++) {
         if (i < strikes) {
            html += '<i class="fas fa-heart strike"></i>';
         } else {
            html += '<i class="fas fa-heart used-strike"></i>';
         }
      }

      return html;
   }
   renderMental() {
      let html = "";
      const strikes = this.actor.system.mental.value;

      for (let i = 0; i < this.actor.system.mental.max; i++) {
         if (i < strikes) {
            html += '<i class="fas fa-brain mental"></i>';
         } else {
            html += '<i class="fas fa-brain used-mental"></i>';
         }
      }

      return html;
   }

   renderHeroDice() {
      let html = "";

      if (this.actor.system.herodice === 0 || this.actor.system.herodice < 0) {
         html += '<i class="fas fa-square no-hero-die"></i>';
      } else {
         for (let i = 0; i < this.actor.system.herodice; i++) {
            html += '<i class="fas fa-square hero-die"></i>';
         }
      }
      return html;
   }

   renderKarma() {
      let html = "";

      if (this.actor.system.karma === 0) {
         html += '<i class="fas fa-circle no-karma"></i>';
      } else {
         for (let i = 0; i < this.actor.system.karma; i++) {
            html += '<i class="fas fa-circle karma"></i>';
         }
      }
      return html;
   }

   activateListeners(html) {
      super.activateListeners(html);
      html.find(".mental").click(this._onRemoveMental.bind(this));
      html.find(".mental").contextmenu(this._onAddMental.bind(this));
   }

   _onOpenSheetClick(event) {
      this.actor.sheet.render(true);
   }

   _onRemoveStrike(event) {
      this.actor.removeStrike();
   }

   _onAddStrike(event) {
      this.actor.addStrike();
   }

   _onRemoveMental(event) {
      this.actor.removeMental();
   }

   _onAddMental(event) {
      this.actor.addMental();
   }

   async _onRoll(event) {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = element.dataset;

      await this.actor.doRoll(dataset);
   }

   _onRollHeroDie(event) {
      this.actor.rollHeroDie({});
   }

   _onAddHeroDie(event) {
      this.actor.addHeroDie();
   }

   _onSpendKarma(event) {
      this.actor.spendKarma();
   }

   _onAddKarma(event) {
      this.actor.addKarma();
   }

   _onCast(dataset) {
      this.actor.rollCast(dataset);
   }

   _onRollResist(event) {
      this.actor.rollResist();
   }
}
