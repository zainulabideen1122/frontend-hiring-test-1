export const CALL_TYPE_STYLES = {
  missed: {
    label: "Missed",
    className: "text-red-600",
  },
  answered: {
    label: "Answered",
    className: "text-green-600",
  },
  voicemail: {
    label: "Voice Mail",
    className: "text-blue-600",
  },
};

export function styleForCallType(type) {
  return CALL_TYPE_STYLES[type] || { label: type, className: "text-gray-700" };
}
