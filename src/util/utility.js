/* support functions */

/**
 * Whisper a system message to the GM
 * @param {*} speaker
 * @param {*} content
 */
export function simpleGMWhisper(speaker, content) {
   const gmChatOptions = {
      content,
      speaker,
      whisper: ChatMessage.getWhisperRecipients("GM"),
   };
   ChatMessage.create(gmChatOptions);
}
