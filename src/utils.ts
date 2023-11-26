export function groupBy<T, U extends string>(items: T[], selector: (item: T) => U) {
  return items.reduce((acc: { [key: string]: T[] }, item: T) => {
    const key = selector(item).toString();
    if (key in acc) acc[key].push(item);
    else acc[key] = [item];
    return acc;
  }, {});
}

export function groupByOrdered<T, U extends string>(items: T[], selector: (item: T) => U) {
  const groups: string[] = [];
  const groupedBy = items.reduce((acc: { [key: string]: T[] }, item: T) => {
    const result = selector(item);
    const key = result.toString();
    if (key in acc) acc[key].push(item);
    else {
      acc[key] = [item];
      groups.push(key);
    }
    return acc;
  }, {});

  return groups.map((group) => ({ group, items: groupedBy[group] }));
}

export const range = (min: number, max: number) => Array.from({ length: max - min + 1 }, (_, i) => min + i) as number[];
