# Loomis Engine - Progress Documentation

## Session Start: February 21, 2026

---

## Project Overview

Loomis Engine is a free, open-source data visualization platform (alternative to Flourish).
Stack: React 18 + TypeScript (frontend), Go 1.21 + Gin (backend), Firebase (auth + Firestore), ECharts (rendering).

---

## Current State Summary

### What Is Working
- Authentication (login, signup, password reset via Firebase)
- Google Sheets data loading and quality analysis
- Dashboard builder with drag-and-drop canvas
- Rich text editor (TipTap)
- Chart library sidebar with all chart type categories
- ChartConfigModal with per-chart config forms (30+ chart types have individual config components)
- ChartRenderer using echarts-for-react + echarts-gl
- Dashboard save/load/delete to Firestore
- Auto-refresh system (configurable intervals)
- DashboardListPage showing saved dashboards
- Backend Go server with routes for sheets analysis and chart generation
- go-echarts integrated for chart config generation on backend

### Known Issues / Incomplete
- extractEChartsConfig in backend returns only dummy animation config, not real ECharts JSON (this is a KEY bug - the backend chart generation is essentially a stub)
- Chart config forms exist but the actual data flow from frontend config to backend and back to rendered chart needs verification
- Some chart types in ChartConfigs folder may have incomplete or placeholder implementations

### File Structure
- frontend/src/components/dashboard/ChartConfigs/ - 40+ individual chart config forms
- frontend/src/components/dashboard/ChartConfigModal.tsx - routes to correct config form
- frontend/src/components/dashboard/ChartRenderer.tsx - renders ECharts option
- frontend/src/components/dashboard/DashboardCanvas.tsx - drag-and-drop canvas
- frontend/src/pages/DashboardBuilderPage.tsx - main builder page
- frontend/src/pages/DashboardListPage.tsx - dashboard list
- frontend/src/pages/DashboardPage.tsx - sheet loading + quality report
- frontend/src/services/firestore.ts - Firestore CRUD
- backend/internal/charts/generator.go - chart generation (stub extractEChartsConfig)
- backend/internal/charts/handler.go - API handlers
- backend/cmd/server/main.go - server setup

---

## Phase 7 Spec (from PHASE_7_CHART_SYSTEM_SPEC.md)

Status as of session start:
- Backend API endpoints: working
- ChartConfigModal: exists with all chart type forms
- ChartRenderer: exists using echarts-for-react
- extractEChartsConfig: STUB - returns dummy data, needs real JSON extraction
- Dashboard save/load: DONE (Firestore)
- Auto-refresh: DONE

Remaining from spec:
- Fix extractEChartsConfig to return real ECharts option JSON
- Verify end-to-end chart flow works with real Google Sheets data

---
