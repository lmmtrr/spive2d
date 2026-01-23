export function getSortableKey(str: any, padLength = 16) {
  const s = String(str || "");
  return s.replace(/\d+/g, (match) => match.padStart(padLength, "0"));
}

const createSorter =
  <T>(keyExtractor: (item: T) => any) =>
  (a: T, b: T) => {
    const keyA = getSortableKey(keyExtractor(a));
    const keyB = getSortableKey(keyExtractor(b));
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  };

export const sortByText = createSorter<{ text: any }>((item) => item.text);
export const sortById = createSorter<{ id: any }>((item) => item.id);
export const sortByName = createSorter<any[]>((item) => item[0]);
