import {

  useFocusStore

} from "@/modules/focus/store/focusStore";

import {

  generatePresenceMessage

} from "../engine/presenceEngine";

export const usePresence = () => {

  const {

    isRunning,

    timeLeft,

    totalTime

  } = useFocusStore();

  const message =
    generatePresenceMessage({

      isRunning,

      timeLeft,

      totalTime
    });

  return message;
};