import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleBorrowedBooks}
        style={styles.toggleButton}
      >
        <Text style={styles.headerText}>Borrowed Books</Text>
        <FontAwesome
          name={showBorrowedBooks ? "caret-up" : "caret-down"}
          size={20}
          color="#000000"
          style={styles.icon}
        />
      </TouchableOpacity>
      {showBorrowedBooks && (
        <View style={styles.transactionCardContainer}>
          {transactions.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <Text style={styles.bookTitle}>
                Book: {item?.book?.name?.en || "-"}
              </Text>
              <Text style={styles.text}>
                Borrow Date: {new Date(item?.borrowDate || "-").toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                Due Date: {new Date(item?.dueDate || "-").toLocaleDateString()}
              </Text>
              <TouchableOpacity
                onPress={() => onRenewRequest(item.id)}
                style={styles.renewButton}
              >
                <Text style={styles.renewButtonText}>Renew</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
  },
  icon: {
    marginLeft: 10,
  },
  transactionCardContainer: {
    padding: 10,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  transactionCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  bookTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
  },
  renewButton: {
    backgroundColor: "#BD1616",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  renewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BorrowsCard;
