export const partitionBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) => {
  let orderedGroups: { key: K; items: T[] }[] = []
  let currentKey = getKey(list[0])
  let currentGroup: T[] = []

  for (const item of list) {
    const key = getKey(item)

    if (key !== currentKey) {
      orderedGroups.push({ key: currentKey, items: currentGroup })
      currentKey = key
      currentGroup = [item]
      continue
    }

    currentGroup.push(item)
  }

  if (currentGroup.length > 0) {
    orderedGroups.push({ key: currentKey, items: currentGroup })
  }

  return orderedGroups
}
