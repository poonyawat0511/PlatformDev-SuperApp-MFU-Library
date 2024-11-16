import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface Borrow {
  id: string;
  book: { name: { en: string } };
  borrowDate: string;
  dueDate: string;
}

interface BorrowsCardProps {
  transactions: Borrow[];
  showBorrowedBooks: boolean;
  toggleBorrowedBooks: () => void;
  onRenewRequest: (transactionId: string) => void;
}

const BorrowsCard: React.FC<BorrowsCardProps> = ({
  transactions,
  showBorrowedBooks,
  toggleBorrowedBooks,
  onRenewRequest,
}) => {
  return (
    <View style={{ margin: 10, alignItems: "center" }}>
      <TouchableOpacity
        onPress={toggleBorrowedBooks}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000000" }}>
          Borrowed Books
        </Text>
        <FontAwesome
          name={showBorrowedBooks ? "caret-up" : "caret-down"}
          size={20}
          color="#000000"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
      {showBorrowedBooks && (
        <View style={styles.transactionCard}>
          {transactions.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <Text style={{ fontWeight: "bold" }}>
                Book: {item?.book?.name?.en || "-"}
              </Text>
              <Text>
                Borrow Date:{" "}
                {new Date(item?.borrowDate || "-").toLocaleDateString()}
              </Text>
              <Text>
                Due Date:{" "}
                {new Date(item?.dueDate || "-").toLocaleDateString()}
              </Text>
              <TouchableOpacity
                onPress={() => onRenewRequest(item.id)}
                style={styles.renewButton}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Renew</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
  },
  transactionItem: {
    marginBottom: 15,
  },
  renewButton: {
    backgroundColor: "#BD1616",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
});

export default BorrowsCard;
