import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'

export default function MapPanel({items,selected,onSelect}) {
  const key=import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if(!key) return <section className="map-placeholder"><div className="eyebrow">GOOGLE MAPS LAYER</div><h2>Map integration ready.</h2><p>Add a restricted <code>VITE_GOOGLE_MAPS_API_KEY</code> to enable interactive markers using the real coordinates in the ParSafe dataset.</p></section>
  const center=selected?{lat:Number(selected.latitude),lng:Number(selected.longitude)}:{lat:34.0415,lng:-118.265}
  return <section className="map-panel">
    <APIProvider apiKey={key}>
      <Map defaultZoom={15} center={center} mapId="DEMO_MAP_ID" gestureHandling="greedy">
        {items.map(x=><AdvancedMarker key={x.parking_id} position={{lat:Number(x.latitude),lng:Number(x.longitude)}} onClick={()=>onSelect(x)}>
          <div className={`map-marker ${selected?.parking_id===x.parking_id?'active':''}`}>P</div>
        </AdvancedMarker>)}
      </Map>
    </APIProvider>
  </section>
}