# PHASE 7: CHART SYSTEM - COMPLETE SPECIFICATION

## ✅ COMPLETED SO FAR:

### Backend (Go):
- ✅ go-echarts v2.6.7 integrated
- ✅ Chart generator with 3 types: bar, line, pie
- ✅ API endpoints working:
  - `POST /api/charts/generate` 
  - `GET /api/charts/types`
- ✅ Server running on :8080

### Files Created:
- `backend/internal/charts/generator.go` - Chart generation logic
- `backend/internal/charts/handler.go` - API handlers
- `backend/cmd/server/main.go` - Updated with chart routes

---

## 🎯 REMAINING WORK:

### 1. CHART CONFIGURATION MODAL (Frontend)

**Location:** `frontend/src/components/dashboard/ChartConfigModal.tsx`

**Features Required:**
```
┌─────────────────────────────────────────┐
│ ⚙️ Configure: Bar Chart                 │
├─────────────────────────────────────────┤
│                                         │
│ 📊 DATA MAPPING                         │
│ ┌─────────────────────────────────────┐ │
│ │ X-Axis Column: [Select... ▼]       │ │
│ │ Y-Axis Column: [Select... ▼]       │ │
│ │ ☐ Multiple Series                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🔍 ROW FILTERS                          │
│ ┌─────────────────────────────────────┐ │
│ │ Filter Type: [All rows ▼]          │ │
│ │                                     │ │
│ │ Options:                            │ │
│ │ • All rows                          │ │
│ │ • Top N rows                        │ │
│ │ • Bottom N rows                     │ │
│ │ • Range (1-100)                     │ │
│ │ • Above value (>80)                 │ │
│ │ • Below value (<50)                 │ │
│ │ • Between (80-800)                  │ │
│ │ • By date range                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🎨 STYLING                              │
│ ┌─────────────────────────────────────┐ │
│ │ Title: [My Chart]                   │ │
│ │ Color Scheme: [Default ▼]          │ │
│ │ ☑ Show Legend                       │ │
│ │ ☑ Show Tooltip                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 👁️ LIVE PREVIEW                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     [Chart renders here]            │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Cancel]  [Apply & Close]       │
└─────────────────────────────────────────┘
```

**Data Source:**
- Must use data from `useFetchSheet` hook
- Access loaded Google Sheets data from DashboardPage context
- Column names from `data.headers`
- Rows from `data.rows`

**Filter Logic (All in Frontend):**
```typescript
function applyRowFilter(data, filter) {
  switch(filter.type) {
    case 'all':
      return data;
    
    case 'top':
      return data
        .sort((a, b) => b[filter.column] - a[filter.column])
        .slice(0, filter.value);
    
    case 'bottom':
      return data
        .sort((a, b) => a[filter.column] - b[filter.column])
        .slice(0, filter.value);
    
    case 'range':
      return data.slice(filter.start, filter.end);
    
    case 'above':
      return data.filter(row => row[filter.column] > filter.value);
    
    case 'below':
      return data.filter(row => row[filter.column] < filter.value);
    
    case 'between':
      return data.filter(row => 
        row[filter.column] >= filter.min && 
        row[filter.column] <= filter.max
      );
    
    case 'date_range':
      return data.filter(row => {
        const date = new Date(row[filter.column]);
        return date >= filter.startDate && date <= filter.endDate;
      });
  }
}
```

---

### 2. CHART RENDERING (Frontend)

**Install dependencies:**
```bash
npm install echarts echarts-for-react
```

**Component:** `frontend/src/components/dashboard/ChartRenderer.tsx`
```typescript
import ReactECharts from 'echarts-for-react';

interface ChartRendererProps {
  config: any; // ECharts config from backend
}

export function ChartRenderer({ config }: ChartRendererProps) {
  return (
    <ReactECharts 
      option={config}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
```

---

### 3. COMPLETE WORKFLOW

**User Journey:**
1. User clicks ⚙️ on chart placeholder in canvas
2. Modal opens with chart type pre-selected
3. User selects X-axis column (dropdown shows all column names)
4. User selects Y-axis column (dropdown shows only numeric columns)
5. User applies row filter (optional)
6. Live preview updates in real-time
7. User clicks "Apply & Close"
8. Chart renders on canvas with real data

**Data Flow:**
```
Google Sheets Data (already loaded)
         ↓
User selects columns + filters
         ↓
Frontend applies filters to data
         ↓
Frontend prepares chart request:
{
  type: "bar",
  title: "Sales by Region",
  xAxisData: ["North", "South", "East"],
  series: [{ name: "Sales", data: [100, 200, 150] }]
}
         ↓
POST /api/charts/generate
         ↓
Backend uses go-echarts to generate config
         ↓
Returns ECharts JSON config
         ↓
Frontend renders with echarts-for-react
         ↓
Chart displays with animations!
```

---

### 4. EXTEND BACKEND FOR MORE CHART TYPES

**Add to `generator.go`:**
- Horizontal bar
- Stacked bar  
- Smooth line
- Area chart
- Doughnut
- Scatter
- Heatmap
- Radar
- Funnel
- Gauge
- And 40+ more from go-echarts

**Pattern:**
```go
func (g *ChartGenerator) generateHeatmapChart(req ChartRequest) (map[string]interface{}, error) {
	heatmap := charts.NewHeatMap()
	
	heatmap.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		// ... options
	)
	
	// Add data
	
	return g.extractEChartsConfig(heatmap)
}
```

---

### 5. EXTRACT REAL ECHARTS CONFIG

**Current issue:** `extractEChartsConfig` returns dummy data

**Need to:** Parse go-echarts HTML output and extract the JSON
```go
func extractEChartsConfig(chart interface{}) (map[string]interface{}, error) {
	var buf bytes.Buffer
	chart.(renderer).Render(&buf)
	html := buf.String()
	
	// Find: var option = {...};
	re := regexp.MustCompile(`var\s+option\s*=\s*({.*?});`)
	matches := re.FindStringSubmatch(html)
	
	if len(matches) < 2 {
		return nil, fmt.Errorf("failed to extract config")
	}
	
	var config map[string]interface{}
	json.Unmarshal([]byte(matches[1]), &config)
	
	return config, nil
}
```

---

### 6. LEGEND CUSTOMIZATION

**In ChartConfigModal, add Legend section:**
```
🎨 LEGEND OPTIONS
┌─────────────────────────────────┐
│ ☑ Show Legend                   │
│ Position: [Top ▼]              │
│ Orientation: [Horizontal ▼]    │
│ Icon: [Circle ▼]               │
└─────────────────────────────────┘
```

**In backend request:**
```json
{
  "options": {
    "legend": {
      "show": true,
      "position": "top",
      "orient": "horizontal",
      "icon": "circle"
    }
  }
}
```

---

### 7. TESTING CHECKLIST

- [ ] Modal opens when clicking ⚙️ on chart
- [ ] Column dropdowns populate from Google Sheets data
- [ ] Filters work (top N, range, between, etc.)
- [ ] Live preview updates in real-time
- [ ] Chart renders with go-echarts animations
- [ ] Legend is editable
- [ ] Tooltip works
- [ ] Chart saves to dashboard state
- [ ] Chart survives page refresh (after we add save)

---

### 8. FILES TO CREATE

**Frontend:**
- `src/components/dashboard/ChartConfigModal.tsx`
- `src/components/dashboard/ChartRenderer.tsx`
- `src/hooks/useChartData.ts`
- `src/services/chartApi.ts`
- `src/types/chartConfig.ts`

**Backend:**
- Extend `internal/charts/generator.go` with more chart types
- Fix `extractEChartsConfig` to parse real JSON

---

### 9. NEXT SESSION PLAN

**Session Start:**
1. Read this spec file
2. Install echarts packages
3. Create ChartConfigModal
4. Create ChartRenderer
5. Connect to backend API
6. Test with real Google Sheets data
7. Add more chart types
8. Polish and commit

**Estimated Time:** 2-3 hours for complete chart system

---

## 📝 CURRENT STATE SUMMARY

**Working:**
- ✅ Authentication
- ✅ Google Sheets data loading
- ✅ Data quality analysis
- ✅ Dashboard builder with drag & drop
- ✅ Rich text editor
- ✅ Backend chart API (basic)

**In Progress:**
- ⏳ Chart configuration modal
- ⏳ Chart rendering with ECharts
- ⏳ Row filtering logic
- ⏳ Legend customization

**Not Started:**
- ❌ Dashboard save/load to Firestore
- ❌ Auto-refresh system
- ❌ Multiple dashboards
- ❌ Export features

---

## 🎯 SUCCESS CRITERIA FOR PHASE 7

1. ✅ User can configure any chart type
2. ✅ All row filter types work correctly
3. ✅ Charts use real Google Sheets data
4. ✅ Charts have go-echarts animations
5. ✅ Legend is fully customizable
6. ✅ Live preview works in modal
7. ✅ At least 10 chart types working

**When Phase 7 is complete, we'll have a FUNCTIONAL data visualization tool!**

---

END OF SPECIFICATION
