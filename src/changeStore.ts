import { writable, Writable } from "svelte/store";

export function changeStore() {
  const store = writable({});

  const added = writable([]);
  const updated = writable([]);
  const removed = writable([]);

  return {
    set: (id, value) => {
      const notify = () => (id in store ? updated : added).set([id]);
      store.update((values) => ({ ...values, [id]: value }));
      notify();
    },
    remove: (id: string | number) => {
      if (id in store) {
        store.update((values: any) => {
          const { [id]: omitted, ...rest } = values;
          return rest;
        });
        
      }
    },

    added: { subscribe: added.subscribe },
    updated: { subscribe: updated.subscribe },
    removed: { subscribe: removed.subscribe },

    subscribe: store.subscribe,
  };
}
