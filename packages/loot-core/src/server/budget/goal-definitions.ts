import { Category } from '../db/types';

import {
  getCategoriesWithGoalDefs,
  getCategoryWithGoalDefs,
} from './statements';
import { CategoryWithTemplates, Template } from './types/templates';

// This file is responsible for fetching templates from the database and returning them in a format that can be used by the client.

export async function getTemplates(
  categoryId: string | null,
  directive: string,
) {
  const categories = categoryId
    ? [await getCategoryWithGoalDefs(categoryId)]
    : await getCategoriesWithGoalDefs();
  const categoriesWithTemplates: CategoryWithTemplates[] = [];

  categories.forEach((category: Category) => {
    const templates = mapGoalDefsToTemplates(category.goalDef, directive);
    if (templates.length === 0) {
      return;
    }

    categoriesWithTemplates.push({
      id: category.id,
      name: category.name,
      templates,
    });
  });

  return categoriesWithTemplates;
}

function mapGoalDefsToTemplates(
  goalDefs: string | null,
  directive: string,
): Template[] {
  if (!goalDefs) return [];
  return JSON.parse(goalDefs).filter(
    (t: Template) => t.directive === directive,
  );
}
