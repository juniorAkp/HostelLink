import { images } from ".";

export const hostelsDataMarker = [
  {
    id: "hostel-1",
    name: "Tf Hostel",
    location: { lat: 5.66626, lng: -0.18209 },
    description: "A cozy hostel in the heart of the city.",
    imageUrl: images.hostel1,
  },
  {
    id: "hostel-2",
    name: "Evandy Hostel",
    location: { lat: 5.66311, lng: -0.18181 },
    description: "A vibrant hostel with a friendly atmosphere.",
    imageUrl: images.hostel1,
  },
  {
    id: "hostel-3",
    name: "Pent Hostel",
    location: { lat: 5.65761, lng: -0.18149 },
    description: "A modern hostel with great amenities.",
    imageUrl: images.hostel2,
  },
  {
    id: "hostel-4",
    name: "Commonwealth Hostel",
    location: { lat: 5.65066, lng: -0.19158 },
    description: "A historic hostel with a rich heritage.",
    imageUrl: images.hostel2,
  },
];

export const customMapStyle = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off", // Set water geometry to off
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels",
    stylers: [
      {
        visibility: "off", // Hide labels for water bodies too
      },
    ],
  },
  // You might also want to hide other features like points of interest if they clutter the map
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "on", // Hide points of interest
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        visibility: "off", // Hide transit labels
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];
