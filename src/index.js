import PTSActor from "./util/PTSActor.js";
import PTSCharacterSheet from "./util/PTSCharacterSheet.js";

Hooks.once("init", () => {
   console.log("PTS | Initializing PTS System");
   CONFIG.Actor.documentClass = PTSActor;

   Actors.unregisterSheet(game.system.id, "EZD6CharacterSheet");
   Actors.registerSheet(game.system.id, PTSCharacterSheet, { makeDefault: true });
});

Hooks.on("renderPTSCharacterSheet", async (app, html, data) => {
   if (
      data.data.system.mental.value < 0 ||
      data.data.system.mental.value == null ||
      data.data.system.mental.value == undefined
   ) {
      let actor = game.actors.get(data.actor._id);
      await actor.updateSource({ system: { mental: { max: 3, value: 3 } } });
   }
   app.render(true);
});

Hooks.on("getPTSCharacterSheetHeaderButtons", function (sheet, buttons) {
   buttons.unshift({
      label: game.i18n.localize("EZD6.MiniSheet"),
      icon: "fas fa-window",
      class: "none",
      onclick: () => sheet.showMini(),
   });
});
