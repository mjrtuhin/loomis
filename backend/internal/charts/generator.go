package charts

import (
	"bytes"
	"fmt"
	"io"

	"github.com/go-echarts/go-echarts/v2/charts"
	"github.com/go-echarts/go-echarts/v2/opts"
)

type ChartGenerator struct{}

func NewChartGenerator() *ChartGenerator {
	return &ChartGenerator{}
}

type ChartRequest struct {
	Type      string                 `json:"type"`
	Title     string                 `json:"title"`
	XAxisData []string               `json:"xAxisData"`
	Series    []SeriesData           `json:"series"`
	Options   map[string]interface{} `json:"options"`
}

type SeriesData struct {
	Name string    `json:"name"`
	Data []float64 `json:"data"`
}

type ChartResponse struct {
	ChartConfig map[string]interface{} `json:"chartConfig"`
}

func (g *ChartGenerator) GenerateChart(req ChartRequest) (*ChartResponse, error) {
	var chartConfig map[string]interface{}
	var err error

	switch req.Type {
	// BASIC CHARTS
	case "bar":
		chartConfig, err = g.generateBarChart(req)
	case "bar_horizontal":
		chartConfig, err = g.generateHorizontalBarChart(req)
	case "bar_stacked":
		chartConfig, err = g.generateStackedBarChart(req)
	case "bar3d":
		chartConfig, err = g.generateBar3DChart(req)
	case "line":
		chartConfig, err = g.generateLineChart(req)
	case "line_smooth":
		chartConfig, err = g.generateSmoothLineChart(req)
	case "line_area":
		chartConfig, err = g.generateAreaChart(req)
	case "line3d":
		chartConfig, err = g.generateLine3DChart(req)
	case "pie":
		chartConfig, err = g.generatePieChart(req)
	case "pie_doughnut":
		chartConfig, err = g.generateDoughnutChart(req)
	case "scatter":
		chartConfig, err = g.generateScatterChart(req)
	case "scatter_effect":
		chartConfig, err = g.generateEffectScatterChart(req)
	case "scatter3d":
		chartConfig, err = g.generateScatter3DChart(req)
		
	// STATISTICAL CHARTS
	case "heatmap":
		chartConfig, err = g.generateHeatmapChart(req)
	case "boxplot":
		chartConfig, err = g.generateBoxPlotChart(req)
	case "candlestick":
		chartConfig, err = g.generateCandlestickChart(req)
		
	// SPECIALIZED CHARTS
	case "radar":
		chartConfig, err = g.generateRadarChart(req)
	case "funnel":
		chartConfig, err = g.generateFunnelChart(req)
	case "gauge":
		chartConfig, err = g.generateGaugeChart(req)
	case "wordcloud":
		chartConfig, err = g.generateWordCloudChart(req)
	case "liquid":
		chartConfig, err = g.generateLiquidChart(req)
	case "themeriver":
		chartConfig, err = g.generateThemeRiverChart(req)
		
	// RELATIONSHIP CHARTS
	case "graph":
		chartConfig, err = g.generateGraphChart(req)
	case "sankey":
		chartConfig, err = g.generateSankeyChart(req)
	case "tree":
		chartConfig, err = g.generateTreeChart(req)
	case "treemap":
		chartConfig, err = g.generateTreemapChart(req)
	case "sunburst":
		chartConfig, err = g.generateSunburstChart(req)
		
	// MULTI-DIMENSIONAL
	case "parallel":
		chartConfig, err = g.generateParallelChart(req)
		
	// GEOGRAPHIC
	case "geo":
		chartConfig, err = g.generateGeoChart(req)
	case "map":
		chartConfig, err = g.generateMapChart(req)
		
	// 3D CHARTS
	case "surface3d":
		chartConfig, err = g.generateSurface3DChart(req)
	case "globe":
		chartConfig, err = g.generateGlobeChart(req)
		
	default:
		return nil, fmt.Errorf("unsupported chart type: %s", req.Type)
	}

	if err != nil {
		return nil, err
	}

	return &ChartResponse{ChartConfig: chartConfig}, nil
}

// BASIC CHARTS
func (g *ChartGenerator) generateBarChart(req ChartRequest) (map[string]interface{}, error) {
	bar := charts.NewBar()
	bar.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true), Trigger: "axis"}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	bar.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.BarData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.BarData{Value: v}
		}
		bar.AddSeries(series.Name, items)
	}
	return g.extractEChartsConfig(bar)
}

func (g *ChartGenerator) generateHorizontalBarChart(req ChartRequest) (map[string]interface{}, error) {
	bar := charts.NewBar()
	bar.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	bar.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.BarData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.BarData{Value: v}
		}
		bar.AddSeries(series.Name, items)
	}
	bar.XYReversal()
	return g.extractEChartsConfig(bar)
}

func (g *ChartGenerator) generateStackedBarChart(req ChartRequest) (map[string]interface{}, error) {
	bar := charts.NewBar()
	bar.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	bar.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.BarData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.BarData{Value: v}
		}
		bar.AddSeries(series.Name, items, charts.WithBarChartOpts(opts.BarChart{Stack: "total"}))
	}
	return g.extractEChartsConfig(bar)
}

func (g *ChartGenerator) generateBar3DChart(req ChartRequest) (map[string]interface{}, error) {
	bar3d := charts.NewBar3D()
	bar3d.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(bar3d)
}

func (g *ChartGenerator) generateLineChart(req ChartRequest) (map[string]interface{}, error) {
	line := charts.NewLine()
	line.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	line.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.LineData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.LineData{Value: v}
		}
		line.AddSeries(series.Name, items)
	}
	return g.extractEChartsConfig(line)
}

func (g *ChartGenerator) generateSmoothLineChart(req ChartRequest) (map[string]interface{}, error) {
	line := charts.NewLine()
	line.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	line.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.LineData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.LineData{Value: v}
		}
		line.AddSeries(series.Name, items, charts.WithLineChartOpts(opts.LineChart{Smooth: opts.Bool(true)}))
	}
	return g.extractEChartsConfig(line)
}

func (g *ChartGenerator) generateAreaChart(req ChartRequest) (map[string]interface{}, error) {
	line := charts.NewLine()
	line.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	line.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.LineData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.LineData{Value: v}
		}
		line.AddSeries(series.Name, items, charts.WithAreaStyleOpts(opts.AreaStyle{}))
	}
	return g.extractEChartsConfig(line)
}

func (g *ChartGenerator) generateLine3DChart(req ChartRequest) (map[string]interface{}, error) {
	line3d := charts.NewLine3D()
	line3d.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(line3d)
}

func (g *ChartGenerator) generatePieChart(req ChartRequest) (map[string]interface{}, error) {
	pie := charts.NewPie()
	pie.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	if len(req.Series) > 0 {
		items := make([]opts.PieData, len(req.Series[0].Data))
		for i, v := range req.Series[0].Data {
			name := ""
			if i < len(req.XAxisData) {
				name = req.XAxisData[i]
			}
			items[i] = opts.PieData{Name: name, Value: v}
		}
		pie.AddSeries("pie", items)
	}
	return g.extractEChartsConfig(pie)
}

func (g *ChartGenerator) generateDoughnutChart(req ChartRequest) (map[string]interface{}, error) {
	pie := charts.NewPie()
	pie.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	if len(req.Series) > 0 {
		items := make([]opts.PieData, len(req.Series[0].Data))
		for i, v := range req.Series[0].Data {
			name := ""
			if i < len(req.XAxisData) {
				name = req.XAxisData[i]
			}
			items[i] = opts.PieData{Name: name, Value: v}
		}
		pie.AddSeries("pie", items).SetSeriesOptions(charts.WithPieChartOpts(opts.PieChart{Radius: []string{"40%", "75%"}}))
	}
	return g.extractEChartsConfig(pie)
}

func (g *ChartGenerator) generateScatterChart(req ChartRequest) (map[string]interface{}, error) {
	scatter := charts.NewScatter()
	scatter.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
		charts.WithLegendOpts(opts.Legend{Show: opts.Bool(true)}),
	)
	scatter.SetXAxis(req.XAxisData)
	for _, series := range req.Series {
		items := make([]opts.ScatterData, len(series.Data))
		for i, v := range series.Data {
			items[i] = opts.ScatterData{Value: v}
		}
		scatter.AddSeries(series.Name, items)
	}
	return g.extractEChartsConfig(scatter)
}

func (g *ChartGenerator) generateEffectScatterChart(req ChartRequest) (map[string]interface{}, error) {
	scatter := charts.NewEffectScatter()
	scatter.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(scatter)
}

func (g *ChartGenerator) generateScatter3DChart(req ChartRequest) (map[string]interface{}, error) {
	scatter3d := charts.NewScatter3D()
	scatter3d.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(scatter3d)
}

// STATISTICAL CHARTS
func (g *ChartGenerator) generateHeatmapChart(req ChartRequest) (map[string]interface{}, error) {
	heatmap := charts.NewHeatMap()
	heatmap.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(heatmap)
}

func (g *ChartGenerator) generateBoxPlotChart(req ChartRequest) (map[string]interface{}, error) {
	boxplot := charts.NewBoxPlot()
	boxplot.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(boxplot)
}

func (g *ChartGenerator) generateCandlestickChart(req ChartRequest) (map[string]interface{}, error) {
	kline := charts.NewKLine()
	kline.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(kline)
}

// SPECIALIZED CHARTS
func (g *ChartGenerator) generateRadarChart(req ChartRequest) (map[string]interface{}, error) {
	radar := charts.NewRadar()
	radar.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	return g.extractEChartsConfig(radar)
}

func (g *ChartGenerator) generateFunnelChart(req ChartRequest) (map[string]interface{}, error) {
	funnel := charts.NewFunnel()
	funnel.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	if len(req.Series) > 0 {
		items := make([]opts.FunnelData, len(req.Series[0].Data))
		for i, v := range req.Series[0].Data {
			name := ""
			if i < len(req.XAxisData) {
				name = req.XAxisData[i]
			}
			items[i] = opts.FunnelData{Name: name, Value: v}
		}
		funnel.AddSeries("funnel", items)
	}
	return g.extractEChartsConfig(funnel)
}

func (g *ChartGenerator) generateGaugeChart(req ChartRequest) (map[string]interface{}, error) {
	gauge := charts.NewGauge()
	gauge.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: opts.Bool(true)}),
	)
	if len(req.Series) > 0 && len(req.Series[0].Data) > 0 {
		items := []opts.GaugeData{{Value: req.Series[0].Data[0]}}
		gauge.AddSeries("gauge", items)
	}
	return g.extractEChartsConfig(gauge)
}

func (g *ChartGenerator) generateWordCloudChart(req ChartRequest) (map[string]interface{}, error) {
	wc := charts.NewWordCloud()
	wc.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(wc)
}

func (g *ChartGenerator) generateLiquidChart(req ChartRequest) (map[string]interface{}, error) {
	liquid := charts.NewLiquid()
	liquid.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(liquid)
}

func (g *ChartGenerator) generateThemeRiverChart(req ChartRequest) (map[string]interface{}, error) {
	tr := charts.NewThemeRiver()
	tr.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(tr)
}

// RELATIONSHIP CHARTS
func (g *ChartGenerator) generateGraphChart(req ChartRequest) (map[string]interface{}, error) {
	graph := charts.NewGraph()
	graph.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(graph)
}

func (g *ChartGenerator) generateSankeyChart(req ChartRequest) (map[string]interface{}, error) {
	sankey := charts.NewSankey()
	sankey.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(sankey)
}

func (g *ChartGenerator) generateTreeChart(req ChartRequest) (map[string]interface{}, error) {
	tree := charts.NewTree()
	tree.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(tree)
}

func (g *ChartGenerator) generateTreemapChart(req ChartRequest) (map[string]interface{}, error) {
	treemap := charts.NewTreeMap()
	treemap.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(treemap)
}

func (g *ChartGenerator) generateSunburstChart(req ChartRequest) (map[string]interface{}, error) {
	sunburst := charts.NewSunburst()
	sunburst.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(sunburst)
}

// MULTI-DIMENSIONAL
func (g *ChartGenerator) generateParallelChart(req ChartRequest) (map[string]interface{}, error) {
	parallel := charts.NewParallel()
	parallel.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(parallel)
}

// GEOGRAPHIC
func (g *ChartGenerator) generateGeoChart(req ChartRequest) (map[string]interface{}, error) {
	geo := charts.NewGeo()
	geo.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(geo)
}

func (g *ChartGenerator) generateMapChart(req ChartRequest) (map[string]interface{}, error) {
	m := charts.NewMap()
	m.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(m)
}

// 3D CHARTS
func (g *ChartGenerator) generateSurface3DChart(req ChartRequest) (map[string]interface{}, error) {
	surface := charts.NewSurface3D()
	surface.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: req.Title}),
	)
	return g.extractEChartsConfig(surface)
}

func (g *ChartGenerator) generateGlobeChart(req ChartRequest) (map[string]interface{}, error) {
	// Globe is not in standard go-echarts, skip for now
	return map[string]interface{}{
		"title": map[string]interface{}{"text": req.Title},
	}, nil
}

func (g *ChartGenerator) extractEChartsConfig(chart interface{}) (map[string]interface{}, error) {
	var buf bytes.Buffer
	type renderer interface {
		Render(w io.Writer) error
	}
	if r, ok := chart.(renderer); ok {
		if err := r.Render(&buf); err != nil {
			return nil, err
		}
	} else {
		return nil, fmt.Errorf("chart does not implement Render method")
	}

	config := map[string]interface{}{
		"animation":         true,
		"animationDuration": 1000,
		"animationEasing":   "cubicOut",
	}
	return config, nil
}
