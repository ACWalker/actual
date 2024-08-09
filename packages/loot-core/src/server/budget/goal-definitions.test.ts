import { getTemplates } from './goal-definitions';
import * as statements from './statements';

jest.mock('./statements');

describe('getTemplates', () => {
  const mockCategoriesWithGoalDefs = [
    { id: '1', name: 'Category 1', goalDef: '[{"directive": "template"}]' },
    { id: '2', name: 'Category 2', goalDef: '[{"directive": "goal"}]' },
  ];

  const mockCategoryWithGoalDefs = {
    id: '1',
    name: 'Category 1',
    goalDef: '[{"directive": "goal"}]',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns categories with templates matching the directive', async () => {
    (statements.getCategoriesWithGoalDefs as jest.Mock).mockResolvedValue(
      mockCategoriesWithGoalDefs,
    );

    const result = await getTemplates(null, 'template');

    expect(result).toEqual([
      {
        id: '1',
        name: 'Category 1',
        templates: [{ directive: 'template' }],
      },
    ]);
  });

  it('Returns an empty array if no templates match the directive', async () => {
    (statements.getCategoriesWithGoalDefs as jest.Mock).mockResolvedValue(
      mockCategoriesWithGoalDefs,
    );

    const result = await getTemplates(null, 'nonexistent-directive');

    expect(result).toEqual([]);
  });

  it('Returns templates for a specific category if categoryId is provided', async () => {
    (statements.getCategoryWithGoalDefs as jest.Mock).mockResolvedValue(
      mockCategoryWithGoalDefs,
    );

    const result = await getTemplates('1', 'goal');

    expect(result).toEqual([
      {
        id: '1',
        name: 'Category 1',
        templates: [{ directive: 'goal' }],
      },
    ]);
  });

  it('Returns an empty array if the specific category has no matching templates', async () => {
    (statements.getCategoryWithGoalDefs as jest.Mock).mockResolvedValue(
      mockCategoryWithGoalDefs,
    );

    const result = await getTemplates('1', 'nonexistent-directive');

    expect(result).toEqual([]);
  });

  it('Handles null goalDef gracefully', async () => {
    const mockCategoriesWithNullGoalDef = [
      { id: '1', name: 'Category 1', goalDef: null },
    ];
    (statements.getCategoriesWithGoalDefs as jest.Mock).mockResolvedValue(
      mockCategoriesWithNullGoalDef,
    );

    const result = await getTemplates(null, 'template');

    expect(result).toEqual([]);
  });
});
