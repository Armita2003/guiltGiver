import { Meal } from "@/types/nutrition";

type EventMap = {
  "menu:open": () => void;
  "meals:updated": (meals: Meal[]) => void;
};

type ListenerMap = { [K in keyof EventMap]?: Set<(...args: any[]) => void> };

const listeners: ListenerMap = {};

export const emit = <K extends keyof EventMap>(
  event: K,
  ...args: Parameters<EventMap[K]>
) => {
  listeners[event]?.forEach((fn) => fn(...args));
};

export const on = <K extends keyof EventMap>(event: K, fn: EventMap[K]) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event]!.add(fn as (...args: any[]) => void);
  return () => {
    listeners[event]?.delete(fn as (...args: any[]) => void);
  };
};
