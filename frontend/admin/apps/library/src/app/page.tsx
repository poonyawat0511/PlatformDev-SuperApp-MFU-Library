"use client";
import { useRouter } from 'next/navigation';
import * as Icons from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type IconNames = keyof typeof Icons;

interface Reservation {
  room: { room: string };
  dateTime: string;
  type: 'confirmed' | 'pending';
}

interface ApiResponse {
  data: Reservation[];
}

export default function Home() {
  const router = useRouter();

  const [roomReservationData, setRoomReservationData] = useState({
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday'],
    datasets: [
      { label: 'Confirmed Reservations', data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#F6FA70' },
      { label: 'Pending Reservations', data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#C7FFD8' },
    ],
  });

  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchRoomReservations = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/reservations');
        const data: ApiResponse = await response.json();

        const confirmedData = new Array(7).fill(0);
        const pendingData = new Array(7).fill(0);

        data.data.forEach((reservation: Reservation) => {
          const reservationDate = new Date(reservation.dateTime);
          const today = new Date();
          const diffDays = Math.floor((today.getTime() - reservationDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays >= 0 && diffDays < 7) {
            if (reservation.type === "confirmed") {
              confirmedData[6 - diffDays] += 1;
            } else if (reservation.type === "pending") {
              pendingData[6 - diffDays] += 1;
            }
          }
        });

        setRoomReservationData((prev) => ({
          ...prev,
          datasets: [
            { ...prev.datasets[0], data: confirmedData },
            { ...prev.datasets[1], data: pendingData },
          ],
        }));

        setRecentReservations(data.data.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch room reservation data:", error);
      }
    };

    fetchRoomReservations();
  }, []);

  const sectionList = [
    { name: "Categories", icon: "ChartBarIcon" as IconNames, route: "/categories" },
    { name: "Books", icon: "BookOpenIcon" as IconNames, route: "/books" },
    { name: "Re News", icon: "NewspaperIcon" as IconNames, route: "/renews" },
    { name: "Reservations", icon: "CalendarIcon" as IconNames, route: "/reservations" },
    { name: "Room Types", icon: "Squares2X2Icon" as IconNames, route: "/room-types" },
    { name: "Rooms", icon: "CubeIcon" as IconNames, route: "/rooms" },
    { name: "Timeslot", icon: "ClockIcon" as IconNames, route: "/timeslot" },
    { name: "Transactions", icon: "CreditCardIcon" as IconNames, route: "/transactions" },
    { name: "Users", icon: "UsersIcon" as IconNames, route: "/users" }
  ];

  const handleIconClick = (route: string) => {
    router.push(route);
  };

  return (
    <main className="flex flex-col gap-4 items-start justify-items-start">
      <div className="w-full p-4 rounded-lg border-2 border-gray-300">
        <div className="grid grid-cols-3 gap-4">
          {sectionList.map((section, index) => {
            const IconComponent = Icons[section.icon];
            return (
              <div 
                key={index} 
                onClick={() => handleIconClick(section.route)} 
                className="flex flex-col items-center bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition border border-gray-300"
              >
                {IconComponent && <IconComponent className="h-8 w-8 text-black-500" />}
                <p className="text-sm mt-2">{section.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex w-full gap-4">
        <div className="w-full bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Room Reservations</h2>
          <Bar
            data={roomReservationData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Room Reservations Over the Last Week' },
              },
              scales: {
                x: { stacked: true },
                y: { 
                  stacked: false,
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  }
                },
              },
            }}
          />
        </div>
      </div>

      <div className="w-full bg-white p-4 rounded-lg shadow-lg mt-4">
        <h2 className="text-2xl font-semibold mb-4">Recent Room Reservations</h2>
        <ul className="space-y-2">
          {recentReservations.length > 0 ? (
            recentReservations.map((reservation, index) => (
              <li key={index} className="border-b pb-2">
                <div>
                  <strong>Room:</strong> {reservation.room.room}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(reservation.dateTime).toLocaleDateString()}
                </div>
                <div>
                  <strong>Status:</strong> {reservation.type}
                </div>
              </li>
            ))
          ) : (
            <p>No recent reservations available.</p>
          )}
        </ul>
      </div>
    </main>
  );
}