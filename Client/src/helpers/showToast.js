import { toast } from "react-toastify";

/**
 * Custom toast to show custom messages.
 * @param   message  The toast message.
 * @param   severity  error, info or success.
 */
export const showToast = (message, severity) => {
  switch (severity) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "light",
      });
      break;

    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "light",
      });
      break;

    case "info":
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "light",
      });
      break;

    case "warning":
      toast.warn(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "light",
      });
      break;

    default:
      break;
  }
};
