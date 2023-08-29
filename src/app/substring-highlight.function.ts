export function highlight(value: string, search: string): string {
  search = search.toLowerCase()
  let highlighted = value
  let index = 0
  while (true) {
    index = highlighted.toLowerCase().indexOf(search, index)
    if (index == -1) {
      break
    }
    highlighted =
      highlighted.slice(0, index) +
      `<b>${highlighted.slice(index, index + search.length)}</b>` +
      highlighted.slice(index + search.length)
    index += 3 + search.length + 4
  }
  return highlighted
}
