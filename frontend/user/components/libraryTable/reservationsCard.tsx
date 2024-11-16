import React from "react";
import { Reservations } from "@/utils/api/interfaces/reservations";
import { View, Text, StyleSheet } from "react-native";

interface ReservationsCardProps {
  reservations: Reservations[];
}

const ReservationsCard: React.FC<ReservationsCardProps> = ({
  reservations,
}) => {
  return (
    <View style={styles.reservationCard}>
      {reservations.map((item) => (
        <View key={item.id} style={styles.reservationItem}>
          <Text style={{ fontWeight: "bold" }}>
            Room: {item?.room?.room || "-"}
          </Text>
          <Text>
            <Text>
              Time: {item?.timeSlot?.start || "-"} -{" "}
              {item?.timeSlot?.end || "-"}
            </Text>
            <Text>  </Text>
            <Text
              style={{
                color:
                  item?.type === "confirmed"
                    ? "green"
                    : item?.type === "pending"
                    ? "yellow"
                    : "red",
              }}
            >
              {item?.type || "-"}
            </Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reservationCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
  },
  reservationItem: {
    marginBottom: 10,
  },
});

export default ReservationsCard;
