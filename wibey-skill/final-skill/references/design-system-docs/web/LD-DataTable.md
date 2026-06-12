# LD DataTable — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/data-table/guidelines/DataTableGuidelines.tsx`
**Import:** `import { DataTable, DataTableBody, DataTableBulkActions, DataTableCell, DataTableCellActions, DataTableCellSelect, DataTableCellStatus, DataTableHead, DataTableHeader, DataTableHeaderSelect, DataTableRow } from "@livingdesign/react"`

---

## Overview

`DataTable` is a composable table component. It does NOT take a `columns` or `data` prop — you build the table structure manually using sub-components. The root `DataTable` takes only `children` (required). Proper table semantics (`<th scope="col">`) are handled by `DataTableHeader`. Sortable columns use `DataTableHeader`'s `sort` and `onSort` props. Row selection uses `DataTableCellSelect` / `DataTableHeaderSelect` checkboxes.

---

## Props (SOURCE-VERIFIED)

### `DataTable` (root)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Must contain `DataTableHead` and/or `DataTableBody` sub-components |

### `DataTableHead`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Typically a `DataTableRow` with `DataTableHeader` cells |

### `DataTableBody`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `DataTableRow` components |

### `DataTableRow`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `DataTableCell`, `DataTableHeader`, or selection cells |
| `selected` | `boolean` | No | — | Marks the row as selected (for row-selection pattern) |

### `DataTableHeader`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Column header text |
| `alignment` | `"left" \| "right"` | No | `"left"` | Use `"right"` for numeric columns |
| `sort` | `"ascending" \| "descending" \| "none"` | No | — | Current sort direction for this column; sets `aria-sort` |
| `onSort` | `() => void` | No | — | Callback when column header is clicked to sort |

### `DataTableCell`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Cell content |
| `variant` | `"alphanumeric" \| "numeric"` | No | — | `"numeric"` right-aligns using monospace font for comparability |
| `id` | `string` | No | — | Used to wire `a11yLabelledBy` on `DataTableCellSelect` |

### `DataTableCellSelect`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `a11yLabelledBy` | `string` | Yes | — | ID of an element that provides the accessible label for this row's checkbox |
| `checked` | `boolean` | No | — | Controlled checked state |
| `onChange` | `() => void` | Yes | — | Callback when checkbox changes |

### `DataTableHeaderSelect`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `checked` | `boolean` | No | — | Controlled checked state |
| `indeterminate` | `boolean` | No | — | Shows indeterminate state when some (not all) rows are selected |
| `onChange` | `() => void` | Yes | — | Callback when select-all checkbox changes |

### `DataTableCellActions`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `IconButton` or `Menu` components for row-level actions |

### `DataTableCellStatus`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Typically a `Tag` component showing row status |

### `DataTableBulkActions`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `count` | `number` | Yes | — | Number of currently selected rows |
| `actionContent` | `ReactNode` | No | — | Buttons/actions to show in the bulk actions bar |
| `onClearSelected` | `() => void` | No | — | Callback to clear all row selections |
| `onSelectAll` | `() => void` | No | — | Callback to select all rows |

---

## Usage Examples

### Basic table

```tsx
<DataTable>
  <DataTableHead>
    <DataTableRow>
      <DataTableHeader>ID</DataTableHeader>
      <DataTableHeader>Name</DataTableHeader>
      <DataTableHeader alignment="right">Away Missions</DataTableHeader>
      <DataTableHeader>Status</DataTableHeader>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableCell>1</DataTableCell>
      <DataTableCell>James T. Kirk</DataTableCell>
      <DataTableCell variant="numeric">96</DataTableCell>
      <DataTableCellStatus>
        <Tag color="purple" variant="tertiary">Deceased</Tag>
      </DataTableCellStatus>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

### Sortable columns

```tsx
<DataTableHeader
  alignment="left"
  sort={sortColumnIndex === 0 ? sortDirection : "none"}
  onSort={() => handleSort(0)}
>
  Item name
</DataTableHeader>
```

### Row selection

```tsx
<DataTableRow selected={checked}>
  <DataTableCellSelect
    a11yLabelledBy={`row-${rowIndex}-name-cell-id`}
    checked={checked}
    onChange={() => toggleRow(rowIndex)}
  />
  <DataTableCell id={`row-${rowIndex}-name-cell-id`}>James T. Kirk</DataTableCell>
</DataTableRow>
```

### Cell actions

```tsx
<DataTableCellActions>
  <IconButton a11yLabel="Edit"><Icon.Pencil /></IconButton>
  <IconButton a11yLabel="Download"><Icon.CloudDownload /></IconButton>
</DataTableCellActions>
```

---

## A11Y Notes

- `DataTableHeader` renders `<th scope="col">` — provides column context for every data cell. This is the primary mechanism for 1.3.1 compliance in tables.
- The `sort` prop on `DataTableHeader` maps to `aria-sort` (values: `"ascending"`, `"descending"`, `"none"`). Always set `sort="none"` on sortable-but-not-active columns, not just the active one.
- `DataTableCellSelect` requires `a11yLabelledBy` pointing to a cell's `id` — this wires the checkbox accessible label to the row identifier (e.g., the item name). Do NOT leave this blank.
- `DataTableHeaderSelect` shows indeterminate state via the `indeterminate` prop — set this when some (not all) rows are checked so AT announces the mixed state.
- `DataTableBulkActions` should be placed above the table in the DOM so it appears in reading order before the table content.
- Cell action icons (`DataTableCellActions`) use `IconButton` with `a11yLabel` — ensure every action button has a meaningful accessible label (not "More options" when the actual action is specific).

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | `DataTableHeader` renders `<th scope="col">` associating headers to cells; native `<table>` semantics. |
| 2.1.1 Keyboard | A | Sortable headers and row checkboxes are keyboard operable. |
| 4.1.2 Name, Role, Value | A | `aria-sort` on sortable headers; checkbox accessible labels via `a11yLabelledBy`; row selected state via `selected` prop. |
