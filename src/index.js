import PTSActor from "./util/PTSActor.js";
import PTSCharacterSheet from "./util/PTSCharacterSheet.js";
import { PTSMiniCharSheet } from "./sheets/minicharsheet.js";
import { PTSMiniMonsterSheet } from "./sheets/minimonstersheet.js";

Hooks.once("init", () => {
   // CONFIG.debug.hooks = true;
   console.log("PTS | Initializing PTS System");
   CONFIG.Actor.documentClass = PTSActor;

   Actors.unregisterSheet(game.system.id, "EZD6CharacterSheet");
   Actors.registerSheet(game.system.id, PTSCharacterSheet, { makeDefault: true });
});

Hooks.on("renderPTSCharacterSheet", async (app, html, data) => {
   if (
      data.data.system.mental.value < 0 ||
      data.data.system.mental.value === null ||
      data.data.system.mental.value === undefined
   ) {
      const actor = game.actors.get(data.actor._id);
      await actor.updateSource({ system: { mental: { max: 3, value: 3 } } });
   }
   app.render(true);
});

Hooks.on("getPTSCharacterSheetHeaderButtons", (sheet, buttons) => {
   buttons.unshift({
      label: game.i18n.localize("EZD6.MiniSheet"),
      icon: "fas fa-window",
      class: "none",
      onclick: () => sheet.showMini(),
   });
});

Hooks.on("renderTokenHUD", (app, html, data) => {
   const actor = canvas.tokens.get(data._id).actor;
   html.find(".control-icon.open-mini").remove();
});

Hooks.on("renderTokenHUD", (app, html, data) => {
   const actor = canvas.tokens.get(data._id).actor;
   const button = $(
      `<div class="control-icon" title="${game.i18n.localize("EZD6.MiniSheet")}"><i class="fas fa-window"></i></div>`
   );
   html.find(".col.right").append(button).click(choosePTSMiniSheet.bind(this, actor));
});

Hooks.on("getActorDirectoryEntryContext", (app, options) => {
   options.pop();
   options.push({
      name: game.i18n.localize("EZD6.OpenMini"),
      icon: `<i class="fas fa-window"></i>`,
      element: {},
      condition: (li) => {
         const actor = game.actors.get(li.data("documentId"));
         return actor.isOwner;
      },
      callback: (li) => {
         const actor = game.actors.get(li.data("documentId"));
         choosePTSMiniSheet(actor);
      },
   });
});

function choosePTSMiniSheet(actor) {
   if (actor.type === "monster") {
      new PTSMiniMonsterSheet(actor).render(true);
   } else {
      new PTSMiniCharSheet(actor).render(true);
   }
}