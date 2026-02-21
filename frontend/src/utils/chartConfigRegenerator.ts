import { aggregateData } from './dataAggregation';

export function regenerateChartConfig(
  chartType: string,
  savedConfig: any,
  newSheetData: any
): any {
  if (!newSheetData || !savedConfig || !savedConfig._columnMetadata) {
    return savedConfig;
  }

  const metadata = savedConfig._columnMetadata;

  switch (chartType) {
    case 'bar':
      return regenerateBarChart(metadata, newSheetData, savedConfig);
    
    case 'line':
    case 'smoothLine':
    case 'area':
      return regenerateLineChart(metadata, newSheetData, savedConfig);
    
    case 'pie':
      return regeneratePieChart(metadata, newSheetData, savedConfig);
    
    case 'horizontalBar':
      return regenerateHorizontalBarChart(metadata, newSheetData, savedConfig);
    
    case 'funnel':
      return regenerateFunnelChart(metadata, newSheetData, savedConfig);
    
    case 'wordCloud':
      return regenerateWordCloudChart(metadata, newSheetData, savedConfig);
    
    case 'polarBar':
      return regeneratePolarBarChart(metadata, newSheetData, savedConfig);
    
    case 'treemap':
      return regenerateTreemapChart(metadata, newSheetData, savedConfig);
    
    case 'regionalMap':
      return regenerateRegionalMapChart(metadata, newSheetData, savedConfig);
    
    default:
      return savedConfig;
  }
}

function formatRows(sheetData: any) {
  return sheetData.rows.map((row: string[]) => {
    const obj: any = {};
    sheetData.headers.forEach((header: string, idx: number) => {
      obj[header] = row[idx];
    });
    return obj;
  });
}

function regenerateBarChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.x, metadata.y);

  return {
    ...savedConfig,
    xAxis: { ...savedConfig.xAxis, data: categories },
    series: [{ ...savedConfig.series[0], data: values }]
  };
}

function regenerateLineChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.x, metadata.y);

  return {
    ...savedConfig,
    xAxis: { ...savedConfig.xAxis, data: categories },
    series: [{ ...savedConfig.series[0], data: values }]
  };
}

function regeneratePieChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.label, metadata.value);

  const pieData = categories.map((name, idx) => ({
    name,
    value: values[idx]
  }));

  return {
    ...savedConfig,
    series: [{ ...savedConfig.series[0], data: pieData }]
  };
}

function regenerateHorizontalBarChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.category, metadata.value);

  return {
    ...savedConfig,
    yAxis: { ...savedConfig.yAxis, data: categories },
    series: [{ ...savedConfig.series[0], data: values }]
  };
}

function regenerateFunnelChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.label, metadata.value);

  const funnelData = categories.map((name, idx) => ({
    name,
    value: values[idx]
  })).sort((a, b) => b.value - a.value);

  return {
    ...savedConfig,
    series: [{ ...savedConfig.series[0], data: funnelData }]
  };
}

function regenerateWordCloudChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.word, metadata.weight);

  const wordCloudData = categories.map((name, idx) => ({
    name,
    value: values[idx]
  }));

  return {
    ...savedConfig,
    series: [{ ...savedConfig.series[0], data: wordCloudData }]
  };
}

function regeneratePolarBarChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.category, metadata.value);

  return {
    ...savedConfig,
    angleAxis: { ...savedConfig.angleAxis, data: categories },
    series: [{ ...savedConfig.series[0], data: values }]
  };
}

function regenerateTreemapChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.name, metadata.value);

  const treemapData = categories.map((name, idx) => ({
    name,
    value: values[idx]
  }));

  return {
    ...savedConfig,
    series: [{ ...savedConfig.series[0], data: treemapData }]
  };
}

function regenerateRegionalMapChart(metadata: any, sheetData: any, savedConfig: any) {
  const formattedRows = formatRows(sheetData);
  const { categories, values } = aggregateData(formattedRows, metadata.region, metadata.value);

  const mapData = categories.map((name, idx) => ({
    name,
    value: values[idx]
  }));

  return {
    ...savedConfig,
    visualMap: {
      ...savedConfig.visualMap,
      max: Math.max(...values)
    },
    series: [{ ...savedConfig.series[0], data: mapData }]
  };
}
