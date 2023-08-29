import {Category} from "./data.models";

export function groupCategories(categories: Category[]): Category[] {
  const categoryPrefixes: string[] = removeDuplicates(categories.map(categoryPrefix))
  const categoriesByPrefix: [string, Category[]][] = mapKeys(
    categoryPrefixes,
    (prefix) => categories.filter(categoryHasPrefix(prefix))
  )
  return categoriesByPrefix.map(groupedCategory)
}

function groupedCategory([prefix, categories]: [string, Category[]]) {
  if (categories.length === 1) {
    return categories[0]
  }
  return {
    id: categories[0].id,
    name: prefix,
    categories: categories.map(categoryWithoutPrefix),
  }
}

function mapKeys<K, V>(keys: K[], toValue: (key: K) => V): [K, V][] {
  return keys.map((key) => [key, toValue(key)])
}

function categoryHasPrefix(prefix: string): (category: Category) => boolean {
  return (category) => categoryPrefix(category) === prefix
}

function categoryWithoutPrefix(category: Category): Category {
  return {
    ...category,
    name: category.name.replace(/.*: /, ''),
  }
}

function categoryPrefix(category: Category): string {
  return category.name.replace(/:.*/, '')
}

function removeDuplicates<T>(values: T[]): T[] {
  return [...new Set(values)]
}
