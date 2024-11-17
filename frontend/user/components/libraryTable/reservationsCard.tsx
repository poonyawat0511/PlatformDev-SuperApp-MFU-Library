import React from "react";
import { Reservations } from "@/utils/api/interfaces/reservations";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ReservationsCardProps {
  reservations: Reservations[];
}

const ReservationsCard: React.FC<ReservationsCardProps> = ({
  reservations,
}) => {
  return (
    <View style={styles.reservationCardContainer}>
      {reservations.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card}>
          <Text style={styles.roomText}>Room: {item?.room?.room || "-"}</Text>
          <Text>
          <Text style={styles.timeText}>
            Time: {item?.timeSlot?.start || "-"} -{" "}
            {item?.timeSlot?.end || "-"}
          </Text>
          <Text> : </Text>
          <Text
            style={[
              styles.typeText,
              {
                color:
                  item?.type === "confirmed"
                    ? "#48CFAD"
                    : item?.type === "pending"
                    ? "#F6BB42"
                    : "#FE6454",
              },
            ]}
          >
            {item?.type || "-"}
          </Text>
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reservationCardContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  roomText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  timeText: {
    marginBottom: 5,
  },
  typeText: {
    fontWeight: "bold",
  },
});

export default ReservationsCard;
