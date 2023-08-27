export async function allTabsPrompt(tabs: chrome.tabs.Tab[]): Promise<string> {
  if (tabs.length === 0) {
    throw new Error("tabs is empty")
  }

  const limtedTabs = tabs.slice(0, 100)
  const modifiedTabs: Array<{ id: number; title: string; domain: string | null }> = [];
for (const tab of limtedTabs) {
    if (tab.title == null || tab.id == null || !tab.url) {
        continue;
    }
    modifiedTabs.push({
        id: tab.id,
        title: tab.title,
        domain: extractDomain(tab.url)
    });
}
  return `I want you can help me to grounping my tabs. I will give you some titles, ids, and URLs of tabs.
I want you to group my tabs and the group cannot exceed 10.
And I want you to only reply the group name and ids array with json format, and nothing else.
The group name is as short as possible and is not a url if possible.
The Format is [{group_name: string, ids: number[]}]
Do not write explanations. Do not type other word.
My url list is ${JSON.stringify(modifiedTabs)}`
}
function extractDomain(url: string): string | null {
  try {
      const parsed = new URL(url);
      return parsed.hostname; // This will return www.google.com from https://www.google.com/search?q=openai
  } catch (e) {
      console.error("Failed to parse URL:", url);
      return null;
  }
}
export async function autoGroupPrompt(
  tabs: chrome.tabs.Tab[],
  grounps: chrome.tabGroups.TabGroup[]
): Promise<string> {
  if (tabs.length === 0) {
    throw new Error("tabs is empty")
  }
  const limtedTabs = tabs.slice(0, 100)
  const modifiedTabs: Array<{
    id: number
    title: string
    groupId: number
    domain: string | null
  }> = []
  for (const tab of limtedTabs) {
    if (tab.title == null || tab.id == null || !tab.url) {
      continue;
  }
  modifiedTabs.push({
    id: tab.id,
    title: tab.title,
    groupId: tab.groupId,
    domain: extractDomain(tab.url)
})
  }

  const limtedGroups = grounps.slice(0, 100)
  const modifiedGroups: Array<{ id: number; title: string }> = []
  for (const group of limtedGroups) {
    if (group.title == null || group.id == null) {
      continue
    }
    // remove "🤖 | "
    const groupTitle = group.title.startsWith("🤖 | ")
      ? group.title.slice(5)
      : group.title
    modifiedGroups.push({
      id: group.id,
      title: groupTitle
    })
  }

  return `I want you can help me to grounping my tabs. I will give you some titles, ids, and URLs of tabs.
I want you to group my tabs and the group cannot exceed 10.
And I want you to only reply the group id, group name and ids array with json format, and nothing else.
If group is not exist, you can make group id to -1 to create group.
The group name is as short as possible and is not a url if possible. Reuse the group is better. Don't make "Other" group.
Just return only what has changed.
The Format is [{group_id: number, group_name: string, ids: number[]}]
Do not write explanations. Do not type other word.
My url list is ${JSON.stringify(modifiedTabs)}
My group list is ${JSON.stringify(modifiedGroups)}`
}
