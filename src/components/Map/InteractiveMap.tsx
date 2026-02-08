import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    onAreaChange: (area: number) => void;
    onPolygonChange: (geoJson: any) => void;
    siteType: string;
}

const SITE_COLORS: Record<string, string> = {
    garden: '#10b981', // emerald
    park: '#3b82f6',   // blue
    backyard: '#f59e0b', // amber
    school: '#a855f7', // purple
    other: '#64748b'   // slate
};

const MapController = ({ onAreaChange, onPolygonChange, siteType }: InteractiveMapProps) => {
    const map = useMap();
    const drawnLayerRef = useRef<L.Layer | null>(null);

    useEffect(() => {
        if (!map) return;

        map.pm.addControls({
            position: 'topleft',
            drawCircle: false,
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            editMode: true,
            dragMode: true,
            removalMode: true,
        });

        map.pm.setGlobalOptions({
            pathOptions: {
                color: SITE_COLORS[siteType] || '#10b981',
                fillColor: SITE_COLORS[siteType] || '#10b981',
                fillOpacity: 0.4,
            }
        });

        const handleCreate = (e: any) => {
            const { layer } = e;

            // If there's already a drawn layer, remove it (only one site per submission)
            if (drawnLayerRef.current) {
                map.removeLayer(drawnLayerRef.current);
            }

            drawnLayerRef.current = layer;
            updateCalculations(layer);

            layer.on('pm:edit', () => updateCalculations(layer));
        };

        const updateCalculations = (layer: any) => {
            const geoJson = layer.toGeoJSON();
            const area = turf.area(geoJson);
            onAreaChange(area);
            onPolygonChange(geoJson);
        };

        map.on('pm:create', handleCreate);
        map.on('pm:remove', () => {
            drawnLayerRef.current = null;
            onAreaChange(0);
            onPolygonChange(null);
        });

        return () => {
            map.off('pm:create', handleCreate);
            map.pm.removeControls();
        };
    }, [map, siteType]);

    // Update color of existing polygon if site type changes
    useEffect(() => {
        if (drawnLayerRef.current) {
            (drawnLayerRef.current as L.Path).setStyle({
                color: SITE_COLORS[siteType] || '#10b981',
                fillColor: SITE_COLORS[siteType] || '#10b981',
            });
        }
    }, [siteType]);

    return null;
};

export const InteractiveMap = (props: InteractiveMapProps) => {
    return (
        <MapContainer
            center={[40.2033, -8.4103]}
            zoom={13}
            className="w-full h-full rounded-2xl z-0"
            maxBounds={[
                [40.0, -8.7],
                [40.4, -8.1]
            ]}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController {...props} />
        </MapContainer>
    );
};
