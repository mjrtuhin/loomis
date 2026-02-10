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
	case "bar":
		chartConfig, err = g.generateBarChart(req)
	case "line":
		chartConfig, err = g.generateLineChart(req)
	case "pie":
		chartConfig, err = g.generatePieChart(req)
	default:
		return nil, fmt.Errorf("unsupported chart type: %s", req.Type)
	}

	if err != nil {
		return nil, err
	}

	return &ChartResponse{ChartConfig: chartConfig}, nil
}

func (g *ChartGenerator) generateBarChart(req ChartRequest) (map[string]interface{}, error) {
	bar := charts.NewBar()

	bar.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{
			Title: req.Title,
		}),
		charts.WithTooltipOpts(opts.Tooltip{
			Show:    opts.Bool(true),
			Trigger: "axis",
		}),
		charts.WithLegendOpts(opts.Legend{
			Show: opts.Bool(true),
		}),
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
		"title": map[string]interface{}{
			"text": "Generated Chart",
		},
		"tooltip": map[string]interface{}{
			"trigger": "axis",
		},
		"legend": map[string]interface{}{
			"show": true,
		},
		"animation":         true,
		"animationDuration": 1000,
		"animationEasing":   "cubicOut",
	}

	return config, nil
}
