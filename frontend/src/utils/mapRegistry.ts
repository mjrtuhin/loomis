import * as echarts from 'echarts';
import * as topojson from 'topojson-client';

const loadedMaps = new Set<string>();

export const registerMap = async (mapName: string) => {
  if (loadedMaps.has(mapName)) {
    return true;
  }

  try {
    const mapConfig = getMapConfig(mapName);
    
    if (!mapConfig) {
      console.warn(`No config for map: ${mapName}`);
      return false;
    }

    const response = await fetch(mapConfig.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch map: ${mapName} (${response.status})`);
    }

    const data = await response.json();
    let geoJSON;

    // Convert TopoJSON to GeoJSON if needed
    if (mapConfig.isTopoJSON) {
      const objectKey = mapConfig.objectKey || Object.keys(data.objects)[0];
      geoJSON = topojson.feature(data, data.objects[objectKey]);
    } else {
      geoJSON = data;
    }

    // Filter by country if needed (for Natural Earth data)
    if (mapConfig.filterCountry) {
      geoJSON.features = geoJSON.features.filter((feature: any) => 
        feature.properties.iso_a2 === mapConfig.filterCountry ||
        feature.properties.adm0_a3 === mapConfig.filterCountry
      );
    }
    
    // Register the map
    echarts.registerMap(mapName, geoJSON);
    loadedMaps.add(mapName);
    
    console.log(`✅ Registered map: ${mapName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to register map ${mapName}:`, error);
    return false;
  }
};

interface MapConfig {
  url: string;
  isTopoJSON?: boolean;
  objectKey?: string;
  filterCountry?: string;
}

const getMapConfig = (mapName: string): MapConfig | null => {
  const configs: Record<string, MapConfig> = {
    // World map - TopoJSON from world-atlas
    'world': {
      url: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
      isTopoJSON: true,
      objectKey: 'countries'
    },
    
    // China - DataV GeoAtlas (GeoJSON)
    'china': {
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
      isTopoJSON: false
    },
    
    // USA - TopoJSON from us-atlas
    'usa': {
      url: 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json',
      isTopoJSON: true,
      objectKey: 'states'
    },
    
    // UK - Natural Earth Data (filtered from global dataset)
    'uk': {
      url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson',
      isTopoJSON: false,
      filterCountry: 'GB' // ISO code for UK
    },
    
    // India - Natural Earth Data (filtered from global dataset)
    'india': {
      url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson',
      isTopoJSON: false,
      filterCountry: 'IND' // ISO code for India
    },
    
    // Germany - GeoJSON (already working)
    'germany': {
      url: 'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/master/2_bundeslaender/4_niedrig.geo.json',
      isTopoJSON: false
    },
  };

  return configs[mapName] || null;
};

export const AVAILABLE_MAPS = [
  { 
    value: 'world', 
    label: '🌍 World', 
    regionType: 'Countries',
    examples: '"United States", "China", "India", "Germany", "United Kingdom"' 
  },
  { 
    value: 'china', 
    label: '🇨🇳 China', 
    regionType: 'Provinces',
    examples: '"Beijing", "Shanghai", "Guangdong", "Zhejiang", "Sichuan"' 
  },
  { 
    value: 'usa', 
    label: '🇺🇸 USA', 
    regionType: 'States',
    examples: '"California", "Texas", "New York", "Florida", "Illinois"' 
  },
  { 
    value: 'uk', 
    label: '🇬🇧 United Kingdom', 
    regionType: 'Counties/Regions',
    examples: '"England", "Scotland", "Wales", "Northern Ireland", "Greater London"' 
  },
  { 
    value: 'india', 
    label: '🇮🇳 India', 
    regionType: 'States/Territories',
    examples: '"Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"' 
  },
  { 
    value: 'germany', 
    label: '🇩🇪 Germany', 
    regionType: 'States (Länder)',
    examples: '"Bayern", "Berlin", "Hamburg", "Sachsen", "Hessen"' 
  },
];
