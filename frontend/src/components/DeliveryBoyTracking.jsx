import scooter from '../assets/scooter.png'
import home from '../assets/home.png'
import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
const DeliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
})
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
})

function DeliveryBoyTracking({ data }) {

  const DeliveryBoyLat = data.deliverBoyLocation.lat
  const DeliveryBoyLon = data.deliverBoyLocation.lon
  const customerLat = data.customerLocation.lat
  const customerlon = data.customerLocation.lon

  const path = [
    [DeliveryBoyLat, DeliveryBoyLon],
    [customerLat, customerlon]
  ]
  const center = [DeliveryBoyLat, DeliveryBoyLon]
  return (
    <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md z-0'>
      <MapContainer
        center={center}
        zoom={16}
        
        style={{ height: "100%", width: "100%",zIndex:"0" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[DeliveryBoyLat, DeliveryBoyLon]} icon={DeliveryBoyIcon} >
          <Popup>DeliveryBoy</Popup>
        </Marker>

        <Marker position={[customerLat, customerlon]} icon={customerIcon} >
          <Popup>Customer</Popup>
        </Marker>
        <Polyline positions={path} color='blue' weight={4}></Polyline>
      </MapContainer>
    </div>
  )
}

export default DeliveryBoyTracking