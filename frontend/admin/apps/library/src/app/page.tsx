"use client";
import * as Icons from '@heroicons/react/24/outline';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type IconNames = keyof typeof Icons;

interface Reservation {
  room: { room: string };
  dateTime: string;
  type: 'confirmed' | 'pending';
}

interface Book {
  id: string;
  name: {
    th: string;
    en: string;
  };
  ISBN: string;
  bookImage: string;
}

interface User {
  id: string;
  username: string;
}

interface Transaction {
  user: User;
  book: Book;
  status: 'borrow' | 'return';
  borrowDate: string;
  returnDate: string | null;
}

interface ApiResponse<T> {
  data: T[];
}

export default function Home() {
  const router = useRouter();

  // States for room reservations
  const [roomReservationData, setRoomReservationData] = useState({
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      { label: 'Confirmed Reservations', data: [0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#A5B68D' },
      { label: 'Pending Reservations', data: [0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#181C14' },
    ],
  });

  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);

  // States for transactions
  const [transactionData, setTransactionData] = useState({
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      { label: 'Borrowed', data: [0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#DBCBBD' },
      { label: 'Returned', data: [0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#31511E' },
    ],
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchRoomReservations = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/reservations');
        const data: ApiResponse<Reservation> = await response.json();

        const confirmedData = new Array(8).fill(0);
        const pendingData = new Array(8).fill(0);

        data.data.forEach((reservation: Reservation) => {
          const reservationDate = new Date(reservation.dateTime);
          const today = new Date();
          const diffDays = Math.floor((today.getTime() - reservationDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays >= 0 && diffDays < 8) {
            if (reservation.type === "confirmed") {
              confirmedData[7 - diffDays] += 1;
            } else if (reservation.type === "pending") {
              pendingData[7 - diffDays] += 1;
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

    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/transactions');
        const data: ApiResponse<Transaction> = await response.json();
    
        const borrowedData = new Array(8).fill(0);
        const returnedData = new Array(8).fill(0);
    
        data.data.forEach((transaction: Transaction) => {
          const transactionDate = transaction.status === 'borrow' ? new Date(transaction.borrowDate) : (transaction.returnDate ? new Date(transaction.returnDate) : null);
          const today = new Date();
          const diffDays = transactionDate ? Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24)) : -1;
    
          if (diffDays >= 0 && diffDays < 8) {
            if (transaction.status === "borrow") {
              borrowedData[7 - diffDays] += 1;
            } else if (transaction.status === "return") {
              returnedData[7 - diffDays] += 1;
            }
          }
        });
    
        setTransactionData((prev) => ({
          ...prev,
          datasets: [
            { ...prev.datasets[0], data: borrowedData },
            { ...prev.datasets[1], data: returnedData },
          ],
        }));
    
        setRecentTransactions(data.data.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      }
    };
    
    fetchRoomReservations();
    fetchTransactions();
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
    <main className="min-h-screen p-6">
      <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Menu
          </h1>
      </div>
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
          <Bar data={roomReservationData} />
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="w-full bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Room Reservations</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Date & Time</th>
              <th className="border px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {recentReservations.map((reservation, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{reservation.room?.room||"-"}</td>
                <td className="border px-4 py-2">{new Date(reservation.dateTime).toLocaleString()}</td>
                <td className="border px-4 py-2">{reservation.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-full bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <Bar data={transactionData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="w-full bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Book</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Borrow Date</th>
              <th className="border px-4 py-2">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{transaction.user?.username||"-"}</td>
                <td className="border px-4 py-2">{transaction.book.name.en||"-"}</td>
                <td className="border px-4 py-2">{transaction.status||"-"}</td>
                <td className="border px-4 py-2">{new Date(transaction.borrowDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </main>
  );
}


