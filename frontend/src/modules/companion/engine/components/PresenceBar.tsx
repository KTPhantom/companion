import {

  usePresence

} from "../hooks/usePresence";

export const PresenceBar = () => {

  const message =
    usePresence();

  return (

    <div
      className="

      fixed
      bottom-6
      left-1/2
      -translate-x-1/2

      px-6
      py-3

      rounded-full

      bg-white/10
      backdrop-blur-xl

      border
      border-white/10

      text-white
      text-sm

      shadow-2xl
      shadow-blue-500/10

      transition-all
      duration-500
      "
    >

      {message}

    </div>
  );
};