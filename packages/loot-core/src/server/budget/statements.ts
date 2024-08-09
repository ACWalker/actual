import * as db from '../db';
import { Category, Schedule } from '../db/types';

import { GOAL_PREFIX, TEMPLATE_PREFIX } from './template-notes';

/* eslint-disable rulesdir/typography */
export async function resetCategoryGoalDefsWithNoTemplates(): Promise<void> {
  await db.run(
    `
      UPDATE categories
      SET goal_def = NULL
      WHERE id NOT IN (SELECT n.id
                       FROM notes n
                       WHERE lower(note) LIKE '%${TEMPLATE_PREFIX}%'
                          OR lower(note) LIKE '%${GOAL_PREFIX}%')
    `,
  );
}

/* eslint-enable rulesdir/typography */

export type CategoryWithTemplateNote = {
  id: string;
  name: string;
  note: string;
};

export async function getCategoriesWithTemplateNotes(): Promise<
  CategoryWithTemplateNote[]
> {
  return await db.all(
    `
      SELECT c.id AS id, c.name as name, n.note AS note
      FROM notes n
             JOIN categories c ON n.id = c.id
      WHERE c.id = n.id
        AND (lower(note) LIKE '%${TEMPLATE_PREFIX}%'
        OR lower(note) LIKE '%${GOAL_PREFIX}%')
    `,
  );
}

export async function getActiveSchedules(): Promise<Schedule[]> {
  return await db.all(
    'SELECT id, rule, active, completed, posts_transaction, tombstone, name from schedules WHERE name NOT NULL AND tombstone = 0',
  );
}

export async function getActiveCategories(): Promise<Category[]> {
  return await db.all(
    `
      SELECT c.id,
             c.name,
             c.is_income,
             c.cat_group,
             c.sort_order,
             c.tombstone,
             c.hidden,
             c.goal_def
      FROM categories c
             INNER JOIN category_groups cg on c.cat_group = cg.id
      WHERE c.tombstone = 0
        AND c.hidden = 0
        AND c.hidden = 0
    `,
  );
}

export async function getCategoriesWithGoalDefs(): Promise<Category[]> {
  return await db.all(
    'SELECT c.id, c.name, c.is_income AS isIncome, c.cat_group AS catGroup, c.sort_order AS sortOrder, c.tombstone, c.hidden, c.goal_def as goalDef FROM categories c WHERE c.goal_def IS NOT NULL',
  );
}

export async function getCategoryWithGoalDefs(
  category_id: string,
): Promise<Category> {
  return await db.first(
    'SELECT c.id, c.name, c.is_income AS isIncome, c.cat_group AS catGroup, c.sort_order AS sortOrder, c.tombstone, c.hidden, c.goal_def FROM categories c WHERE c.goal_def IS NOT NULL AND c.id = ?',
    [category_id],
  );
}
