# Graphs and Representation

A quick, implementation-focused catalog of how each department page structures its charts and tables. All chart data are in-page literals unless noted. Chart components are from `recharts` via dynamic import (PieChart/Pie, BarChart/Bar, ResponsiveContainer, Tooltip, Legend). Slices/bars generally expect `{ name: string; value: number }`; bars with custom colors add `color`.

## Directorate of Agricultural Engineering (mns-data)
- **Data source:** Supabase (`DEPARTMENT_ID` constant) with dynamic column discovery; tables auto-hide system fields (`id`, `department_id`, `created_at`) and optionally prioritize `serial_no`.
- **Charts:** Multiple pies using `{ name, value }` with palette keys (buildings, farm, lab, human, hand, power, electricity) and label modes (`percent` or `value`). Helper `renderPieVisualization(title, data, chartId, emptyMessage, options)` controls label mode and value formatting.
- **Tables:** Built from fetched records; columns derived at runtime via `getTableColumns`. Formatting helper `formatColumnName` title-cases and replaces underscores.
- **Notes:** Uses Recharts `Cell` hover effects; color gradients resolved via `resolveGradient(chartId, index)`.

## Agricultural Mechanization Research Institute (amri)
- **Charts:**
  - Pie: Functional vs Non-Functional machinery (`{ name, value }`).
  - Bar: Top machinery types (`{ name, qty, color }`).
- **Tables:** Machinery list with columns `# | Machinery Name | Quantity | Status` using badges.
- **Summary cards:** Total, Functional, Non-Functional counts.

## Entomological Research Sub Station (ento)
- **Charts:** Pie for verification status (`{ name, value }`).
- **Tables:** Asset register sample with `# | Name | Qty | Date Received | Last Verification`.
- **Lists/Stats:** Item-type counts list; stat cards for total/verified/unverified; info grid for officers/officials/land/rooms.

## Agriculture Extension Wing (ext)
- **Charts:**
  - Pie: Building status (`{ name, value }`).
  - Bar: Staff distribution (`{ name, sanctioned, filled }`).
  - Pie: Vacancy overview (`{ name, value }`).
- **Tables:**
  - Building details: `Sr.No | Name | Location | Area | Status | Remarks`.
  - Vacancy table (filterable: all/vacant/filled): `S.No | Name of Post | BPS | Sanctioned | Filled | Vacant`, footer totals.
- **Summary cards:** Buildings, area, sanctioned, filled, vacant.

## Floriculture Research Institute (flori)
- **Charts:**
  - Pie: Land resources (`{ name, value }`).
  - Bar: Human resources (`{ name, value, color }`).
- **Tables:**
  - Farm machinery: `Equipment | Quantity`.
  - Lab equipment: `Equipment | Quantity`.
  - HR detailed: `Sr.# | Name of Post | BPS | Sanctioned | In Position | Vacant | Total` (with bold total row).
- **Stats:** Land area cards; focal-person info block.

## Cotton Research Institute (cotton-institute)
- **Charts:** None.
- **Tables:**
  - Lab equipment status: `Equipment | Department | Status` with functional/non-functional tags.
  - Farm machinery: `Equipment | Year | Location | Status`.
- **Stat grids:** Land/infrastructure (area, rooms, labs) and HR counts (officers, officials, vacant).
- **Insights:** Text blocks highlighting functional issues.

## Mango Research Institute (mri)
- **Charts:**
  - Pie: HR status (`Filled`, `Vacant`).
  - Bar: Land distribution (`Office`, `Buildings`, `Cultivated`).
- **Tables:**
  - Land resource summary.
  - Building details.
  - Farm machinery (`Equipment | Qty`).
- **Summary cards:** Total posts, filled, vacant.

## Adaptive Research Station (adp)
- **Charts:**
  - Bar: Stock distribution (`{ name (truncated), qty, color }`).
  - Pie: Staff positions (`Filled Positions`, `Vacant Positions`).
- **Tables:**
  - Equipment & machinery stock: `Sr.No | Item Name | Quantity | Store Entry`.
  - Staff positions: `Post | BPS | Sanctioned | Filled | Vacant` with vacancy badge coloring.
- **Stats:** Total stock items, sanctioned, filled, vacant.

## Regional Agricultural Economic Development Centre (raedc)
- **Charts:**
  - Pie: Training capacity (`{ name, value }`).
  - Bar: Budget overview (`{ name, value, color }`) with tooltip formatting to PKR million.
- **Tables:** Budget details `Year | Development Allocation | Development Expenditure | Non-Dev Allocation | Non-Dev Expenditure`.
- **Lists/Blocks:** Target beneficiaries list; functions grid; facilities grid; land info card.

## Regional Agricultural Research Institute (rari)
- **Charts:**
  - Pie: Human resources (`{ name, value }`).
  - Bar: Research focus scores (`{ name, value, color }`), values are percentages.
- **Lists:** Outputs list; functions grid; plant protection activities grid.
- **Stats:** Scientific officers count and vacancy note.

## Soil & Water Testing Laboratory (soil-water)
- **Charts:**
  - Pie: Budget distribution (`{ name, value }`).
  - Bar: Yearly allocation (`{ year, amount, color }`).
  - Pie: Staff distribution (`{ name, value }`).
  - Bar: Equipment summary (`{ name, value, color }`).
- **Tables:** Detailed budget breakdown (`Code | Particulars | 2025-26 | 2026-27 | 2027-28 | 2028-29 | Total`), officers list, support staff list.
- **Cards/Lists:** Project outcomes, outputs, focal person info.

## MNS University of Agriculture (mnsuam)
- **Tabs:** `labs`, `agronomy`, `facilities` with tab state.
- **Charts:**
  - Labs tab: Pie labs summary, Pie equipment status, Bar common equipment.
  - Agronomy tab: Pie equipment summary.
  - Facilities tab: Pie facilities sizes.
- **Tables:**
  - Labs tab: `Sr.No | Laboratory Name | Laboratory In charge | Equipments | Quantity | Non-Functional`.
  - Agronomy tab: `Sr.No | Name of Equipment | Quantity`.
- **Lists/Stats:** Facility cards with name/location/capacity; focal-person cards; stat cards per tab.

## Pesticide Quality Control Lab (pest)
- **Charts:**
  - Bar: Equipment counts (`{ name, value, color }`).
  - Pie: HR filled vs vacant (`{ name, value }`).
- **Tables:**
  - Instruments: `Name of Instrument | Quantity`.
  - HR: `Post Description | BPS | Sanctioned | Filled | Vacant` with grand total row.
- **Lists:** Building/room list; focal person info block.

## Common implementation notes
- All charts wrap in `ResponsiveContainer width="100%" height={...}` for responsiveness.
- Pies commonly use `innerRadius` to render doughnut charts; labels often show percentages via `entry.percent * 100`.
- Bars often truncate long labels and rotate X-axis tick labels (`angle={-45}`) to fit.
- Tables are plain HTML with alternating row styles; totals or highlights use inline bold rows.
