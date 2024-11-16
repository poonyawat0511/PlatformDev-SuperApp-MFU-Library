import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Books } from "@/utils/api/interfaces/books";

interface DetailDialogProps {
  visible: boolean;
  book: Books | null;
  onClose: () => void;
}

export default function DetailDialog({ visible, book, onClose }: DetailDialogProps) {
  if (!book) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Image source={{ uri: book.bookImage }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{book.name.en}</Text>
            <Text style={styles.modalDescription}>{book.description.en}</Text>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalDetails}>Quantity: {book.quantity}</Text>
              <Text style={styles.modalDetails}>ISBN: {book.ISBN}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="arrow-back-circle" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modal: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalDetailsContainer: {
    marginTop: 10,
  },
  modalDetails: {
    fontSize: 15,
    color: "gray",
    marginVertical: 2,
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
});
